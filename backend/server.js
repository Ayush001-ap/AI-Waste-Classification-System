require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Enhanced waste classification suggestions
const wasteSuggestions = {
    Plastic: {
        suggestion: "Clean and sort by type before recycling. Remove caps and labels. Check local recycling guidelines for accepted plastic types.",
        tips: ["Rinse containers", "Remove non-plastic parts", "Check recycling symbol (1-7)"],
        environmental_impact: "Reduces plastic pollution and conserves petroleum resources"
    },
    Metal: {
        suggestion: "Rinse clean and crush if possible. Most metals can be recycled infinitely without quality loss.",
        tips: ["Remove food residue", "Separate ferrous and non-ferrous metals", "Check for hazardous contents"],
        environmental_impact: "Saves significant energy compared to mining new metals"
    },
    Paper: {
        suggestion: "Keep clean and dry. Remove staples and plastic coatings. Most paper products are recyclable.",
        tips: ["Avoid food-contaminated paper", "Remove plastic windows from envelopes", "Shred sensitive documents"],
        environmental_impact: "Reduces deforestation and water usage in paper production"
    },
    Organic: {
        suggestion: "Perfect for composting or anaerobic digestion. Creates nutrient-rich soil amendment.",
        tips: ["Separate from recyclables", "Chop into smaller pieces", "Balance greens and browns"],
        environmental_impact: "Reduces methane emissions from landfills and creates natural fertilizer"
    },
    Glass: {
        suggestion: "Rinse clean and sort by color if required. Glass can be recycled endlessly.",
        tips: ["Remove caps and lids", "Sort by color when required", "Broken glass is acceptable"],
        environmental_impact: "Saves energy and reduces mining of raw materials"
    },
    Electronic: {
        suggestion: "Contains valuable and hazardous materials. Use certified e-waste recycling facilities.",
        tips: ["Remove batteries first", "Wipe personal data", "Find certified recyclers"],
        environmental_impact: "Prevents toxic material leakage and recovers precious metals"
    },
    Textile: {
        suggestion: "Donate if reusable, recycle if not. Many textiles can be repurposed or recycled into new fibers.",
        tips: ["Check for stains/damage", "Remove non-fabric parts", "Consider textile recycling programs"],
        environmental_impact: "Reduces textile waste in landfills and conserves water/energy in textile production"
    }
};

// Roboflow inference helper using Python SDK
async function analyzeWithRoboflow(filePath) {
    const apiKey = process.env.ROBOFLOW_API_KEY;

    if (!apiKey) {
        throw new Error('Roboflow API key missing');
    }

    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, "../ai-model/roboflow_predict.py");
        const pythonCommand = `python "${pythonScript}" "${filePath}"`;

        exec(pythonCommand, { timeout: 30000 }, (error, stdout, stderr) => {
            if (error) {
                console.error('Roboflow Python script error:', stderr || stdout);
                reject(new Error(`Roboflow analysis failed: ${stderr || stdout || error.message}`));
                return;
            }

            try {
                const outputLines = stdout.trim().split(/\r?\n/).filter(Boolean);
                const lastLine = outputLines.length ? outputLines[outputLines.length - 1] : stdout.trim();
                const result = JSON.parse(lastLine);
                resolve(result);
            } catch (parseError) {
                console.error('Failed to parse Roboflow result:', stdout);
                reject(new Error('Invalid response from Roboflow analysis'));
            }
        });
    });
}

function parseRoboflowResult(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid Roboflow response format');
    }

    if (data.error) {
        throw new Error(`Roboflow analysis error: ${data.error}`);
    }

    return {
        waste_type: data.waste_type || 'Unknown',
        confidence: data.confidence || 0,
        raw: data
    };
}

// Prediction endpoint
app.post("/predict", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "No image file provided",
            message: "Please upload a valid image file"
        });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;

    console.log(`Processing image: ${fileName}`);

    const cleanupFile = () => {
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
    };

    try {
        let result;
        let confidence;
        let predictionSource = 'python';
        let modelWarning = '';

        const localModelPath = path.join(__dirname, '../ai-model/model.h5');
        const hasLocalModel = fs.existsSync(localModelPath) && fs.statSync(localModelPath).size > 0;
        const isRoboflowConfigured = Boolean(
            process.env.ROBOFLOW_API_KEY &&
            (process.env.ROBOFLOW_WORKFLOW_ID || process.env.ROBOFLOW_MODEL_URL || process.env.ROBOFLOW_MODEL)
        );

        const runLocalPrediction = async () => {
            const execResult = await new Promise((resolve, reject) => {
                exec(`python "${path.join(__dirname, "../ai-model/predict.py")}" "${filePath}"`, (err, stdout, stderr) => {
                    if (err) {
                        reject({ err, stderr, stdout });
                    } else {
                        resolve(stdout);
                    }
                });
            });

            const cleanOutput = execResult
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean)
                .map(line => line.replace(/\x1b\[[0-9;]*m/g, ''));

            const lastLine = cleanOutput.length ? cleanOutput[cleanOutput.length - 1] : '';

            let parsed;
            try {
                parsed = JSON.parse(lastLine);
            } catch (parseError) {
                console.error('Failed to parse local model result:', cleanOutput);
                throw new Error('Invalid response from local prediction model');
            }

            if (parsed.error) {
                throw new Error(parsed.error);
            }

            return {
                result: parsed.waste_type || 'Unknown',
                confidence: parsed.confidence || 0
            };
        };

        const runRoboflowPrediction = async () => {
            predictionSource = 'roboflow';
            const roboflowData = await analyzeWithRoboflow(filePath);
            const parsed = parseRoboflowResult(roboflowData);
            return {
                result: parsed.waste_type || 'Unknown',
                confidence: parsed.confidence || 0
            };
        };

        if (isRoboflowConfigured) {
            ({ result, confidence } = await runRoboflowPrediction());
        } else if (hasLocalModel) {
            ({ result, confidence } = await runLocalPrediction());
            modelWarning = 'Roboflow is not configured; using the local model only. Results may be less accurate and are limited to Plastic, Metal, Paper, and Glass. To improve accuracy, set ROBOFLOW_API_KEY and the workflow/model env vars in your .env file.';
            if (confidence < 0.55) {
                modelWarning = 'Local model confidence is low; classification may be unreliable. For better results, configure Roboflow in .env or use a model trained on more waste categories.';
            }
        } else {
            throw new Error('No local model or Roboflow configuration available');
        }

        const wasteInfo = wasteSuggestions[result] || {
            suggestion: "Please handle according to local waste management guidelines.",
            tips: ["Check local regulations", "Consider professional waste disposal services"],
            environmental_impact: "Proper waste management helps protect the environment"
        };

        console.log(`Prediction result (${predictionSource}): ${result}`);

        res.json({
            waste_type: result,
            confidence: confidence,
            suggestion: wasteInfo.suggestion,
            tips: wasteInfo.tips,
            environmental_impact: wasteInfo.environmental_impact,
            source: predictionSource,
            model_warning: modelWarning || undefined,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Prediction error:', error);
        cleanupFile();

        const message = error.response?.data?.error || error.message || 'Unable to analyze the image.';
        res.status(500).json({
            error: "AI prediction failed",
            message: message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        return;
    }

    cleanupFile();
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

// Chatbot endpoint using Groq API
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                error: "Invalid message",
                message: "Please provide a valid message"
            });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                error: "Configuration error",
                message: "API key not configured"
            });
        }

        // System prompt for waste and recycling focused responses
        const systemPrompt = `You are a helpful recycling assistant for WasteWise AI. Your role is to:
- Provide accurate information about waste classification and recycling
- Explain recycling processes for different materials (plastic, paper, metal, glass, organic, electronic, etc.)
- Give environmental impact information
- Suggest proper disposal methods
- Answer questions about waste management and environmental conservation
- Be friendly, informative, and encouraging about recycling efforts
- Keep responses concise but informative
- If asked about non-waste topics, gently redirect to waste/recycling subjects

Always focus on being helpful for waste classification and recycling education.`;

        // Using Groq API for AI-powered responses
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama3.2-3b-preview',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0]?.message?.content;

        if (!aiResponse) {
            return res.status(500).json({
                error: "AI response error",
                message: "Failed to generate response"
            });
        }

        res.json({
            response: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat API error:', error.response?.data?.error?.message || error.message);

        // Provide fallback response if API fails
        const fallbackResponses = [
            "I'm having trouble connecting right now. For recycling questions, try asking about specific waste types like plastic, paper, or metal.",
            "Sorry, I'm temporarily unavailable. Please ask about recycling plastic, paper, metal, glass, or organic waste materials.",
            "Connection issue detected. I can help with waste classification and recycling guidance - what material are you asking about?"
        ];

        res.status(500).json({
            error: "Service temporarily unavailable",
            response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            timestamp: new Date().toISOString()
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);

    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: "File too large",
                message: "Image file must be smaller than 10MB"
            });
        }
    }

    res.status(500).json({
        error: "Internal server error",
        message: "Something went wrong on our end"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Not found",
        message: "The requested endpoint does not exist"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 WasteWise AI Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving frontend from: ${path.join(__dirname, "../frontend")}`);
    console.log(`🖼️  Storing uploads in: ${path.join(__dirname, "../uploads")}`);
});
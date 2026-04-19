// Authentication
let currentLanguage = 'en';
let authMode = 'sign-in';
const authUsersKey = 'ww_users';
const authUserKey = 'ww_user';

function getUsers() {
    return JSON.parse(localStorage.getItem(authUsersKey) || '{}');
}

function saveUsers(users) {
    localStorage.setItem(authUsersKey, JSON.stringify(users));
}

function getLoggedInUser() {
    return localStorage.getItem(authUserKey);
}

function setLoggedInUser(email) {
    localStorage.setItem(authUserKey, email);
}

function clearLoggedInUser() {
    localStorage.removeItem(authUserKey);
}

function showDashboard() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appShell').style.display = 'grid';
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    const users = getUsers();
    const email = getLoggedInUser();
    if (email && users[email] && users[email].name) {
        const subtitle = document.getElementById('brandSubtitle');
        subtitle.textContent = `Welcome back, ${users[email].name}!`;
    }
}

function showAuthScreen() {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('appShell').style.display = 'none';
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'none';
}

function logout() {
    clearLoggedInUser();
    showAuthScreen();
}

function toggleAuthMode() {
    const signUpFields = document.getElementById('signupNameGroup');
    const heading = document.getElementById('authHeading');
    const description = document.getElementById('authDescription');
    const submitBtn = document.getElementById('authSubmitBtn');
    const switchText = document.getElementById('authSwitchText');
    const switchBtn = document.getElementById('authSwitchBtn');
    const nameInput = document.getElementById('authName');
    const authError = document.getElementById('authError');

    authError.textContent = '';

    if (authMode === 'sign-in') {
        authMode = 'sign-up';
        signUpFields.style.display = 'flex';
        heading.textContent = 'Create your account';
        description.textContent = 'Register now and start classifying waste with AI.';
        submitBtn.textContent = 'Sign Up';
        switchText.textContent = 'Already have an account?';
        switchBtn.textContent = 'Sign in';
        nameInput.required = true;
    } else {
        authMode = 'sign-in';
        signUpFields.style.display = 'none';
        heading.textContent = 'Sign in to continue';
        description.textContent = 'Enter your credentials to access the WasteWise dashboard.';
        submitBtn.textContent = 'Sign In';
        switchText.textContent = 'New here?';
        switchBtn.textContent = 'Create an account';
        nameInput.required = false;
    }
}

const API_BASE_URL = (() => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    // Replace this with your deployed backend URL once your backend is hosted.
    return 'https://your-backend-url.com';
})();

function submitAuthForm(event) {
    event.preventDefault();
    const email = document.getElementById('authEmail').value.trim().toLowerCase();
    const password = document.getElementById('authPassword').value;
    const name = document.getElementById('authName').value.trim();
    const authError = document.getElementById('authError');

    authError.textContent = '';
    if (!email || !password) {
        authError.textContent = 'Please provide both email and password.';
        return;
    }

    const users = getUsers();
    if (authMode === 'sign-up') {
        if (users[email]) {
            authError.textContent = 'This email is already registered. Please sign in.';
            return;
        }
        if (!name) {
            authError.textContent = 'Please enter your full name.';
            return;
        }
        users[email] = { name, password };
        saveUsers(users);
        setLoggedInUser(email);
        showDashboard();
    } else {
        if (!users[email] || users[email].password !== password) {
            authError.textContent = 'Invalid email or password.';
            return;
        }
        setLoggedInUser(email);
        showDashboard();
    }
}

// Theme Management
const translations = {
    en: {
        brandTitle: 'WasteWise AI',
        brandSubtitle: 'Smart Classification',
        navDashboard: 'Dashboard',
        navClassify: 'Classify',
        navRecycleBot: 'Recycle Bot',
        navInsights: 'Insights',
        sidebarNote: 'Help the planet by properly classifying and recycling waste.',
        searchPlaceholder: 'Search waste types or recycling tips...',
        heroTitle: 'AI Waste Classification Dashboard',
        heroDescription: 'Upload waste images for instant AI-powered classification and receive clear recycling guidance from your assistant.',
        heroChip1: 'Fast image classification',
        heroChip2: 'Recycle smarter',
        heroChip3: 'Waste category insights',
        metricLabel1: 'Items Classified',
        metricDesc1: 'Waste items analyzed this week.',
        metricLabel2: 'Recycling Rate',
        metricDesc2: 'Of classified items are recyclable.',
        metricLabel3: 'Waste Types',
        metricDesc3: 'Different categories identified.',
        metricLabel4: 'Eco Impact',
        metricDesc4: 'CO2 emissions saved this month.',
        classificationTitle: 'AI Waste Classification',
        classificationDesc: 'Upload or capture waste images and get instant classification with recycling guidance.',
        panelBadge: 'AI Powered',
        uploadPromptTitle: 'Upload waste image for classification',
        uploadPromptDescription: 'Drop a photo of the material and let AI suggest the right recycling path.',
        uploadTip: 'Tip: Use a clear photo with one material type to improve classification accuracy.',
        wasteTag1: 'Plastic',
        wasteTag2: 'Paper',
        wasteTag3: 'Metal',
        wasteTag4: 'Glass',
        wasteTag5: 'Organic',
        wasteTag6: 'Electronic',
        previewHeading: 'Preview',
        changeButton: 'Change',
        analyzeBtn: 'Classify Waste',
        analyzingText: 'Analyzing...',
        resultsHeading: 'Classification Results',
        labelWasteType: 'Waste Type',
        labelConfidence: 'Confidence',
        labelSuggestion: 'Suggestion',
        labelSource: 'Source',
        chatTitle: 'Recycle Assistant',
        chatSubtitle: 'Ask me about recycling and waste management.',
        chatInputPlaceholder: 'Type your question...',
        chatSendButton: 'Send',
        assistantStartText: "Hello! I'm your recycling assistant. Ask me about how to properly recycle different waste types, environmental impact, or waste management tips!",
        loadingText: 'Classifying your waste...',
        languageToggleBtn: 'हिंदी',
        authBrandTitle: 'WasteWise AI',
        authSubtitle: 'Secure login to access waste classification dashboard.',
        authHeading: 'Sign in to continue',
        authDescription: 'Enter your credentials to access the WasteWise dashboard.',
        authEmailLabel: 'Email',
        authNameLabel: 'Full Name',
        authPasswordLabel: 'Password',
        authSubmitBtn: 'Sign In',
        authSwitchText: 'New here?',
        authSwitchBtn: 'Create an account',
        sourceLocal: 'Local model',
        sourceRoboflow: 'Roboflow',
        noGuidance: 'No specific guidance available.',
        messages: {
            selectImage: 'Please select an image first.',
            invalidFile: 'Please select a valid image file.',
            fileTooLarge: 'File size too large. Please select an image under 10MB.',
            analyzeFailed: 'Failed to analyze image. Please try again.'
        }
    },
    hi: {
        brandTitle: 'वेस्टवाइज एआई',
        brandSubtitle: 'स्मार्ट वर्गीकरण',
        navDashboard: 'डैशबोर्ड',
        navClassify: 'वर्गीकृत करें',
        navRecycleBot: 'रिसाइकिल बॉट',
        navInsights: 'इनसाइट्स',
        sidebarNote: 'कृपया कचरे को सही तरीके से वर्गीकृत और पुनर्चक्रण करके पृथ्वी की मदद करें।',
        searchPlaceholder: 'कचरे के प्रकार या पुनर्चक्रण टिप्स खोजें...',
        heroTitle: 'एआई वेस्ट क्लासिफिकेशन डैशबोर्ड',
        heroDescription: 'कचरे की तस्वीरें अपलोड करें, त्वरित एआई वर्गीकरण प्राप्त करें और अपने सहायक से पुनर्चक्रण मार्गदर्शन पाएं।',
        heroChip1: 'तेज़ छवि वर्गीकरण',
        heroChip2: 'स्मार्ट पुनर्चक्रण',
        heroChip3: 'कचरे की श्रेणी इनसाइट्स',
        metricLabel1: 'क्लासिफ़ाइड आइटम',
        metricDesc1: 'इस सप्ताह विश्लेषित कचरे की वस्तुएं।',
        metricLabel2: 'पुनर्चक्रण दर',
        metricDesc2: 'वर्गीकृत वस्तुओं में से पुनर्चक्रण योग्य।',
        metricLabel3: 'कचरे के प्रकार',
        metricDesc3: 'पहचाने गए विभिन्न श्रेणियाँ।',
        metricLabel4: 'इको इम्पैक्ट',
        metricDesc4: 'इस महीने CO2 बचाया गया।',
        classificationTitle: 'एआई वेस्ट क्लासिफिकेशन',
        classificationDesc: 'कचरे की तस्वीरें अपलोड या कैप्चर करें और पुनर्चक्रण मार्गदर्शन के साथ त्वरित वर्गीकरण प्राप्त करें।',
        panelBadge: 'एआई पॉवर्ड',
        uploadPromptTitle: 'क्लासिफिकेशन के लिए कचरे की छवि अपलोड करें',
        uploadPromptDescription: 'सामग्री की एक फोटो डालें और एआई सही पुनर्चक्रण पथ सुझाएगा।',
        uploadTip: 'टिप: वर्गीकरण सटीकता बढ़ाने के लिए एक स्पष्ट फोटो और एक प्रकार की सामग्री उपयोग करें।',
        wasteTag1: 'प्लास्टिक',
        wasteTag2: 'कागज़',
        wasteTag3: 'धातु',
        wasteTag4: 'काच',
        wasteTag5: 'जैविक',
        wasteTag6: 'इलेक्ट्रॉनिक',
        previewHeading: 'पूर्वावलोकन',
        changeButton: 'बदलें',
        analyzeBtn: 'कचरा वर्गीकृत करें',
        analyzingText: 'विश्लेषण किया जा रहा है...',
        resultsHeading: 'वर्गीकरण परिणाम',
        labelWasteType: 'कचरे का प्रकार',
        labelConfidence: 'विश्वास',
        labelSuggestion: 'सुझाव',
        labelSource: 'स्रोत',
        chatTitle: 'रिसाइकिल असिस्टेंट',
        chatSubtitle: 'मुझसे पुनर्चक्रण और कचरा प्रबंधन के बारे में पूछें।',
        chatInputPlaceholder: 'अपना प्रश्न लिखें...',
        chatSendButton: 'भेजें',
        assistantStartText: 'नमस्ते! मैं आपका रिसाइक्लिंग सहायक हूँ। मुझे अलग-अलग कचरे के प्रकारों, पर्यावरणीय प्रभाव या पुनर्चक्रण टिप्स के बारे में पूछें!',
        loadingText: 'आपके कचरे का वर्गीकरण किया जा रहा है...',
        languageToggleBtn: 'English',
        authBrandTitle: 'वेस्टवाइज एआई',
        authSubtitle: 'पुनर्चक्रण वर्गीकरण डैशबोर्ड तक सुरक्षित लॉगिन।',
        authHeading: 'आगे बढ़ने के लिए साइन इन करें',
        authDescription: 'WasteWise डैशबोर्ड तक पहुंचने के लिए अपनी साख दर्ज करें।',
        authEmailLabel: 'ईमेल',
        authNameLabel: 'पूरा नाम',
        authPasswordLabel: 'पासवर्ड',
        authSubmitBtn: 'साइन इन',
        authSwitchText: 'नए उपयोगकर्ता?',
        authSwitchBtn: 'एक खाता बनाएँ',
        sourceLocal: 'स्थानीय मॉडल',
        sourceRoboflow: 'Roboflow',
        noGuidance: 'कोई विशिष्ट मार्गदर्शन उपलब्ध नहीं है।',
        messages: {
            selectImage: 'कृपया पहले एक छवि चुनें।',
            invalidFile: 'कृपया एक मान्य छवि फ़ाइल चुनें।',
            fileTooLarge: 'फ़ाइल बहुत बड़ी है। कृपया 10MB से कम छवि चुनें।',
            analyzeFailed: 'विश्लेषण विफल रहा। कृपया पुनः प्रयास करें।'
        }
    }
};

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-toggle i');

    body.classList.toggle('light-theme');

    if (body.classList.contains('light-theme')) {
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
}

function toggleChatWidget() {
    const panel = document.getElementById('chat-widget-panel');
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) chatInput.focus();
        }, 220);
    }
}

function setLanguage(lang) {
    const selected = translations[lang] ? lang : 'en';
    currentLanguage = selected;
    localStorage.setItem('language', selected);
    document.documentElement.lang = selected === 'hi' ? 'hi' : 'en';

    const keys = Object.keys(translations[selected]);
    keys.forEach((key) => {
        if (key === 'messages' || key === 'sourceLocal' || key === 'sourceRoboflow') {
            return;
        }

        if (key === 'searchPlaceholder') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.placeholder = translations[selected].searchPlaceholder;
            return;
        }

        if (key === 'chatInputPlaceholder') {
            const input = document.getElementById('chatInput');
            if (input) input.placeholder = translations[selected].chatInputPlaceholder;
            return;
        }

        const element = document.getElementById(key);
        if (!element) return;

        if (key === 'changeButton') {
            element.innerHTML = `<i class="fas fa-sync-alt"></i> ${translations[selected].changeButton}`;
            return;
        }

        if (key === 'analyzeBtn') {
            element.innerHTML = `<i class="fas fa-search"></i> ${translations[selected].analyzeBtn}`;
            return;
        }

        if (key === 'chatSendButton') {
            element.innerHTML = `<i class="fas fa-paper-plane"></i> ${translations[selected].chatSendButton}`;
            return;
        }

        element.textContent = translations[selected][key];
    });
}

function toggleLanguage() {
    const nextLanguage = currentLanguage === 'hi' ? 'en' : 'hi';
    setLanguage(nextLanguage);
}

function getTranslation(key) {
    return translations[currentLanguage]?.[key] || translations.en[key] || '';
}

function translateMessage(key) {
    return translations[currentLanguage]?.messages?.[key] || translations.en.messages?.[key] || key;
}

// Initialize theme and language on load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-toggle i');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('light-theme');
        themeIcon.className = 'fas fa-moon';
    }

    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    const loggedIn = getLoggedInUser();
    if (loggedIn) {
        showDashboard();
    } else {
        showAuthScreen();
    }

    const uploadAreaElement = document.getElementById('uploadArea');
    if (uploadAreaElement) {
        // Click on the upload area itself (not the button)
        uploadAreaElement.addEventListener('click', function(e) {
            // Only trigger if the button wasn't clicked
            if (!e.target.closest('button')) {
                const imageInput = document.getElementById('imageInput');
                if (imageInput) imageInput.click();
            }
        });
        
        uploadAreaElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const imageInput = document.getElementById('imageInput');
                if (imageInput) imageInput.click();
            }
        });
    }
});

// File Handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        displayPreview(file);
    }
}

function displayPreview(file) {
    if (!file.type.startsWith('image/')) {
        showNotification(translateMessage('invalidFile'), 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showNotification(translateMessage('fileTooLarge'), 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('preview').src = e.target.result;
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('previewSection').style.display = 'block';
        document.getElementById('resultsCard').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function clearImage() {
    document.getElementById('imageInput').value = '';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('resultsCard').style.display = 'none';
}

// Drag and Drop Functionality
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        // Create a synthetic event for the file input
        const syntheticEvent = { target: { files: [file] } };
        handleFileSelect(syntheticEvent);
    }
});

// Image Upload and Analysis
async function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        showNotification(translateMessage('selectImage'), 'error');
        return;
    }

    // Show loading state
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${getTranslation('analyzingText')}`;
    loadingOverlay.style.display = 'flex';

    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Hide loading state
        loadingOverlay.style.display = 'none';
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `<i class="fas fa-search"></i> ${getTranslation('analyzeBtn')}`;

        // Display results
        displayResults(data);

    } catch (error) {
        console.error('Error:', error);
        loadingOverlay.style.display = 'none';
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `<i class="fas fa-search"></i> ${getTranslation('analyzeBtn')}`;
        showNotification(translateMessage('analyzeFailed'), 'error');
    }
}

// Display Analysis Results
function displayResults(data) {
    const resultsCard = document.getElementById('resultsCard');
    const resultElement = document.getElementById('result');
    const suggestionElement = document.getElementById('suggestion');
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceText = document.getElementById('confidenceText');
    const modelSourceElement = document.getElementById('modelSource');
    const modelNoticeElement = document.getElementById('modelNotice');

    const normalize = (response) => {
        if (typeof response === 'string') {
            try {
                return JSON.parse(response);
            } catch (parseError) {
                return { waste_type: response };
            }
        }

        if (response && typeof response.waste_type === 'string') {
            const value = response.waste_type.trim();
            if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
                try {
                    const nested = JSON.parse(value);
                    if (nested && nested.waste_type) {
                        response.waste_type = nested.waste_type;
                        response.confidence = nested.confidence ?? response.confidence;
                    }
                } catch (parseError) {
                    // keep original string
                }
            }
        }

        return response;
    };

    data = normalize(data);
    console.log('Prediction response:', data);

    // Set waste type
    resultElement.textContent = data.waste_type || 'Unknown';

    // Set suggestion
    suggestionElement.textContent = data.suggestion || getTranslation('noGuidance');

    // Set confidence (mock if not provided)
    const confidence = data.confidence || Math.random() * 0.3 + 0.7; // Random between 0.7-1.0
    const confidencePercent = Math.round(confidence * 100);

    confidenceFill.style.width = `${confidencePercent}%`;
    confidenceText.textContent = `${confidencePercent}%`;

    modelSourceElement.textContent = data.source === 'roboflow' ? getTranslation('sourceRoboflow') : getTranslation('sourceLocal');
    modelNoticeElement.textContent = data.model_warning || '';
    modelNoticeElement.style.display = data.model_warning ? 'block' : 'none';

    // Show results
    resultsCard.style.display = 'block';
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Add to chat history
    addToChatHistory(`I classified your image as: ${data.waste_type}. ${data.suggestion}`, 'ai');
}

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 10000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

// Chat Functionality
async function chat() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    addToChatHistory(message, 'user');
    input.value = '';
    showTypingIndicator();

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message }),
            timeout: 10000
        });

        const data = await response.json();

        if (response.ok) {
            addToChatHistory(data.response, 'ai');
        } else {
            const fallbackResponse = generateSmartReply(message.toLowerCase());
            addToChatHistory(fallbackResponse, 'ai');
        }
    } catch (error) {
        console.error('Chat error:', error);
        const fallbackResponse = generateSmartReply(message.toLowerCase());
        addToChatHistory(fallbackResponse, 'ai');
    } finally {
        hideTypingIndicator();
    }
}

// Typing indicator functions
function showTypingIndicator() {
    const chatBox = document.getElementById('chatBox');
    const existingIndicator = document.getElementById('typingIndicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function submitChatPrompt(text) {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    chatInput.value = text;
    chatInput.focus();
    chat();
}

// Enter key support for chat
document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        chat();
    }
});

function addToChatHistory(message, sender) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';

    const avatarIcon = document.createElement('i');
    avatarIcon.className = sender === 'ai' ? 'fas fa-robot' : 'fas fa-user';
    avatarDiv.appendChild(avatarIcon);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const messageP = document.createElement('p');
    messageP.textContent = message;
    contentDiv.appendChild(messageP);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Enhanced AI Response Generation
function generateSmartReply(input) {
    const responses = {
        plastic: [
            "Plastic recycling is crucial for ocean health! Clean plastics, remove caps, and check the recycling number (1-7). Most curbside programs accept #1-5 plastics.",
            "Did you know? Recycling one plastic bottle saves enough energy to power a 60-watt light bulb for 6 hours. Keep plastics clean and dry!",
            "Plastic waste: Rinse thoroughly, crush bottles to save space, and separate caps if required by your local program. You're helping reduce plastic pollution!"
        ],
        organic: [
            "Organic waste is perfect for composting! Food scraps, yard waste, and paper products create nutrient-rich soil. This prevents methane emissions from landfills.",
            "Composting reduces waste by 20-30% and creates free fertilizer. Start a compost bin at home - it's easier than you think!",
            "For organic waste: Keep it separate from recyclables, avoid meat/dairy if vermicomposting, and turn the pile regularly for best results."
        ],
        metal: [
            "Metal recycling saves massive energy! One recycled aluminum can saves enough energy to run a TV for 3 hours. Clean and crush cans before recycling.",
            "Metals like aluminum, steel, and tin can be recycled infinitely. They maintain their properties through unlimited recycling cycles.",
            "Metal waste tip: Rinse containers, crush them flat, and remove any plastic or paper labels. Most metals are highly valuable for recycling."
        ],
        paper: [
            "Paper recycling saves trees and water! Recycling one ton of paper saves 17 trees and reduces water usage by 50%. Keep paper clean and dry.",
            "Cardboard, newspapers, magazines, and office paper are all recyclable. Remove plastic windows from envelopes and keep it contamination-free.",
            "Paper fact: The average American uses 680 pounds of paper per year. Recycling helps reduce deforestation and energy consumption in paper production."
        ],
        glass: [
            "Glass is 100% recyclable forever! Sort by color if required (clear, green, brown). Broken glass is still recyclable - just be careful handling it.",
            "Glass recycling saves energy and reduces mining. One recycled bottle makes four new bottles. Rinse clean and remove caps/lids.",
            "Glass tip: Don't mix colors unless your program accepts mixed glass. Clean thoroughly and remove any non-glass materials before recycling."
        ],
        electronic: [
            "E-waste contains valuable and hazardous materials. Never throw electronics in regular trash - find certified e-waste recyclers.",
            "Electronics recycling recovers gold, silver, copper, and rare earth metals. It also prevents toxic chemicals from entering landfills.",
            "For e-waste: Wipe data from devices, remove batteries if possible, and take to certified collection points. Many stores offer free e-waste recycling."
        ]
    };

    // Check for specific waste types
    for (const [type, replies] of Object.entries(responses)) {
        if (input.includes(type)) {
            return replies[Math.floor(Math.random() * replies.length)];
        }
    }

    // General questions
    if (input.includes('how') || input.includes('what') || input.includes('where')) {
        return "I'd be happy to help! Could you tell me more about the type of waste you're dealing with? For example: plastic, paper, metal, organic, glass, or electronic waste.";
    }

    if (input.includes('recycle') || input.includes('recycling')) {
        return "Recycling is amazing for the planet! Different materials have different requirements. Plastic needs rinsing, paper stays dry, metals get crushed. Check your local guidelines for specifics.";
    }

    if (input.includes('environment') || input.includes('eco') || input.includes('green') || input.includes('planet')) {
        return "Every recycling action counts! Proper waste sorting reduces landfill waste, saves energy, conserves resources, and protects wildlife. You're making a real difference!";
    }

    if (input.includes('help') || input.includes('assist')) {
        return "I'm here to help with waste classification and recycling! Upload an image for AI classification, or ask me about recycling any material type.";
    }

    // Default response
    const defaultResponses = [
        "That's an interesting question! For specific recycling advice, please mention the waste type (plastic, paper, metal, organic, glass, or electronic).",
        "I specialize in waste classification and recycling guidance. What type of material are you asking about?",
        "I'd love to help with your recycling questions. Could you specify what kind of waste you're dealing with?",
        "For the most accurate advice, please tell me about the specific material: plastic, paper, metal, organic, glass, or electronic waste."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add notification styles dynamically
const notificationStyles = `
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: var(--shadow-sm);
    z-index: 1001;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
    color: var(--text);
}

.notification-error {
    border-color: #ef4444;
}

.notification-error i {
    color: #ef4444;
}

.notification-close {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 6px;
    border-radius: 12px;
    transition: all var(--transition);
}

.notification-close:hover {
    background: rgba(255, 255, 255, 0.1);
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Add drag-over class styles
const dragStyles = `
.upload-area.drag-over {
    border-color: rgba(34, 197, 94, 0.7);
    background: rgba(34, 197, 94, 0.12);
    transform: scale(1.02);
}
`;

const dragStyleSheet = document.createElement('style');
dragStyleSheet.textContent = dragStyles;
document.head.appendChild(dragStyleSheet);
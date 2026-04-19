# WasteWise AI - Smart Waste Classification System

![WasteWise AI](https://img.shields.io/badge/WasteWise-AI-green?style=for-the-badge&logo=recycle)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-orange?style=flat-square&logo=tensorflow)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

An intelligent waste classification system that uses AI to identify waste types and provides recycling guidance through a smart chatbot. Built with modern web technologies and environmental focus.

## 🌟 Features

- **AI Waste Identification**: Advanced machine learning model for accurate waste type classification
- **Recycling Chatbot**: Intelligent assistant that explains recycling processes and environmental impact
- **Real-time Analysis**: Instant classification results with confidence scores
- **User-Friendly Interface**: Clean, modern UI focused on environmental education
- **Smart Upload System**: Drag & drop or camera capture for waste images
- **Recycling Insights**: Educational tips and best practices for waste management
- **Responsive Design**: Optimized for desktop and mobile devices
- **Environmental Impact**: Tracks and displays eco-friendly metrics

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-waste-project
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   cd ai-model
   pip install -r requirements.txt
   cd ..
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
ai-waste-project/
├── frontend/                 # React-style static frontend
│   ├── index.html           # Main HTML file
│   ├── style.css            # Modern CSS with CSS variables
│   └── script.js            # Vanilla JavaScript functionality
├── backend/                 # Node.js Express server
│   └── server.js            # API endpoints and file handling
├── ai-model/                # Python machine learning model
│   ├── model.h5            # Trained TensorFlow model
│   ├── predict.py          # Model inference script
│   └── requirements.txt    # Python dependencies
├── uploads/                 # Temporary file storage
└── package.json            # Node.js dependencies and scripts
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **Vanilla JavaScript** - ES6+ features
- **Font Awesome** - Icon library
- **Google Fonts** - Typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### AI/ML
- **TensorFlow** - Deep learning framework
- **Python** - Model inference
- **OpenCV** - Image processing
- **NumPy** - Numerical computing

## 🎨 Design System

### Color Palette
- **Primary**: `#10b981` (Emerald)
- **Secondary**: `#6366f1` (Indigo)
- **Accent**: `#f59e0b` (Amber)
- **Background**: `#0f172a` (Dark) / `#f8fafc` (Light)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- Modern card-based layout
- Glassmorphism effects
- Smooth animations and transitions
- Consistent spacing system

## 🔧 API Endpoints

### POST /predict
Upload an image for waste classification.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "waste_type": "Plastic",
  "confidence": 0.89,
  "suggestion": "Clean and sort by type before recycling...",
  "tips": ["Rinse containers", "Remove non-plastic parts"],
  "environmental_impact": "Reduces plastic pollution...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /health
Health check endpoint.

## 🤖 AI Model

The system uses a convolutional neural network (CNN) trained on a diverse dataset of waste images. The model classifies waste into the following categories:

- **Plastic** - Bottles, containers, packaging
- **Metal** - Cans, foil, scrap metal
- **Paper** - Documents, cardboard, newspapers
- **Organic** - Food waste, yard waste
- **Glass** - Bottles, jars (by color)
- **Electronic** - E-waste, batteries
- **Textile** - Clothing, fabrics

## 📱 Usage

1. **Upload Image**: Drag and drop or click to select a waste image
2. **AI Analysis**: The system processes the image using machine learning
3. **View Results**: See classification, confidence score, and recycling guidance
4. **Chat Assistant**: Ask questions about recycling and waste management

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install all dependencies
npm run install:all
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
UPLOAD_LIMIT=10485760
```

## 🔒 Security

- File upload validation and size limits
- Input sanitization
- CORS configuration
- Error handling without information leakage

## 📈 Performance

- Optimized images and assets
- Efficient API responses
- Lazy loading where applicable
- Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TensorFlow team for the ML framework
- Unsplash for sample images
- Font Awesome for icons
- Google Fonts for typography

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for a cleaner planet**
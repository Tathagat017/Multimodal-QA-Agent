# Qwen 2.5 VL Multimodal QA Agent

![image](https://github.com/user-attachments/assets/e15bcdc9-4d22-4396-aa85-c42953c1da94)
![image](https://github.com/user-attachments/assets/7a46780b-0a60-4d62-abf3-d6396934e69e)
![image](https://github.com/user-attachments/assets/3048aef0-8f0c-45e4-8bc2-a3ba4e0b0c1d)


A cutting-edge web application powered by **Qwen 2.5 VL 7B**, Alibaba Cloud's state-of-the-art vision-language model. Upload images and ask questions to get intelligent, multilingual responses with support for 29 languages and advanced document analysis.

## 🌟 Features

- **🧠 Qwen 2.5 VL 7B**: Latest open-source multimodal model (Apache 2.0 license)
- **🌍 29 Languages**: Multilingual support for global accessibility
- **📄 Document Analysis**: Advanced OCR and text recognition capabilities
- **🖼️ High-Resolution Processing**: Supports large images with dynamic resolution
- **⚡ Dual Deployment**: Local inference (fastest) + API fallback (reliable)
- **🎨 Modern UI**: Beautiful React interface with Tailwind CSS
- **📊 Real-time Feedback**: Processing time, confidence scores, and detailed responses
- **🔄 Smart Fallback**: Automatic switching between local and cloud inference

## 🏗️ Architecture

### Backend (FastAPI)

- **Framework**: FastAPI with async support
- **Model**: Qwen 2.5 VL 7B (7 billion parameters)
- **Deployment**: Local inference with Hugging Face API fallback
- **Features**: Image processing, multimodal QA, health monitoring

### Frontend (React)

- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **Components**: JSX components with proper React practices
- **Upload**: Drag-and-drop with URL support

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- GPU with 8GB+ VRAM (recommended for local inference)
- Hugging Face account (optional, for API fallback)

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Create virtual environment and install dependencies**:

   ```bash
   python create_venv.py
   ```

3. **Activate virtual environment**:

   ```bash
   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

4. **Optional: Configure Hugging Face API key** (for fallback):

   ```bash
   # Create .env file
   echo "HUGGINGFACE_API_KEY=your_hf_token_here" > .env
   ```

   Get your free token at: https://huggingface.co/settings/tokens

5. **Start the backend server**:
   ```bash
   python main.py
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install and start**:
   ```bash
   python setup_frontend.py
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## 🔧 Model Deployment Options

### Option 1: Local Inference (Recommended)

- **Requirements**: GPU with 8GB+ VRAM, CUDA support
- **Benefits**: Fastest processing, no API limits, complete privacy
- **Setup**: Automatic - the app will try to load locally first

### Option 2: API Fallback

- **Requirements**: Hugging Face account (free)
- **Benefits**: No hardware requirements, always available
- **Setup**: Add `HUGGINGFACE_API_KEY` to `.env` file

### Option 3: No API Key

- **Requirements**: None
- **Benefits**: Works out of the box
- **Limitations**: Rate limited, may have delays

## 🧪 Testing the Application

### Test Cases for Qwen 2.5 VL 7B

#### Test Case 1: Multilingual Document Analysis

- **Image**: Upload a document with text in multiple languages
- **Question**: "Extract and translate all text in this document"
- **Expected**: OCR with multilingual text recognition and translation

#### Test Case 2: Complex Scene Understanding

- **Image**: Upload a complex scene (e.g., busy street, office, kitchen)
- **Question**: "Describe everything you see in detail, including spatial relationships"
- **Expected**: Comprehensive scene analysis with object relationships

#### Test Case 3: Technical Diagram Analysis

- **Image**: Upload a chart, graph, or technical diagram
- **Question**: "Explain what this diagram shows and interpret the data"
- **Expected**: Technical understanding and data interpretation

#### Test Case 4: Cultural Context Recognition

- **Image**: Upload an image with cultural elements
- **Question**: "What cultural context can you identify in this image?"
- **Expected**: Cultural awareness and contextual understanding

## 🎯 Why Qwen 2.5 VL 7B?

### ✅ Advantages

- **🆓 Free & Open Source**: Apache 2.0 license, no usage restrictions
- **🏆 State-of-the-Art**: Competitive with GPT-4V on vision benchmarks
- **🌍 Multilingual**: Native support for 29 languages
- **📚 Context Window**: 32K tokens, extendable to 128K
- **🔧 Flexible**: Works locally or via API
- **⚡ Efficient**: Optimized 7B parameter model

### 🆚 Compared to Other Models

| Feature           | Qwen 2.5 VL 7B | GPT-4V      | Claude 3    | Gemini      |
| ----------------- | -------------- | ----------- | ----------- | ----------- |
| License           | Apache 2.0     | Proprietary | Proprietary | Proprietary |
| Cost              | Free           | $$          | $$$         | $$          |
| Languages         | 29             | Limited     | Limited     | Limited     |
| Local Deployment  | ✅             | ❌          | ❌          | ❌          |
| Document Analysis | ✅✅           | ✅          | ✅          | ✅          |
| Context Window    | 128K           | 128K        | 200K        | 32K         |

## 📁 Project Structure

```
q2/
├── backend/
│   ├── models/
│   │   ├── __init__.py
│   │   └── qa_models.py          # Qwen 2.5 VL integration
│   ├── main.py                   # FastAPI application
│   ├── requirements.txt          # Dependencies with transformers
│   ├── create_venv.py           # Setup script
│   └── .env.example             # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Qwen-branded header
│   │   │   ├── ImageUpload.jsx  # Image upload component
│   │   │   ├── QuestionForm.jsx # Question input
│   │   │   ├── ModelSelector.jsx# Qwen model selector
│   │   │   └── ResultDisplay.jsx# Results with confidence
│   │   ├── services/
│   │   │   └── qaService.js     # API communication
│   │   ├── App.jsx              # Main application
│   │   └── index.js             # React entry point
│   ├── package.json             # Frontend dependencies
│   └── setup_frontend.py        # Frontend setup script
└── README.md                    # This file
```

## 🔧 API Endpoints

### Core Endpoints

- `GET /` - API information and capabilities
- `GET /health` - Health check with model status
- `POST /qa/image-upload` - Process uploaded images
- `POST /qa/image-url` - Process images from URLs
- `GET /models` - Available model information
- `GET /capabilities` - Detailed capability information

### Example API Usage

```bash
# Health check
curl http://localhost:8000/health

# Upload image and ask question
curl -X POST "http://localhost:8000/qa/image-upload" \
  -F "file=@your_image.jpg" \
  -F "question=What do you see in this image?" \
  -F "model=qwen2-vl-7b"
```

## 🛠️ Development

### Local Development

```bash
# Backend hot reload
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend hot reload
cd frontend
npm start
```

### Environment Variables

```env
# Optional: Hugging Face API key for fallback
HUGGINGFACE_API_KEY=your_token_here

# Optional: Custom model cache directory
MODEL_CACHE_DIR=./models

# Optional: Force device selection
DEVICE=cuda  # or cpu, auto
```

## 🚀 Deployment

### Docker Deployment (Coming Soon)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Cloud Deployment

- **Backend**: Deploy to any cloud provider supporting Python/FastAPI
- **Frontend**: Deploy to Vercel, Netlify, or any static hosting
- **Model**: Use Hugging Face Inference API for serverless deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. The Qwen 2.5 VL model is licensed under Apache 2.0.

## 🙏 Acknowledgments

- **Alibaba Cloud**: For developing and open-sourcing Qwen 2.5 VL
- **Hugging Face**: For model hosting and inference infrastructure
- **React & FastAPI**: For excellent development frameworks

## 📞 Support

- **Issues**: Open a GitHub issue for bugs or feature requests
- **Documentation**: Check the `/docs` endpoint when running the API
- **Model Info**: Visit [Qwen 2.5 VL on Hugging Face](https://huggingface.co/Qwen/Qwen2-VL-7B-Instruct)

---

**🎯 Ready to explore multimodal AI with Qwen 2.5 VL 7B? Start by running the quick setup commands above!**

# Qwen 2.5 VL Local Backend Setup

This is a simplified, local-only backend for running Qwen 2.5 VL 7B model.

## Quick Start

### 1. Setup Environment

```bash
cd backend
source venv/Scripts/activate  # Windows
# or source venv/bin/activate  # Linux/Mac

# Install dependencies and setup model
python setup_local_model.py
```

### 2. Start Server

```bash
# Option 1: Using the startup script with proper timeouts (recommended)
python start_server.py

# Option 2: Direct uvicorn with timeout settings
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --timeout-keep-alive 600

# Option 3: Simple uvicorn (basic)
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Test the API

- Server: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## What Changed

### ✅ Simplified Architecture

- **Local-only**: No API fallbacks or external dependencies
- **Single model class**: Uses `AutoModelForVision2Seq` for better compatibility
- **Correct data types**: Uses `bfloat16` instead of `float16`
- **Clean imports**: Only essential dependencies

### ⏱️ Performance & Timing

- **First inference**: 1-2 minutes (model loading + inference)
- **Subsequent inferences**: ~10-30 seconds (model already loaded)
- **Timeouts**: Frontend set to 5 minutes, backend optimized for long processing
- **Memory usage**: ~3GB GPU memory for Qwen 2.5 VL 7B
- **Startup time**: ~30 seconds for model loading

### ✅ Fixed Model Loading

- **Correct model name**: `Qwen/Qwen2.5-VL-7B-Instruct`
- **Proper configuration**: Compatible with Qwen 2.5 VL architecture
- **Better error handling**: Clear error messages and status

### ✅ Minimal Dependencies

- Removed unnecessary AI service APIs (OpenAI, Google, Anthropic)
- Updated transformers to latest compatible version
- Clean requirements.txt with only essentials

## System Requirements

- **GPU Memory**: 8GB+ recommended for optimal performance
- **RAM**: 16GB+ system RAM
- **Storage**: ~10GB for model download
- **CUDA**: Compatible GPU with CUDA support

## Troubleshooting

### Model Loading Issues

```bash
# Clear cache and reinstall
python setup_local_model.py
```

### Memory Issues

- Ensure you have enough GPU memory (8GB+)
- Close other GPU-intensive applications
- Consider using CPU inference (slower but works with less memory)

### Import Errors

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## API Endpoints

- `GET /` - Service information
- `GET /health` - Health check with model status
- `POST /qa/image-upload` - Process image with question
- `POST /qa/image-url` - Process image from URL with question
- `GET /models` - Available models
- `GET /capabilities` - Model capabilities

## Model Information

- **Model**: Qwen 2.5 VL 7B Instruct
- **Developer**: Alibaba Cloud
- **License**: Apache 2.0
- **Capabilities**: Vision + Language understanding
- **Languages**: 29+ supported languages
- **Context**: 32K tokens (extendable to 128K)

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import base64
import io
from PIL import Image
import asyncio
from typing import Optional, Dict, Any
import json
import httpx
from dotenv import load_dotenv

from models.qa_models import MultimodalQAService

load_dotenv()

def _optimize_image_for_speed(image: Image.Image, max_dimension: int = 768) -> Image.Image:
    """Optimize image for faster processing in main.py preprocessing"""
    width, height = image.size
    
    # Use smaller max dimension for even faster processing
    if width > max_dimension or height > max_dimension:
        if width > height:
            new_width = max_dimension
            new_height = int((height * max_dimension) / width)
        else:
            new_height = max_dimension
            new_width = int((width * max_dimension) / height)
        
        # Resize with good quality but faster resampling
        image = image.resize((new_width, new_height), Image.Resampling.BILINEAR)
    
    return image

app = FastAPI(
    title="Qwen 2.5 VL Multimodal QA API", 
    version="2.0.0",
    description="Multimodal Question Answering API powered by Qwen 2.5 VL 7B",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize QA service
qa_service = MultimodalQAService()

@app.get("/")
async def root():
    return {
        "message": "Qwen 2.5 VL Multimodal QA API is running",
        "model": "Qwen 2.5 VL 7B",
        "developer": "Alibaba Cloud",
        "license": "Apache 2.0",
        "capabilities": [
            "Image Understanding",
            "Visual Question Answering",
            "Document Analysis", 
            "OCR and Text Recognition",
            "Multilingual Support (29 languages)",
            "High-resolution Image Processing"
        ]
    }

@app.get("/health")
async def health_check():
    """Comprehensive health check with model information"""
    try:
        health_info = await qa_service.health_check()
        return health_info
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "model": "Qwen 2.5 VL 7B",
            "available_models": qa_service.get_available_models()
        }

@app.post("/qa/image-upload")
async def qa_with_image_upload(
    file: UploadFile = File(...),
    question: str = Form(...),
    model: str = Form(default="qwen2-vl-7b")
):
    """
    Process QA with uploaded image file using Qwen 2.5 VL 7B
    
    - **file**: Image file (PNG, JPG, JPEG, WebP)
    - **question**: Question about the image
    - **model**: Model to use (default: qwen2-vl-7b)
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Check file size (limit to 10MB)
        file_size = 0
        file_data = b""
        while chunk := await file.read(1024):
            file_data += chunk
            file_size += len(chunk)
            if file_size > 10 * 1024 * 1024:  # 10MB limit
                raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
        
        # Process and optimize image
        try:
            image = Image.open(io.BytesIO(file_data))
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Pre-optimize image for faster processing
            original_size = image.size
            image = _optimize_image_for_speed(image)
            if image.size != original_size:
                print(f"📏 Pre-optimized image from {original_size} to {image.size}")
                
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
        
        # Convert to base64 for processing (use JPEG for better compression)
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG", quality=85, optimize=True)
        image_b64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Process QA
        result = await qa_service.process_qa(
            image_b64=image_b64,
            question=question,
            model=model
        )
        
        # Add file metadata
        result["file_info"] = {
            "filename": file.filename,
            "size": file_size,
            "content_type": file.content_type,
            "dimensions": f"{image.width}x{image.height}"
        }
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/qa/image-url")
async def qa_with_image_url(
    image_url: str = Form(...),
    question: str = Form(...),
    model: str = Form(default="qwen2-vl-7b")
):
    """
    Process QA with image URL using Qwen 2.5 VL 7B
    
    - **image_url**: URL of the image to analyze
    - **question**: Question about the image
    - **model**: Model to use (default: qwen2-vl-7b)
    """
    try:
        # Validate URL
        if not image_url.startswith(('http://', 'https://')):
            raise HTTPException(status_code=400, detail="Invalid URL format")
        
        # Download image from URL with timeout and size limits
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(image_url)
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Could not download image from URL. HTTP {response.status_code}"
                    )
                
                # Check content type
                content_type = response.headers.get('content-type', '')
                if not content_type.startswith('image/'):
                    raise HTTPException(status_code=400, detail="URL does not point to an image")
                
                image_data = response.content
                
                # Check size
                if len(image_data) > 10 * 1024 * 1024:  # 10MB limit
                    raise HTTPException(status_code=413, detail="Image too large. Maximum size is 10MB.")
                
            except httpx.TimeoutException:
                raise HTTPException(status_code=408, detail="Timeout downloading image")
            except httpx.RequestError as e:
                raise HTTPException(status_code=400, detail=f"Error downloading image: {str(e)}")
        
        # Process and optimize image
        try:
            image = Image.open(io.BytesIO(image_data))
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Pre-optimize image for faster processing
            original_size = image.size
            image = _optimize_image_for_speed(image)
            if image.size != original_size:
                print(f"📏 Pre-optimized URL image from {original_size} to {image.size}")
                
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")
        
        # Convert to base64 (use JPEG for better compression)
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG", quality=85, optimize=True)
        image_b64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Process QA
        result = await qa_service.process_qa(
            image_b64=image_b64,
            question=question,
            model=model,
            image_url=image_url
        )
        
        # Add URL metadata
        result["url_info"] = {
            "url": image_url,
            "content_type": content_type,
            "size": len(image_data),
            "dimensions": f"{image.width}x{image.height}"
        }
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/models")
async def get_available_models():
    """
    Get list of available models and their information
    """
    return {
        "available_models": qa_service.get_available_models(),
        "primary_model": {
            "name": "Qwen 2.5 VL 7B",
            "developer": "Alibaba Cloud",
            "parameters": "7B",
            "license": "Apache 2.0",
            "languages": 29,
            "capabilities": [
                "Image Understanding",
                "Visual Question Answering",
                "Document Analysis",
                "OCR and Text Recognition",
                "Scene Description",
                "Object Detection",
                "Multilingual Support",
                "High-resolution Processing"
            ]
        }
    }

@app.get("/capabilities")
async def get_capabilities():
    """
    Get detailed information about Qwen 2.5 VL capabilities
    """
    return {
        "model": "Qwen 2.5 VL 7B",
        "vision_capabilities": [
            "Object detection and recognition",
            "Scene understanding and description",
            "Text recognition (OCR) in images",
            "Document analysis and parsing",
            "Chart and graph interpretation",
            "Spatial relationship understanding",
            "Fine-grained visual details recognition"
        ],
        "language_capabilities": [
            "29 supported languages",
            "Multilingual text in images",
            "Cross-lingual understanding",
            "Cultural context awareness"
        ],
        "technical_specs": {
            "context_window": "32K tokens (extendable to 128K)",
            "max_image_resolution": "High resolution support",
            "response_length": "Up to 512 tokens",
            "architecture": "Vision-Language Transformer"
        },
        "supported_formats": ["PNG", "JPG", "JPEG", "WebP"],
        "max_file_size": "10MB",
        "performance": {
            "accuracy": "State-of-the-art on vision-language benchmarks",
            "speed": "Optimized for real-time inference",
            "efficiency": "7B parameters with MoE optimization"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
#!/usr/bin/env python3
"""
Simple server startup script with proper timeout settings for AI inference
"""

import uvicorn
import sys
import os

def main():
    print("🚀 Starting Qwen 2.5 VL Server...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📚 API docs: http://localhost:8000/docs")
    print("⏳ First AI inference may take 1-2 minutes")
    print("🔄 Model loading in progress...")
    print("")
    
    # Start uvicorn with proper settings for long AI inference
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Disable reload for production
        timeout_keep_alive=600,  # 10 minutes keep-alive
        timeout_graceful_shutdown=30,  # 30 seconds graceful shutdown
        access_log=True,
        log_level="info"
    )

if __name__ == "__main__":
    main() 
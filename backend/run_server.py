#!/usr/bin/env python3
"""
Simple server runner for Qwen 2.5 VL Local Model
"""

import sys
import os
from pathlib import Path

def main():
    print("🚀 Starting Qwen 2.5 VL Local Server")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path("main.py").exists():
        print("❌ main.py not found. Please run this script from the backend directory.")
        sys.exit(1)
    
    # Check if virtual environment is activated
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Virtual environment not detected. Consider activating your venv.")
        print("   Run: source venv/Scripts/activate (Windows) or source venv/bin/activate (Linux/Mac)")
        print()
    
    # Import and run the main server
    try:
        print("🔄 Loading server...")
        import uvicorn
        
        print("🎯 Starting FastAPI server...")
        print("📡 Server will be available at: http://localhost:8000")
        print("📚 API docs available at: http://localhost:8000/docs")
        print("🔧 To stop the server, press Ctrl+C")
        print()
        
        # Start the server
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=False,  # Disable reload for stability with large models
            log_level="info"
        )
        
    except ImportError as e:
        print(f"❌ Failed to import required modules: {e}")
        print("💡 Try running: python setup_local_model.py")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
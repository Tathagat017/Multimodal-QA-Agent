#!/usr/bin/env python3
"""
Setup script for Qwen 2.5 VL Local Model
This script ensures proper installation and configuration
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def main():
    print("🚀 Setting up Qwen 2.5 VL Local Model Environment")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("requirements.txt").exists():
        print("❌ requirements.txt not found. Please run this script from the backend directory.")
        sys.exit(1)
    
    # Step 1: Upgrade pip
    if not run_command("python -m pip install --upgrade pip", "Upgrading pip"):
        sys.exit(1)
    
    # Step 2: Install requirements
    if not run_command("pip install -r requirements.txt", "Installing requirements"):
        sys.exit(1)
    
    # Step 3: Clear Hugging Face cache (optional)
    print("\n🧹 Clearing Hugging Face cache...")
    hf_cache_dir = Path.home() / ".cache" / "huggingface"
    if hf_cache_dir.exists():
        try:
            import shutil
            shutil.rmtree(hf_cache_dir / "hub" / "models--Qwen--Qwen2.5-VL-7B-Instruct", ignore_errors=True)
            print("✅ Cleared old model cache")
        except Exception as e:
            print(f"⚠️ Could not clear cache: {e}")
    
    # Step 4: Test imports
    print("\n🧪 Testing imports...")
    try:
        import torch
        print(f"✅ PyTorch {torch.__version__} installed")
        print(f"🎮 CUDA available: {torch.cuda.is_available()}")
        if torch.cuda.is_available():
            print(f"🎮 GPU: {torch.cuda.get_device_name(0)}")
            print(f"🎮 GPU Memory: {torch.cuda.get_device_properties(0).total_memory // 1024**3}GB")
        
        from transformers import AutoModel, AutoProcessor
        print("✅ Transformers installed successfully")
        
    except ImportError as e:
        print(f"❌ Import test failed: {e}")
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("📋 Next steps:")
    print("1. Run 'python main.py' to start the server")
    print("2. The model will download automatically on first use (~8GB)")
    print("3. Make sure you have at least 8GB GPU memory for optimal performance")

if __name__ == "__main__":
    main() 
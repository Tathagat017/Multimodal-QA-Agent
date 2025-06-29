#!/usr/bin/env python3
"""
Test script to debug Hugging Face API connection
"""

import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_model_gating():
    """Check if models are gated and require acceptance"""
    api_key = os.getenv("HUGGINGFACE_API_KEY")
    
    models_to_test = [
        "Qwen/Qwen2.5-VL-7B-Instruct",  # Correct model name
        "Qwen/Qwen2-VL-7B-Instruct",    # Old name we were using
        "microsoft/DialoGPT-medium",     # Simple test model
        "gpt2"                          # Basic model
    ]
    
    headers = {
        "Authorization": f"Bearer {api_key}",
    }
    
    for model in models_to_test:
        print(f"\n🔍 Testing model access: {model}")
        
        # Test 1: Check model info (GET request)
        info_url = f"https://huggingface.co/api/models/{model}"
        try:
            response = requests.get(info_url, headers=headers, timeout=10)
            print(f"   Model info status: {response.status_code}")
            
            if response.status_code == 200:
                model_info = response.json()
                print(f"   ✅ Model accessible!")
                print(f"   Gated: {model_info.get('gated', False)}")
                print(f"   Private: {model_info.get('private', False)}")
                
                # Check if inference API is available
                if 'inference' in model_info:
                    print(f"   Inference API: {model_info['inference']}")
                
            elif response.status_code == 401:
                print(f"   ❌ 401 Unauthorized - API key issue or gated model")
            elif response.status_code == 403:
                print(f"   ❌ 403 Forbidden - Need to accept model terms")
            elif response.status_code == 404:
                print(f"   ❌ 404 Not Found - Model doesn't exist")
            else:
                print(f"   ❓ Status {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            print(f"   💥 Error checking model info: {e}")
        
        # Test 2: Try inference API
        inference_url = f"https://api-inference.huggingface.co/models/{model}"
        try:
            payload = {
                "inputs": "Hello, what is AI?",
                "parameters": {"max_new_tokens": 50}
            }
            
            response = requests.post(inference_url, headers=headers, json=payload, timeout=30)
            print(f"   Inference status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ Inference API works!")
                return model
            elif response.status_code == 401:
                print(f"   ❌ 401 - Invalid API key or need to accept terms")
            elif response.status_code == 403:
                print(f"   ❌ 403 - Forbidden, likely need to accept model license")
            elif response.status_code == 404:
                print(f"   ❌ 404 - Inference API not available for this model")
            elif response.status_code == 503:
                print(f"   ⏳ 503 - Model loading, try again later")
            else:
                print(f"   ❓ Status {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            print(f"   💥 Error testing inference: {e}")
    
    return None

def check_api_key_permissions():
    """Check what the API key can access"""
    api_key = os.getenv("HUGGINGFACE_API_KEY")
    
    print(f"\n🔑 Testing API Key Permissions...")
    
    # Test user info
    headers = {"Authorization": f"Bearer {api_key}"}
    
    try:
        response = requests.get("https://huggingface.co/api/whoami", headers=headers, timeout=10)
        print(f"   User info status: {response.status_code}")
        
        if response.status_code == 200:
            user_info = response.json()
            print(f"   ✅ API key valid!")
            print(f"   User: {user_info.get('name', 'Unknown')}")
            print(f"   Type: {user_info.get('type', 'Unknown')}")
            
            # Check orgs if available
            if 'orgs' in user_info:
                print(f"   Organizations: {len(user_info['orgs'])}")
        else:
            print(f"   ❌ API key invalid: {response.text}")
            
    except Exception as e:
        print(f"   💥 Error checking API key: {e}")

def test_vision_model_inference():
    """Test the correct Qwen2.5-VL model with proper vision format"""
    api_key = os.getenv("HUGGINGFACE_API_KEY")
    
    model_name = "Qwen/Qwen2.5-VL-7B-Instruct"
    url = f"https://api-inference.huggingface.co/models/{model_name}"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    print(f"\n🎯 Testing Vision Model: {model_name}")
    
    # Test with text-only first (simpler)
    payload_text = {
        "inputs": "What is the moon? Please provide a brief explanation.",
        "parameters": {
            "max_new_tokens": 100,
            "temperature": 0.1
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload_text, timeout=30)
        print(f"   Text-only inference status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Success! Response: {result}")
            return True
        else:
            print(f"   ❌ Error: {response.text}")
            
            # If text fails, the model might not support Inference API
            if response.status_code == 404:
                print(f"   💡 This model might not support Inference API")
                print(f"   💡 Consider using local inference instead")
            
    except Exception as e:
        print(f"   💥 Error: {e}")
    
    return False

if __name__ == "__main__":
    print("🚀 Hugging Face API Gating & Access Debug")
    print("=" * 60)
    
    # Test 1: Check API key permissions
    check_api_key_permissions()
    
    # Test 2: Check model gating and access
    print("\n" + "=" * 60)
    working_model = test_model_gating()
    
    # Test 3: Test the correct vision model
    print("\n" + "=" * 60)
    vision_works = test_vision_model_inference()
    
    print("\n" + "=" * 60)
    print("📋 FINAL DIAGNOSIS:")
    
    if working_model:
        print(f"   ✅ Working model found: {working_model}")
    else:
        print(f"   ❌ No working models found")
    
    if vision_works:
        print(f"   ✅ Qwen2.5-VL inference works!")
    else:
        print(f"   ❌ Qwen2.5-VL inference failed")
        print(f"\n🔧 SOLUTIONS:")
        print(f"   1. Visit https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct")
        print(f"   2. Click 'Agree and access repository' if there's a license agreement")
        print(f"   3. Check if the model supports Inference API (it might be local-only)")
        print(f"   4. Consider switching to local inference")
        print(f"   5. Alternative: Use OpenAI GPT-4 Vision or Google Gemini Vision") 
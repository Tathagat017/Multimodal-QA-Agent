import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

class QAService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 300000, // 5 minutes timeout for AI model inference (first inference takes ~45s, subsequent ones are faster)
    });
  }

  async submitWithUpload(file, question, model = "gpt-4o") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);
    formData.append("model", model);

    try {
      const response = await this.api.post("/qa/image-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 5 minutes for AI inference
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async submitWithUrl(imageUrl, question, model = "gpt-4o") {
    const formData = new FormData();
    formData.append("image_url", imageUrl);
    formData.append("question", question);
    formData.append("model", model);

    try {
      const response = await this.api.post("/qa/image-url", formData, {
        timeout: 300000, // 5 minutes for AI inference
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async getAvailableModels() {
    try {
      const response = await this.api.get("/models");
      return response.data.models;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async healthCheck() {
    try {
      const response = await this.api.get("/health");
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  _handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.detail ||
        error.response.data?.message ||
        "Server error occurred";
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error(
        "No response from server. Please check your connection and try again."
      );
    } else {
      // Something else happened
      return new Error(error.message || "An unexpected error occurred");
    }
  }
}

export const qaService = new QAService();

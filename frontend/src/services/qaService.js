import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

class QAService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 600000, // 10 minutes timeout for AI model inference (first inference can take longer)
    });
    this.currentController = null; // Track current request for cancellation
  }

  async submitWithUpload(file, question, model = "gpt-4o") {
    // Cancel any existing request
    this.cancelCurrentRequest();

    // Create new abort controller for this request
    this.currentController = new AbortController();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);
    formData.append("model", model);

    try {
      const response = await this.api.post("/qa/image-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 600000, // 10 minutes for AI inference
        signal: this.currentController.signal, // Add cancellation support
      });

      // Clear controller on successful completion
      this.currentController = null;
      return response.data;
    } catch (error) {
      // Clear controller on error (including cancellation)
      this.currentController = null;

      // Don't throw error if request was cancelled
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        console.log("Request was cancelled");
        return { cancelled: true };
      }

      throw this._handleError(error);
    }
  }

  async submitWithUrl(imageUrl, question, model = "gpt-4o") {
    // Cancel any existing request
    this.cancelCurrentRequest();

    // Create new abort controller for this request
    this.currentController = new AbortController();

    const formData = new FormData();
    formData.append("image_url", imageUrl);
    formData.append("question", question);
    formData.append("model", model);

    try {
      const response = await this.api.post("/qa/image-url", formData, {
        timeout: 600000, // 10 minutes for AI inference
        signal: this.currentController.signal, // Add cancellation support
      });

      // Clear controller on successful completion
      this.currentController = null;
      return response.data;
    } catch (error) {
      // Clear controller on error (including cancellation)
      this.currentController = null;

      // Don't throw error if request was cancelled
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        console.log("Request was cancelled");
        return { cancelled: true };
      }

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

  cancelCurrentRequest() {
    if (this.currentController) {
      console.log("Cancelling previous request...");
      this.currentController.abort();
      this.currentController = null;
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

import React, { useState, useCallback } from "react";
import ImageUpload from "./components/ImageUpload.jsx";
import QuestionForm from "./components/QuestionForm.jsx";
import ResultDisplay from "./components/ResultDisplay.jsx";
import ModelSelector from "./components/ModelSelector.jsx";
import Header from "./components/Header.jsx";
import { qaService } from "./services/qaService";

function App() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [selectedModel, setSelectedModel] = useState("qwen2-vl-7b-local");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleImageUpload = useCallback((file, preview) => {
    setImage({ file, preview });
    setImageUrl("");
    setError(null);
  }, []);

  const handleImageUrl = useCallback((url) => {
    setImageUrl(url);
    setImage(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    if (!image && !imageUrl) {
      setError("Please upload an image or provide an image URL");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;

      if (image) {
        response = await qaService.submitWithUpload(
          image.file,
          question,
          selectedModel
        );
      } else {
        response = await qaService.submitWithUrl(
          imageUrl,
          question,
          selectedModel
        );
      }

      // Check if request was cancelled
      if (response.cancelled) {
        console.log("Request was cancelled by user");
        return; // Don't update result or add to history
      }

      setResult(response);

      // Add to history
      const historyItem = {
        id: Date.now(),
        question,
        image: image?.preview || imageUrl,
        result: response,
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 items
    } catch (err) {
      setError(
        err.message || "An error occurred while processing your request"
      );
    } finally {
      setLoading(false);
    }
  }, [question, image, imageUrl, selectedModel]);

  const handleCancel = useCallback(() => {
    qaService.cancelCurrentRequest();
    setLoading(false);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setImage(null);
    setImageUrl("");
    setQuestion("");
    setResult(null);
    setError(null);
  }, []);

  const handleHistorySelect = useCallback((historyItem) => {
    setQuestion(historyItem.question);
    setResult(historyItem.result);

    if (historyItem.image.startsWith("http")) {
      setImageUrl(historyItem.image);
      setImage(null);
    } else {
      // For uploaded images, we just show the preview
      setImage({ preview: historyItem.image });
      setImageUrl("");
    }
  }, []);

  const isSubmitDisabled = (!image && !imageUrl) || !question.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Panel - Input */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upload Image & Ask Question
              </h2>

              <ImageUpload
                onImageUpload={handleImageUpload}
                onImageUrl={handleImageUrl}
                currentImage={image?.preview || imageUrl}
              />

              <div className="mt-6">
                <QuestionForm
                  question={question}
                  onQuestionChange={setQuestion}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  loading={loading}
                  disabled={isSubmitDisabled}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-4 items-center">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />

                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* Result Display */}
            {(result || loading) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Analysis Result
                </h2>
                <ResultDisplay result={result} loading={loading} />
              </div>
            )}
          </div>

          {/* Right Panel - History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Queries
            </h2>

            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No queries yet. Upload an image and ask a question to get
                started!
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleHistorySelect(item)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleHistorySelect(item);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={item.image}
                        alt="Query"
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {item.question}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {item.result.model_used}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

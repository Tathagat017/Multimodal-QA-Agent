import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Link, X, Image as ImageIcon } from "lucide-react";

const ImageUpload = ({ onImageUpload, onImageUrl, currentImage }) => {
  const [urlInput, setUrlInput] = useState("");
  const [uploadMode, setUploadMode] = useState("upload");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        onImageUpload(file, preview);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onImageUrl(urlInput.trim());
      setUrlInput("");
    }
  }, [urlInput, onImageUrl]);

  const handleClearImage = useCallback(() => {
    onImageUpload(null, null);
    onImageUrl("");
    setUrlInput("");
  }, [onImageUpload, onImageUrl]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleUrlSubmit();
      }
    },
    [handleUrlSubmit]
  );

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setUploadMode("upload")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            uploadMode === "upload"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setUploadMode("url")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            uploadMode === "url"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Link className="w-4 h-4 inline mr-2" />
          Image URL
        </button>
      </div>

      {/* Upload Area */}
      {uploadMode === "upload" && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-blue-600">Drop the image here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPEG, PNG, GIF, BMP, WebP (max 10MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* URL Input */}
      {uploadMode === "url" && (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL (https://...)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={handleKeyPress}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Load
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Enter a direct link to an image file
          </p>
        </div>
      )}

      {/* Image Preview */}
      {currentImage && (
        <div className="relative">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start space-x-4">
              <img
                src={currentImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-2">Image Loaded</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Ready for analysis. You can now ask questions about this
                  image.
                </p>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

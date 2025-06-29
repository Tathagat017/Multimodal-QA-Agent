import React, { useMemo } from "react";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  RefreshCw,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const ResultDisplay = ({ result, loading }) => {
  const getStatusIcon = useMemo(() => {
    if (!result) return null;

    return result.success ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    );
  }, [result]);

  const getConfidenceColor = useMemo(() => {
    return (confidence) => {
      if (confidence >= 0.8) return "text-green-600 bg-green-100";
      if (confidence >= 0.6) return "text-yellow-600 bg-yellow-100";
      if (confidence >= 0.4) return "text-orange-600 bg-orange-100";
      return "text-red-600 bg-red-100";
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Analyzing image with AI...</p>
          <p className="text-sm text-gray-500 mt-2">
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon}
          <span
            className={`font-medium ${
              result.success ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.success ? "Analysis Complete" : "Analysis Failed"}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{result.processing_time?.toFixed(2)}s</span>
          </div>

          {result.fallback_used && (
            <div className="flex items-center space-x-1 text-orange-600">
              <RefreshCw className="w-4 h-4" />
              <span>Fallback Used</span>
            </div>
          )}
        </div>
      </div>

      {/* Model and Confidence Info */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Model:</span>
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {result.model_used}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Confidence:</span>
          <span
            className={`text-sm px-2 py-1 rounded ${getConfidenceColor(
              result.confidence
            )}`}
          >
            {(result.confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Answer */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-3">Answer:</h3>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{result.answer}</ReactMarkdown>
        </div>
      </div>

      {/* Question */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Question Asked:
        </h4>
        <p className="text-sm text-gray-600 italic">"{result.question}"</p>
      </div>

      {/* Error Details */}
      {result.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Error Details:
          </h4>
          <p className="text-sm text-red-700">{result.error}</p>
        </div>
      )}

      {/* Bounding Boxes (if available) */}
      {result.bounding_boxes && result.bounding_boxes.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Detected Regions:
          </h4>
          <div className="space-y-2">
            {result.bounding_boxes.map((box, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
              >
                {box.label}: ({box.x}, {box.y}, {box.width}, {box.height})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-xs text-gray-400 border-t pt-2">
        Analyzed at: {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default ResultDisplay;

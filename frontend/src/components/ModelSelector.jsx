import React, { useCallback } from "react";
import { Brain, Zap } from "lucide-react";

const ModelSelector = ({ selectedModel, onModelChange }) => {
  const models = [
    {
      value: "qwen2-vl-7b-local",
      label: "Qwen 2.5 VL 7B (Local)",
      description: "Local inference - fastest",
      badge: "Recommended",
      badgeColor: "bg-green-100 text-green-800",
    },
    {
      value: "qwen2-vl-7b-api",
      label: "Qwen 2.5 VL 7B (API)",
      description: "Cloud inference - reliable",
      badge: "Fallback",
      badgeColor: "bg-blue-100 text-blue-800",
    },
  ];

  const handleModelChange = useCallback(
    (e) => {
      onModelChange(e.target.value);
    },
    [onModelChange]
  );

  const selectedModelInfo =
    models.find((m) => m.value === selectedModel) || models[0];

  return (
    <div className="space-y-3">
      {/* Model Info Header */}
      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <Brain className="w-5 h-5 text-blue-600" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900">Qwen 2.5 VL 7B</h3>
          <p className="text-sm text-blue-700">
            State-of-the-art vision-language model by Alibaba Cloud
          </p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Apache 2.0
          </span>
          <span className="text-xs text-blue-600 font-medium">
            29 Languages
          </span>
        </div>
      </div>

      {/* Model Selector */}
      <div className="flex items-center space-x-2">
        <Zap className="w-4 h-4 text-gray-500" />
        <div className="flex-1">
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label} - {model.description}
              </option>
            ))}
          </select>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${selectedModelInfo.badgeColor}`}
        >
          {selectedModelInfo.badge}
        </span>
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-1 text-gray-600">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Image Understanding</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>Document Analysis</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span>OCR & Text Recognition</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span>Multilingual Support</span>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;

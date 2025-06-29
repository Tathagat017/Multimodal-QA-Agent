import React from "react";
import { Brain, Eye, MessageCircle, Globe, Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <Eye className="w-8 h-8 text-green-600" />
          <MessageCircle className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Qwen 2.5 VL Multimodal QA
      </h1>

      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
        Upload an image and ask questions about it. Powered by Qwen 2.5 VL 7B,
        Alibaba Cloud's state-of-the-art vision-language model with support for
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center space-x-1">
          <Brain className="w-3 h-3" />
          <span>Qwen 2.5 VL 7B</span>
        </span>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
          <Globe className="w-3 h-3" />
          <span>29 Languages</span>
        </span>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center space-x-1">
          <Eye className="w-3 h-3" />
          <span>Vision + Text</span>
        </span>
        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center space-x-1">
          <Zap className="w-3 h-3" />
          <span>Apache 2.0</span>
        </span>
      </div>
    </header>
  );
};

export default Header;

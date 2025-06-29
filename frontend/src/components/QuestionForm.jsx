import React, { useCallback } from "react";
import { Send, Loader2 } from "lucide-react";

const QuestionForm = ({
  question,
  onQuestionChange,
  onSubmit,
  loading,
  disabled,
}) => {
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!disabled && !loading) {
        onSubmit();
      }
    },
    [disabled, loading, onSubmit]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleTextareaChange = useCallback(
    (e) => {
      onQuestionChange(e.target.value);
    },
    [onQuestionChange]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          What would you like to know about this image?
        </label>
        <textarea
          id="question"
          value={question}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          placeholder="e.g., What objects are in this image? What is the person doing? Describe the scene..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          disabled={loading}
        />
        <p className="text-sm text-gray-500 mt-1">
          Press Enter to submit, Shift+Enter for new line
        </p>
        <p className="text-sm text-amber-600 mt-1">
          ⏳ First AI response may take 1-2 minutes as the model loads.
          Subsequent responses will be faster.
        </p>
      </div>

      <button
        type="submit"
        disabled={disabled || loading}
        className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
          disabled || loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>AI is thinking... (This may take 1-2 minutes)</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Ask Question</span>
          </>
        )}
      </button>
    </form>
  );
};

export default QuestionForm;

import React from 'react';
import { ArrowUp } from 'lucide-react'

export default function ChatInput({
  query, onQueryChange, onSendMessage, isLoading
}) {
  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow focus-within:shadow-lg focus-within:border-black">
          <textarea
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.ctrlKey && !isLoading) {
                onSendMessage();
              }
            }}
            disabled={isLoading}
            placeholder="Ask me anything... (math, code, explanations, questions)"
            className="w-full px-4 py-3 text-sm font-normal bg-transparent placeholder:text-gray-400 focus:outline-none resize-none max-h-32 disabled:opacity-50"
            rows="2"
          />
         
          {/* Send button */}
          <button
            onClick={onSendMessage}
            disabled={isLoading || !query.trim()}
            className="absolute cursor-pointer bottom-3 right-3 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send (Ctrl+Enter)"
          >
            <ArrowUp size={18} />
          </button>
        </div>

        {/* Hint text */}
        <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to send</p>
      </div>
    </div>
  )
}

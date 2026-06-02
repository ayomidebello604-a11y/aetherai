import { useEffect, useRef } from 'react';
import React from 'react'
import Greeting from '@/components/ui/Greeting';
import { useUser } from '@/utils/hooks/useUser';
import { useEffect as useLayoutEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Component to render LaTeX math
const MathRenderer = ({ math }) => {
  const ref = React.useRef(null);
  
  React.useEffect(() => {
    if (ref.current && math) {
      try {
        // Properly remove delimiters
        let mathContent = math.trim();
        let isDisplay = false;
        
        // Determine if display mode
        isDisplay = mathContent.startsWith('$$') || mathContent.startsWith('\\[');
        
        // Remove delimiters
        if (mathContent.startsWith('$$') && mathContent.endsWith('$$')) {
          mathContent = mathContent.slice(2, -2);
        } else if (mathContent.startsWith('$') && mathContent.endsWith('$')) {
          mathContent = mathContent.slice(1, -1);
        } else if (mathContent.startsWith('\\[') && mathContent.endsWith('\\]')) {
          mathContent = mathContent.slice(2, -2);
        } else if (mathContent.startsWith('\\(') && mathContent.endsWith('\\)')) {
          mathContent = mathContent.slice(2, -2);
        }
        // If no delimiters were removed, it might be a \boxed expression without $ signs
        // \boxed needs to be in math mode for KaTeX to render it
        
        mathContent = mathContent.trim();
        
        if (mathContent) {
          katex.render(mathContent, ref.current, {
            displayMode: isDisplay,
            throwOnError: false,
          });
        }
      } catch (e) {
        console.error('Math rendering error:', e);
        if (ref.current) {
          ref.current.textContent = math;
        }
      }
    }
  }, [math]);
  
  return <span ref={ref} className="inline-math" />;
};

// Helper component to render text with math support
const renderTextWithMath = (text) => {
  if (!text) return [];
  
  const parts = [];
  let lastIndex = 0;
  
  // Match both display and inline math, and boxed expressions
  // Order matters: check longest patterns first
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$]+\$|\\boxed\{[^}]+\})/g;
  let match;
  
  while ((match = mathRegex.exec(text)) !== null) {
    // Skip single $ signs that are just currency symbols
    if (match[0] === '$') {
      continue;
    }
    
    // Add text before the math
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index);
      parts.push({
        type: 'text',
        content: textBefore
      });
    }
    
    // Add the math
    parts.push({
      type: 'math',
      content: match[0]
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex);
    parts.push({
      type: 'text',
      content: textAfter
    });
  }
  
  return parts.length === 0 ? [{ type: 'text', content: text }] : parts;
};

// Helper component to render markdown-like content
const MessageContent = ({ text, isError }) => {
  if (isError) {
    return (
      <div className="text-red-600">
        <p className="text-sm">{text}</p>
      </div>
    )
  }

  // Split content by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g)

  return (
    <div className="text-sm space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Code block - extract language
          const codeMatch = part.match(/```(\w+)?\n?([\s\S]*?)\n?```/)
          const language = codeMatch?.[1] || 'text'
          const codeContent = codeMatch?.[2] || part.replace(/```\n?/g, '').trim()
          return (
            <div key={index}>
              <p className="text-xs font-semibold text-gray-600 mb-2">{language}</p>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-xs">
                <code>{codeContent}</code>
              </pre>
            </div>
          )
        } else if (part.includes('**')) {
          // Bold text and enhanced formatting with math support
          return (
            <p key={index} className="leading-relaxed">
              {part.split(/(\*\*[^*]+\*\*)/g).map((segment, i) => {
                if (segment.startsWith('**')) {
                  return <strong key={i} className="font-semibold">{segment.replace(/\*\*/g, '')}</strong>
                }
                // Check if segment contains math
                const mathParts = renderTextWithMath(segment);
                return (
                  <React.Fragment key={i}>
                    {mathParts.map((p, j) => 
                      p.type === 'math' ? 
                        <MathRenderer key={j} math={p.content} /> : 
                        <span key={j}>{p.content}</span>
                    )}
                  </React.Fragment>
                );
              })}
            </p>
          )
        } else if (part.includes('- ') || part.includes('* ')) {
          // Bullet points with math support
          return (
            <ul key={index} className="list-disc list-inside space-y-1 pl-2">
              {part.split('\n').filter(line => line.trim()).map((line, i) => {
                const cleanLine = line.replace(/^[\s\-\*]+/, '').trim();
                const mathParts = renderTextWithMath(cleanLine);
                return (
                  <li key={i} className="text-sm">
                    {mathParts.map((p, j) => 
                      p.type === 'math' ? 
                        <MathRenderer key={j} math={p.content} /> : 
                        <span key={j}>{p.content}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )
        } else if (part.match(/^\d+\./m)) {
          // Numbered lists with math support
          return (
            <ol key={index} className="list-decimal list-inside space-y-1 pl-2">
              {part.split('\n').filter(line => line.trim()).map((line, i) => {
                const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
                const mathParts = renderTextWithMath(cleanLine);
                return (
                  <li key={i} className="text-sm">
                    {mathParts.map((p, j) => 
                      p.type === 'math' ? 
                        <MathRenderer key={j} math={p.content} /> : 
                        <span key={j}>{p.content}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          )
        } else if (part.trim()) {
          // Regular paragraph with math support
          const mathParts = renderTextWithMath(part);
          return (
            <p key={index} className="leading-relaxed text-gray-700">
              {mathParts.map((p, i) => 
                p.type === 'math' ? 
                  <MathRenderer key={i} math={p.content} /> : 
                  <span key={i}>{p.content}</span>
              )}
            </p>
          );
        }
        return null
      })}
    </div>
  )
}

// Component to display follow-up question suggestions
const FollowUpSuggestions = ({ questions, onSelect }) => {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <p className="text-xs font-semibold text-gray-600 mb-2">Suggested follow-ups:</p>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="w-full text-left text-xs bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded px-3 py-2 transition-colors"
          >
            • {question}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ChatMessages({ messages, isLoading, onFollowUpClick }) {
  const { username } = useUser();
  const messagesEndRef = React.useRef(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-2xl font-semibold text-gray-800"><Greeting />, {username}!</p>
              <p className="text-lg font-semibold text-gray-700 mt-4">Start a conversation</p>
              <p className="text-sm text-gray-500 mt-2">Ask me anything:</p>
              <ul className="text-sm text-gray-400 mt-3 space-y-1">
                <li>• Mathematical problems with step-by-step solutions</li>
                <li>• Code help and debugging</li>
                <li>• Concept explanations</li>
                <li>• General questions and assistance</li>
                <li>• Data analysis and problem-solving</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-3 rounded-lg max-w-2xl ${
                    msg.sender === 'user'
                      ? 'bg-zinc-100 ml-auto rounded-[40px] text-black  '
                      : msg.isError
                      ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
                      : 'bg-white text-black rounded-bl-none'
                  }`}
                >
                  <MessageContent text={msg.text} isError={msg.isError} />
                  
                  {/* Query type indicator */}
                  {msg.queryType && !msg.isError && (
                    <p className="text-xs mt-2 opacity-60">
                      {msg.queryType === 'math' && '📐 Math Problem'}
                      {msg.queryType === 'code' && '💻 Code Solution'}
                      {msg.queryType === 'debug' && '🐛 Debug Help'}
                      {msg.queryType === 'explain' && '📚 Explanation'}
                      {msg.queryType === 'question' && '❓ Answer'}
                    </p>
                  )}

                  {/* Follow-up suggestions for AI messages */}
                  {msg.sender === 'ai' && msg.followUpQuestions && !msg.isError && onFollowUpClick && (
                    <FollowUpSuggestions 
                      questions={msg.followUpQuestions} 
                      onSelect={onFollowUpClick}
                    />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-lg bg-gray-100 text-gray-900 rounded-bl-none">
                  <div className="flex space-x-2 items-center">
                    <span className="text-sm text-gray-600">Thinking</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  )
}

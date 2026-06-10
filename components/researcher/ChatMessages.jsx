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

// Helper to render inline formatting (bold, italic, etc.) with math support
const renderInlineMarkdown = (text) => {
  const parts = [];
  let lastIndex = 0;
  
  // Pattern for bold (**text**)
  const boldRegex = /\*\*([^\*]+)\*\*/g;
  let match;
  
  const textParts = [];
  const boldMatches = [];
  while ((match = boldRegex.exec(text)) !== null) {
    boldMatches.push({ start: match.index, end: match.index + match[0].length, content: match[1] });
  }
  
  lastIndex = 0;
  boldMatches.forEach(bold => {
    if (bold.start > lastIndex) {
      textParts.push({ type: 'text', content: text.slice(lastIndex, bold.start) });
    }
    textParts.push({ type: 'bold', content: bold.content });
    lastIndex = bold.end;
  });
  
  if (lastIndex < text.length) {
    textParts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  
  if (textParts.length === 0) {
    textParts.push({ type: 'text', content: text });
  }
  
  return textParts.map((p, i) => {
    if (p.type === 'bold') {
      return <strong key={i} className="font-semibold">{p.content}</strong>;
    } else {
      const mathParts = renderTextWithMath(p.content);
      return (
        <React.Fragment key={i}>
          {mathParts.map((mp, j) => 
            mp.type === 'math' ? 
              <MathRenderer key={j} math={mp.content} /> : 
              <span key={j}>{mp.content}</span>
          )}
        </React.Fragment>
      );
    }
  });
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

  // Split content by code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-sm space-y-3">
      {parts.map((part, index) => {
        // Handle code blocks
        if (part.startsWith('```')) {
          const codeMatch = part.match(/```(\w+)?\n?([\s\S]*?)\n?```/);
          const language = codeMatch?.[1] || 'text';
          const codeContent = codeMatch?.[2] || part.replace(/```\n?/g, '').trim();
          return (
            <div key={index}>
              <p className="text-xs font-semibold text-gray-600 mb-2">{language}</p>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-xs">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        // Split by lines to process headers, tables, lists, etc.
        const lines = part.split('\n');
        const elements = [];
        let i = 0;

        while (i < lines.length) {
          const line = lines[i];
          
          // Skip empty lines
          if (!line.trim()) {
            i++;
            continue;
          }

          // Headers
          if (line.match(/^#{1,6}\s/)) {
            const level = line.match(/^#+/)[0].length;
            const headerContent = line.replace(/^#+\s/, '').trim();
            const headingSizes = {
              1: 'text-2xl font-bold',
              2: 'text-xl font-bold',
              3: 'text-lg font-bold',
              4: 'text-base font-bold',
              5: 'text-sm font-bold',
              6: 'text-xs font-bold'
            };
            elements.push(
              <h1 key={`${index}-${i}`} className={`${headingSizes[level]} mt-4 mb-2 text-gray-800`}>
                {renderInlineMarkdown(headerContent)}
              </h1>
            );
            i++;
          }
          // Tables
          else if (line.includes('|')) {
            const tableStart = i;
            const tableLines = [];
            while (i < lines.length && lines[i].includes('|')) {
              tableLines.push(lines[i]);
              i++;
            }
            
            // Check if it's a valid table (has header separator)
            const hasSeparator = tableLines.some(l => l.includes('---'));
            if (tableLines.length >= 2 && hasSeparator) {
              const headers = tableLines[0]
                .split('|')
                .map(h => h.trim())
                .filter(h => h);
              
              const rows = [];
              let inBody = false;
              for (const tline of tableLines) {
                if (tline.includes('---')) {
                  inBody = true;
                  continue;
                }
                if (inBody) {
                  const cells = tline
                    .split('|')
                    .map(c => c.trim())
                    .filter(c => c);
                  rows.push(cells);
                }
              }

              elements.push(
                <div key={`${index}-${tableStart}`} className="overflow-x-auto my-3">
                  <table className="w-full border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        {headers.map((h, hi) => (
                          <th key={hi} className="border border-gray-300 px-3 py-2 font-semibold text-left">
                            {renderInlineMarkdown(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, ri) => (
                        <tr key={ri} className="hover:bg-gray-50">
                          {row.map((cell, ci) => (
                            <td key={ci} className="border border-gray-300 px-3 py-2">
                              {renderInlineMarkdown(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            } else {
              elements.push(
                <p key={`${index}-${tableStart}`} className="leading-relaxed text-gray-700">
                  {renderInlineMarkdown(line)}
                </p>
              );
            }
          }
          // Horizontal rules
          else if (line.match(/^-{3,}$/)) {
            elements.push(<hr key={`${index}-${i}`} className="my-4 border-gray-300" />);
            i++;
          }
          // Bullet lists
          else if (line.match(/^[\*\-]\s/)) {
            const listStart = i;
            const listItems = [];
            while (i < lines.length && lines[i].match(/^[\*\-]\s/)) {
              const item = lines[i].replace(/^[\*\-]\s/, '').trim();
              listItems.push(item);
              i++;
            }
            elements.push(
              <ul key={`${index}-${listStart}`} className="list-disc list-inside space-y-1 pl-2">
                {listItems.map((item, li) => (
                  <li key={li} className="text-sm">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ul>
            );
          }
          // Numbered lists
          else if (line.match(/^\d+\.\s/)) {
            const listStart = i;
            const listItems = [];
            while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
              const item = lines[i].replace(/^\d+\.\s/, '').trim();
              listItems.push(item);
              i++;
            }
            elements.push(
              <ol key={`${index}-${listStart}`} className="list-decimal list-inside space-y-1 pl-2">
                {listItems.map((item, li) => (
                  <li key={li} className="text-sm">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ol>
            );
          }
          // Regular paragraphs
          else {
            elements.push(
              <p key={`${index}-${i}`} className="leading-relaxed text-gray-700">
                {renderInlineMarkdown(line)}
              </p>
            );
            i++;
          }
        }

        return <React.Fragment key={index}>{elements}</React.Fragment>;
      })}
    </div>
  );
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
                  className={`px-4 py-3 rounded-lg w-fit max-w-[85%] sm:max-w-2xl break-words overflow-wrap-anywhere ${
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

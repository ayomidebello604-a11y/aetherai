import React from 'react'

export default function ChatMessages({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-sm text-gray-500">No messages yet</p>
              <p className="text-[11px] text-gray-400 mt-2">Start a conversation by typing below</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-3 rounded-lg max-w-xs lg:max-w-md ${
                  msg.sender === 'user'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react';
import React from 'react'
import WorkspaceLayout from '@/components/layout/WorkspaceLayout'
import WorkspaceHeader from '@/components/layout/WorkspaceHeader'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import { useUser } from '@/utils/hooks/useUser'

export default function ResearcherPage() {
  const [messages, setMessages] = useState([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { username } = useUser()

  async function handleSendMessage() {
    if (!query.trim()) return;

    const currentQuery = query; // Capture the query before clearing

    // Add user message to chat
    const userMessage = { 
      id: Date.now(), 
      text: currentQuery, 
      sender: 'user' 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: currentQuery,
          conversationHistory: messages.map(msg => ({
            sender: msg.sender,
            text: msg.text
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.reply) {
        // Add AI response to chat with all metadata
        const aiMessage = {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'ai',
          queryType: data.queryType,
          timestamp: data.timestamp,
          metadata: data.metadata,
          quality: data.quality,
          followUpQuestions: data.followUpQuestions || [],
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Add error message
        const errorMessage = {
          id: Date.now() + 1,
          text: data.error || 'Failed to get a response. Please try again.',
          sender: 'ai',
          isError: true,
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}. Check console for details.`,
        sender: 'ai',
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle follow-up question selection
  const handleFollowUpClick = (question) => {
    setQuery(question);
  }

  return (
    <WorkspaceLayout activeItem="researcher">
      <WorkspaceHeader mode="Researcher" sessionId="SES-0041" username={username} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading} 
          onFollowUpClick={handleFollowUpClick}
        />
        <ChatInput
          query={query}
          onQueryChange={setQuery}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </WorkspaceLayout>
  )
}

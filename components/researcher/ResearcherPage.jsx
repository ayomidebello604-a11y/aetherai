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
        const statusMessages = {
          400: 'Your message format is incorrect. Please try again.',
          401: 'Your session expired. Please refresh the page.',
          403: 'You don\'t have permission to use this feature.',
          404: 'The research service is currently unavailable.',
          429: 'You\'re sending requests too quickly. Please slow down.',
          500: 'The research service encountered an error. Please try again.',
          503: 'The research service is temporarily down. Please try again later.',
        };
        throw new Error(statusMessages[response.status] || `Connection error: ${response.status}. Please try again.`);
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
          text: data.error || 'I wasn\'t able to find an answer to your question. Please try rewording it or ask something different.',
          sender: 'ai',
          isError: true,
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      
      let userFriendlyError = 'Something went wrong while processing your question. Please try again.';
      if (error.message?.includes('Connection error')) {
        userFriendlyError = 'I had trouble connecting to the research service. Please check your internet and try again.';
      } else if (error.message?.includes('timeout') || error.message?.includes('took too long')) {
        userFriendlyError = 'Your request took too long to process. Try asking a simpler or shorter question.';
      } else if (error.message?.includes('format')) {
        userFriendlyError = 'There was a problem with how I processed your message. Please try again.';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: userFriendlyError,
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

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { apiClient, Feedback, Discussion } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useSocket } from '@/lib/useSocket'

// Icons
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChatBubbleLeftRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExclamationTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InformationCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DiscussionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const feedbackId = searchParams.get('feedbackId')
  
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [selectedRole, setSelectedRole] = useState<'designer' | 'developer' | 'product_manager' | 'reviewer'>('designer')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const roleOptions = [
    { value: 'designer', label: 'Designer', color: 'rgb(168, 85, 247)' },
    { value: 'developer', label: 'Developer', color: 'rgb(34, 197, 94)' },
    { value: 'product_manager', label: 'Product Manager', color: 'rgb(59, 130, 246)' },
    { value: 'reviewer', label: 'Reviewer', color: 'rgb(251, 146, 60)' }
  ]
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Socket.IO hook
  const {
    isConnected: socketConnected,
    messages: socketMessages,
    typingUsers,
    error: socketError,
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping,
    clearError
  } = useSocket({ 
    feedbackId: feedbackId || '', 
    role: selectedRole 
  })

  useEffect(() => {
    if (feedbackId) {
      loadFeedback()
    }
  }, [feedbackId])

  // Merge Socket.IO messages with database discussions
  const allMessages = React.useMemo(() => {
    if (!feedback) return []
    
    // Combine existing discussions with new Socket.IO messages
    const existingDiscussions = feedback.discussions || []
    const newSocketMessages = socketMessages || []
    
    console.log('Merging messages:', {
      existing: existingDiscussions.length,
      socket: newSocketMessages.length,
      existingDiscussions,
      newSocketMessages
    })
    
    // Create a map to avoid duplicates
    const messageMap = new Map()
    
    // Add existing discussions first
    existingDiscussions.forEach(discussion => {
      const key = `${discussion.role}-${discussion.message}-${discussion.createdAt}`
      messageMap.set(key, discussion)
    })
    
    // Add new Socket.IO messages
    newSocketMessages.forEach(message => {
      const key = `${message.role}-${message.message}-${message.createdAt}`
      messageMap.set(key, message)
    })
    
    // Convert back to array and sort by creation time
    const result = Array.from(messageMap.values()).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    
    console.log('Final merged messages:', result)
    return result
  }, [feedback?.discussions, socketMessages])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadFeedback = async () => {
    if (!feedbackId) return
    
    try {
      setIsLoading(true)
      console.log('Loading feedback with ID:', feedbackId)
      
      // First, let's check if there are any feedback items in the database
      try {
        const allFeedback = await apiClient.getAllFeedback()
        console.log('All feedback items in database:', allFeedback.length)
        console.log('Available feedback IDs:', allFeedback.map(f => f._id))
      } catch (debugError) {
        console.error('Could not fetch all feedback for debugging:', debugError)
      }
      
      const feedbackData = await apiClient.getFeedbackById(feedbackId)
      console.log('Feedback loaded successfully:', feedbackData)
      setFeedback(feedbackData)
    } catch (error) {
      console.error('Failed to load feedback:', error)
      console.error('Feedback ID was:', feedbackId)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !feedback) return

    try {
      setIsLoading(true)
      
      console.log('Sending message:', {
        feedbackId,
        role: selectedRole,
        message: newMessage.trim(),
        socketConnected
      })
      
      // Send message via Socket.IO for real-time delivery
      sendSocketMessage(newMessage.trim())
      
      // Clear the input immediately for better UX
      setNewMessage('')
      stopTyping()
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    
    if (e.target.value.trim()) {
      startTyping()
    } else {
      stopTyping()
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircleIcon className="h-4 w-4" />
      case 'medium': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'low': return <InformationCircleIcon className="h-4 w-4" />
      default: return <CheckCircleIcon className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'low': return 'text-green-400 bg-green-400/20'
      default: return 'text-zinc-400 bg-zinc-400/20'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'designer': return '#64FD00'
      case 'developer': return '#3b82f6'
      case 'product_manager': return '#8b5cf6'
      case 'reviewer': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getRoleInitial = (role: string) => {
    switch (role) {
      case 'product_manager': return 'PM'
      default: return role.charAt(0).toUpperCase()
    }
  }

  if (isLoading && !feedback) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading discussion...</p>
        </div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <ChatBubbleLeftRightIcon className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-300 mb-2">Discussion Not Found</h2>
          <p className="text-zinc-400 mb-4">The discussion you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-black font-medium rounded-lg transition-colors hover:opacity-90"
            style={{backgroundColor: '#64FD00'}}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
      <div className="min-h-screen text-zinc-100 asimovian-regular" style={{
        background: 'radial-gradient(ellipse at center, rgba(25, 25, 25, 1) 0%, rgba(5, 5, 5, 1) 100%)',
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.01) 0%, transparent 50%)'
      }}>
      <div className="flex h-screen">
        {/* Left Panel - Feedback Details */}
         <div className="w-80 backdrop-blur-md border-r border-zinc-700/50 flex flex-col" style={{
           background: 'rgba(0, 0, 0, 0.3)',
           backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.02) 0%, rgba(0, 0, 0, 0.4) 100%)',
           boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 50px rgba(100, 253, 0, 0.03)'
         }}>
           <div className="flex-1 overflow-y-auto p-4">
             <div className="mt-8 mb-6">
               <div className="px-4 py-2 rounded-full border border-zinc-600/50 text-zinc-300 text-lg font-semibold transition-all duration-300 inline-flex items-center gap-3" style={{
                 background: 'linear-gradient(135deg, rgba(100, 253, 0, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
                 boxShadow: '0 0 10px rgba(100, 253, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
               }}>
                 <svg style={{color: '#64FD00'}} className="h-5 w-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
                 <span>Feedback Details</span>
               </div>
             </div>
            <div className="backdrop-blur-sm border border-zinc-600/30 rounded-xl p-4 mb-4" style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.05) 0%, rgba(0, 0, 0, 0.6) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 40px rgba(100, 253, 0, 0.03)'
            }}>
              {/* Severity Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    feedback.severity === 'high' ? "bg-red-500" : 
                    feedback.severity === 'medium' ? "bg-yellow-500" : "bg-green-500"
                  )}>
                    {getSeverityIcon(feedback.severity)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-100 capitalize">{feedback.severity}</div>
                    <div className="text-sm text-zinc-400">{feedback.category}</div>
                  </div>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  getSeverityColor(feedback.severity)
                )}>
                  {feedback.severity.toUpperCase()}
                </div>
              </div>

              {/* Issue Description */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-zinc-100">Issue:</div>
                  {feedback.resolved && (
                    <div className="flex items-center gap-1 text-xs" style={{color: '#64FD00'}}>
                      <CheckIcon className="h-3 w-3" />
                      Resolved
                    </div>
                  )}
                </div>
                <div className="text-sm text-zinc-300 bg-zinc-600/50 p-3 rounded">
                  {feedback.issue}
                </div>
              </div>

              {/* Recommendation */}
              <div className="mb-3">
                <div className="text-sm font-medium text-zinc-100 mb-1">Recommendation:</div>
                <div className="text-sm text-zinc-300 bg-zinc-600/50 p-3 rounded">
                  {feedback.recommendation}
                </div>
              </div>

              {/* Location */}
              <div className="mb-3">
                <div className="text-sm font-medium text-zinc-100 mb-1">Location:</div>
                <div className="text-sm text-zinc-400 bg-zinc-600/30 p-2 rounded">
                  ({feedback.coordinates.x}, {feedback.coordinates.y})
                </div>
              </div>

              {/* Role Tags */}
              <div>
                <div className="text-sm font-medium text-zinc-100 mb-2">Involved Roles:</div>
                <div className="flex flex-wrap gap-2">
                  {feedback.roleTags.map((role) => (
                    <div
                      key={role}
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{backgroundColor: getRoleColor(role)}}
                    >
                      {getRoleInitial(role)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-zinc-700/50 backdrop-blur-md" style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.03) 0%, rgba(0, 0, 0, 0.5) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(100, 253, 0, 0.02)'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </button>
                  <h2 className="text-lg font-medium text-zinc-100">Discussion Thread</h2>
                  <div className={cn(
                    "px-2 py-1 rounded-full border text-xs font-medium transition-all duration-300",
                    socketConnected ? "border-zinc-600/50 text-zinc-300" : "border-red-500/50 text-red-400"
                  )} style={socketConnected ? {
                    background: 'linear-gradient(135deg, rgba(100, 253, 0, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
                    boxShadow: '0 0 8px rgba(100, 253, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  } : {
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center gap-1">
                      <div className={cn(
                        "h-1 w-1 rounded-full",
                        socketConnected ? "" : "bg-red-500"
                      )} style={socketConnected ? {backgroundColor: '#64FD00'} : {}} />
                      <span className="text-xs">
                        {socketConnected ? 'Live' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-400">
                  {allMessages.length} message{allMessages.length !== 1 ? 's' : ''}
                  {socketConnected ? ' • Live' : ' • Offline'}
                </p>
                {typingUsers.length > 0 && (
                  <p className="text-sm" style={{color: '#64FD00'}}>
                    {typingUsers.map(user => user.role).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {allMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-zinc-400 mb-4" />
                <h3 className="text-lg font-medium text-zinc-300 mb-2">No Messages Yet</h3>
                <p className="text-zinc-400 max-w-md">
                  Start the discussion by adding your first message below.
                </p>
              </div>
            ) : (
              allMessages.map((discussion, index) => (
                <div
                  key={index}
                  className="flex gap-3 max-w-3xl"
                >
                  {/* Avatar */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                    style={{backgroundColor: getRoleColor(discussion.role)}}
                  >
                    {getRoleInitial(discussion.role)}
                  </div>

                  {/* Message */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-zinc-100 capitalize">
                        {discussion.role === 'product_manager' ? 'Product Manager' : discussion.role}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(discussion.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="backdrop-blur-sm border border-zinc-600/30 rounded-lg p-3" style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.04) 0%, rgba(0, 0, 0, 0.6) 100%)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(100, 253, 0, 0.02)'
                    }}>
                      <p className="text-zinc-100 text-sm leading-relaxed">
                        {discussion.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-zinc-700/50 backdrop-blur-md" style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.03) 0%, rgba(0, 0, 0, 0.5) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(100, 253, 0, 0.02)'
          }}>
            <div className="flex gap-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-4 py-2 border border-zinc-600/50 rounded-full text-zinc-100 text-sm transition-all duration-300 flex items-center gap-2 min-w-[140px] justify-between"
                  style={{
                    background: 'linear-gradient(135deg, rgba(100, 100, 100, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
                    boxShadow: '0 0 10px rgba(100, 100, 100, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: roleOptions.find(r => r.value === selectedRole)?.color }}
                    />
                    <span>{roleOptions.find(r => r.value === selectedRole)?.label}</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute bottom-full mb-2 w-full rounded-xl border border-zinc-700/50 backdrop-blur-md z-50" style={{
                    background: 'rgba(0, 0, 0, 0.9)',
                    backgroundImage: 'linear-gradient(135deg, rgba(100, 100, 100, 0.05) 0%, rgba(0, 0, 0, 0.9) 100%)',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
                    {roleOptions.map((role) => (
                      <button
                        key={role.value}
                        onClick={() => {
                          setSelectedRole(role.value as any)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl ${
                          selectedRole === role.value ? 'text-zinc-100' : 'text-zinc-300 hover:text-zinc-100'
                        }`}
                        style={{
                          background: selectedRole === role.value 
                            ? 'linear-gradient(135deg, rgba(100, 253, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%)'
                            : 'transparent'
                        }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: role.color }}
                        />
                        <span>{role.label}</span>
                        {selectedRole === role.value && (
                          <svg className="w-4 h-4 ml-auto" style={{ color: '#64FD00' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 pr-12 bg-zinc-700 border border-zinc-600 rounded-lg text-zinc-100 placeholder-zinc-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                  disabled={!socketConnected}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isLoading || !socketConnected}
                className="px-4 py-2 disabled:bg-zinc-600 text-black font-medium rounded-lg transition-all duration-300 flex items-center gap-2 hover:opacity-90 hover:scale-[1.02]"
                style={{
                  backgroundColor: '#64FD00',
                  boxShadow: (!newMessage.trim() || isLoading || !socketConnected) ? 'none' : '0 0 15px rgba(100, 253, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                <SendIcon className="h-4 w-4" />
                
              </button>
            </div>
            
            {/* Socket Error Display */}
            {socketError && (
              <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-red-400">{socketError}</p>
                  <button
                    onClick={clearError}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
         </div>
       </div>
      </div>
   )
 }

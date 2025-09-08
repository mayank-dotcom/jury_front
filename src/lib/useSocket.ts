import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketOptions {
  feedbackId: string
  role: string
}

interface Message {
  role: string
  message: string
  createdAt: string
}

interface SocketMessage {
  id: string
  discussion: Message
  feedbackId: string
}

interface TypingUser {
  userId: string
  role: string
  isTyping: boolean
}

export const useSocket = ({ feedbackId, role }: UseSocketOptions) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    })

    // Connection event handlers
    newSocket.on('connect', () => {
      setIsConnected(true)
      setError(null)

      // Join the feedback room
      newSocket.emit('join-feedback', feedbackId)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('connect_error', () => {
      setError('Connection failed. Please check your internet connection.')
    })

    // Message event handlers
    newSocket.on('new-message', (data: SocketMessage) => {
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(msg =>
          msg.role === data.discussion.role &&
          msg.message === data.discussion.message &&
          msg.createdAt === data.discussion.createdAt
        )

        if (exists) {
          return prev
        }

        return [...prev, data.discussion]
      })
    })

    newSocket.on('user-typing', (data: TypingUser) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.userId !== data.userId)
        if (data.isTyping) {
          return [...filtered, data]
        }
        return filtered
      })
    })

    newSocket.on('user-joined', () => {
      // User joined event handled
    })

    newSocket.on('error', (data) => {
      setError(data.message || 'An error occurred')
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [feedbackId])

  const sendMessage = (message: string) => {
    if (socket && isConnected && message.trim()) {
      socket.emit('send-message', {
        feedbackId,
        role,
        message: message.trim()
      })
    }
  }

  const startTyping = () => {
    if (socket && isConnected) {
      socket.emit('typing-start', { feedbackId, role })
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping()
      }, 3000)
    }
  }

  const stopTyping = () => {
    if (socket && isConnected) {
      socket.emit('typing-stop', { feedbackId, role })
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    socket,
    isConnected,
    messages,
    typingUsers,
    error,
    sendMessage,
    startTyping,
    stopTyping,
    clearError
  }
}


"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { apiClient, type Session, type Document, type SourceSnippet } from "@/lib/api"

// Simple inline icons (no external dependency)
function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  )
}
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  )
}
function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="4" y="8" width="16" height="10" rx="3" strokeWidth="2" />
      <path d="M12 3v3" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      <circle cx="15" cy="13" r="1.5" fill="currentColor" />
    </svg>
  )
}
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" strokeWidth="2" />
    </svg>
  )
}
function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M21 12a8 8 0 10-3.3 6.5L21 21l-1.5-3.3A8 8 0 0021 12z" strokeWidth="2" />
    </svg>
  )
}
function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17,8 12,3 7,8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14,2 14,8 20,8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2" strokeLinecap="round" />
      <polyline points="10,9 9,9 8,9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <polyline points="3,6 5,6 21,6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="11" x2="10" y2="17" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="11" x2="14" y2="17" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  isCode?: boolean
  timestamp?: Date
  citations?: number[]
  sourceSnippets?: SourceSnippet[]
  searchResults?: Array<{
    text: string;
    originalScore: number;
    rerankPosition?: number;
    isReranked: boolean;
  }>
}

export default function Page() {
  // State management
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('default')
  const [sessions, setSessions] = useState<Session[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadUrl, setUploadUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load initial data
  useEffect(() => {
    checkConnection()
    loadChatHistory(currentSessionId)
    loadSessions()
    loadDocuments()
  }, [currentSessionId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check backend connection
  const checkConnection = async () => {
    try {
      await apiClient.healthCheck()
      setIsConnected(true)
    } catch (error) {
      console.error('Backend connection failed:', error)
      setIsConnected(false)
    }
  }

  // Load chat history for current session
  const loadChatHistory = async (sessionId: string) => {
    try {
      const response = await apiClient.getChatHistory(sessionId)
      const formattedMessages: Message[] = response.history.map((msg, index) => ({
        id: `${sessionId}-${index}`,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.error('Failed to load chat history:', error)
      setMessages([])
    }
  }

  // Load all sessions
  const loadSessions = async () => {
    try {
      const response = await apiClient.getSessions()
      setSessions(response.sessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  // Load all documents
  const loadDocuments = async () => {
    try {
      const response = await apiClient.getDocuments()
      setUploadedDocuments(response.documents)
    } catch (error) {
      console.error('Failed to load documents:', error)
    }
  }

  // Delete document
  const deleteDocument = async (documentId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await apiClient.deleteDocument(documentId)
      
      // Create detailed success message
      let detailsMessage = `🗑️ ${response.message}\n\nFile: ${response.filename}\nEmbeddings deleted: ${response.embeddingsDeleted}`
      
      if (response.filterUsed) {
        detailsMessage += `\nFilter used: ${response.filterUsed}`
      }
      
      if (response.embeddingsDeleted === 0) {
        detailsMessage += `\n\n⚠️ Note: No embeddings were found to delete. This might indicate they were already cleaned up or stored with a different identifier.`
      }
      
      // Add success message to chat
      const successMessage: Message = {
        id: `delete-success-${Date.now()}`,
        role: 'assistant',
        content: detailsMessage,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, successMessage])
      
      // Reload documents from database
      loadDocuments()
      
    } catch (error) {
      console.error('Delete failed:', error)
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `delete-error-${Date.now()}`,
        role: 'assistant',
        content: `❌ Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await apiClient.sendMessage(inputMessage.trim(), currentSessionId)
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        citations: response.citations,
        sourceSnippets: response.sourceSnippets,
        searchResults: response.searchResults
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Update session ID if it changed
      if (response.sessionId !== currentSessionId) {
        setCurrentSessionId(response.sessionId)
      }
      
      // Refresh sessions list
      loadSessions()
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  // Start new chat
  const startNewChat = () => {
    const newSessionId = `session-${Date.now()}`
    setCurrentSessionId(newSessionId)
    setMessages([])
  }

  // Switch to different session
  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId)
  }

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Handle document upload
  const handleUpload = async () => {
    if (!selectedFile && !uploadUrl.trim()) {
      alert('Please select a file or enter a URL')
      return
    }

    setIsUploading(true)

    try {
      // If URL is provided but no file, create a dummy file for the API
      const fileToUpload = selectedFile || new File([''], 'url-upload.txt', { type: 'text/plain' })
      
      const response = await apiClient.uploadDocument(fileToUpload, uploadUrl)
      
      // Add success message to chat
      const successMessage: Message = {
        id: `upload-success-${Date.now()}`,
        role: 'assistant',
        content: `✅ ${response.message}\n\nFile: ${response.filename}\nType: ${response.type}\nDocuments processed: ${response.documentsProcessed}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, successMessage])
      
      // Reload documents from database
      loadDocuments()
      
      // Reset upload state
      setShowUploadModal(false)
      setSelectedFile(null)
      setUploadUrl('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error) {
      console.error('Upload failed:', error)
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `upload-error-${Date.now()}`,
        role: 'assistant',
        content: `❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200">
      {/* Subtle green vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(1100px 520px at 80% 10%, rgba(34,197,94,0.20) 0%, rgba(0,0,0,0) 60%), radial-gradient(900px 400px at 10% 85%, rgba(34,197,94,0.12) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 md:px-6 py-4">
        <div className="flex gap-4">
          {/* Sidebar */}
          <aside className="hidden md:flex w-[300px] flex-col rounded-xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-emerald-500" aria-hidden />
                <span className="font-semibold">My Chats</span>
              </div>
              <button
                className="h-8 w-8 rounded-md hover:bg-zinc-900 grid place-items-center text-zinc-400"
                aria-label="Menu"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <label htmlFor="sidebar-search" className="sr-only">
                Search chats
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 py-2">
                <SearchIcon className="h-4 w-4 text-zinc-500" />
                <input
                  id="sidebar-search"
                  placeholder="Search"
                  className="bg-transparent outline-none text-sm placeholder:text-zinc-500 flex-1"
                />
              </div>
            </div>

            {/* Documents */}
            <div className="px-2">
              <SidebarSection title="Documents">
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="w-full flex items-center gap-2 rounded-lg bg-emerald-500 text-black font-medium px-3 py-2 hover:bg-emerald-400 transition-colors text-sm"
                    disabled={isUploading}
                  >
                    <UploadIcon className="h-4 w-4" />
                    <span>Upload Document</span>
                  </button>
                  
                  {uploadedDocuments.length > 0 ? (
                    uploadedDocuments.map((doc) => (
                      <DocumentItem 
                        key={doc.documentId} 
                        document={doc} 
                        onDelete={deleteDocument}
                      />
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-zinc-500">No documents uploaded yet</div>
                  )}
                </div>
              </SidebarSection>
            </div>

            {/* Chats */}
            <div className="px-2 mt-2">
              <SidebarSection title="Chats">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <ChatListItem
                      key={session.sessionId}
                      title={session.sessionId}
                      preview={`${session.messageCount} messages`}
                      activeOutline={session.sessionId === currentSessionId}
                      onClick={() => switchToSession(session.sessionId)}
                    />
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-zinc-500">No chat sessions yet</div>
                )}
              </SidebarSection>
            </div>

            {/* New chat */}
            <div className="mt-auto p-3">
              <button 
                onClick={startNewChat}
                className="w-full flex items-center justify-between rounded-xl bg-emerald-500 text-black font-medium px-4 py-3 hover:bg-emerald-400 transition-colors"
              >
                <span>New chat</span>
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </aside>

          {/* Main area */}
          <main className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
            {/* Top bar */}
            <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-400">
                <button className="rounded-md p-1 hover:bg-zinc-900" aria-label="Back">
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-sm">{currentSessionId}</span>
              </div>
              <div className="flex items-center gap-3">
                <ConnectionStatus isConnected={isConnected} />
                <ModelChip />
              </div>
            </header>

            {/* Conversation */}
            <section className="px-4 md:px-8 py-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                  <BotIcon className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">Welcome to the Document Assistant</p>
                  <p className="text-sm">Ask me anything about the document!</p>
                </div>
              ) : (
                messages.map((m) => (
                  <MessageBubble key={m.id} role={m.role} isCode={m.isCode} content={m.content} citations={m.citations} sourceSnippets={m.sourceSnippets} searchResults={m.searchResults} />
                ))
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-black grid place-items-center">
                    <BotIcon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Oliver</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </section>

            {/* Input */}
            <div className="px-4 md:px-12 pb-6">
              <div className="mx-auto max-w-3xl">
                <form onSubmit={handleSubmit}>
                  <div className="rounded-2xl border border-zinc-800 bg-black/80 shadow-[0_0_0_1px_rgba(34,197,94,0.25)]">
                    <div className="flex items-center gap-2 px-3 md:px-4 py-2">
                      <MessageIcon className="h-5 w-5 text-zinc-500" />
                      <input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="flex-1 bg-transparent outline-none placeholder:text-zinc-500 text-sm md:text-base py-2"
                        placeholder="Ask Oliver about the document..."
                        disabled={isLoading || !isConnected}
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim() || !isConnected}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-black hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-400 transition-colors"
                        aria-label="Send"
                      >
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
                <p className="mt-2 text-center text-xs text-zinc-500">
                  Oliver can make mistakes. Consider checking important information.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <h2 className="text-lg font-semibold text-white">Upload Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400"
                disabled={isUploading}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Choose File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
                  disabled={isUploading}
                />
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                    <DocumentIcon className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-zinc-700"></div>
                <span className="text-xs text-zinc-500 uppercase">OR</span>
                <div className="flex-1 h-px bg-zinc-700"></div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Web URL
                </label>
                <input
                  type="url"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://example.com/document"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                  disabled={isUploading}
                />
              </div>

              {/* Upload Info */}
              <div className="text-xs text-zinc-500 bg-zinc-800/50 rounded-lg p-3">
                <p className="font-medium mb-1">Supported formats:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Text files (.txt)</li>
                  <li>PDF documents (.pdf)</li>
                  <li>Word documents (.doc, .docx)</li>
                  <li>Web pages (via URL)</li>
                </ul>
                <p className="mt-2">Maximum file size: 10MB</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-700">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || (!selectedFile && !uploadUrl.trim())}
                className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-2">
      <div className="px-2 py-2 text-xs uppercase tracking-wide text-zinc-500">{title}</div>
      <div className="space-y-1">{children}</div>
    </section>
  )
}



function ChatListItem({
  title,
  preview,
  activeOutline,
  onClick,
}: {
  title: string
  preview: string
  activeOutline?: boolean
  onClick?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left rounded-lg px-3 py-2 hover:bg-zinc-900 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn("mt-1 h-6 w-1 rounded-full", activeOutline ? "bg-emerald-500" : "bg-transparent")}
          aria-hidden
        />
        <div className="min-w-0">
          <div className="text-sm font-medium text-zinc-200 truncate">{title}</div>
          <div className="text-xs text-zinc-500 truncate">{preview}</div>
        </div>
      </div>
    </button>
  )
}

function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
      isConnected 
        ? "border-emerald-500/30 bg-black text-emerald-400" 
        : "border-red-500/30 bg-black text-red-400"
    )}>
      <span 
        className={cn(
          "h-2 w-2 rounded-full",
          isConnected ? "bg-emerald-500" : "bg-red-500"
        )} 
        aria-hidden 
      />
      {isConnected ? "Connected" : "Disconnected"}
    </span>
  )
}

function ModelChip() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black px-3 py-1 text-xs text-emerald-400">
      <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
      Oliver AI
    </span>
  )
}

function MessageBubble({
  role,
  content,
  isCode,
  citations,
  sourceSnippets,
  searchResults,
}: {
  role: "user" | "assistant"
  content: string
  isCode?: boolean
  citations?: number[]
  sourceSnippets?: SourceSnippet[]
  searchResults?: Array<{
    text: string;
    originalScore: number;
    rerankPosition?: number;
    isReranked: boolean;
  }>
}) {
  const isUser = role === "user"
  const [showSearchDetails, setShowSearchDetails] = useState(false)
  const [showSourceSnippets, setShowSourceSnippets] = useState(false)
  
  // Function to render content with clickable citations
  const renderContentWithCitations = (text: string) => {
    if (!citations || citations.length === 0) {
      return <span>{text}</span>
    }

    const citationRegex = /\[(\d+)\]/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = citationRegex.exec(text)) !== null) {
      // Add text before citation
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }
      
      // Add clickable citation
      const citationNum = parseInt(match[1])
      parts.push(
        <button
          key={`citation-${match.index}-${citationNum}`}
          onClick={() => setShowSourceSnippets(!showSourceSnippets)}
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded px-1 py-0.5 text-xs font-medium transition-colors"
          title={`View source ${citationNum}`}
        >
          [{citationNum}]
        </button>
      )
      
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }
    
    return <span>{parts}</span>
  }
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <div
          className={cn(
            "h-6 w-6 rounded-full grid place-items-center",
            isUser ? "bg-zinc-800 text-zinc-300" : "bg-emerald-500 text-black",
          )}
          aria-hidden
        >
          {isUser ? <UserIcon className="h-4 w-4" /> : <BotIcon className="h-4 w-4" />}
        </div>
        <span className="font-medium">{isUser ? "You" : "Oliver"}</span>
        
        {/* Citations badge */}
        {citations && citations.length > 0 && (
          <button
            onClick={() => setShowSourceSnippets(!showSourceSnippets)}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded"
          >
            <DocumentIcon className="h-3 w-3" />
            {citations.length} {citations.length === 1 ? 'Citation' : 'Citations'}
            {showSourceSnippets ? <ChevronLeftIcon className="h-3 w-3 rotate-90" /> : <ChevronRightIcon className="h-3 w-3" />}
          </button>
        )}
        
        {/* Search details badge */}
        {searchResults && searchResults.length > 0 && (
          <button
            onClick={() => setShowSearchDetails(!showSearchDetails)}
            className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
          >
            <SearchIcon className="h-3 w-3" />
            {searchResults.filter(r => r.isReranked).length > 0 ? 'Reranked' : 'Vector'} Search
            {showSearchDetails ? <ChevronLeftIcon className="h-3 w-3 rotate-90" /> : <ChevronRightIcon className="h-3 w-3" />}
          </button>
        )}
      </div>

      {isCode ? (
        <pre className="whitespace-pre-wrap rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 text-sm md:text-base">
          {content}
        </pre>
      ) : (
        <div className="text-sm md:text-base text-zinc-300 leading-relaxed">
          {renderContentWithCitations(content)}
        </div>
      )}
      
      {/* Source Snippets */}
      {sourceSnippets && sourceSnippets.length > 0 && showSourceSnippets && (
        <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="text-xs font-medium text-emerald-400 mb-3 flex items-center gap-2">
            <DocumentIcon className="h-3 w-3" />
            Source Citations
          </div>
          <div className="space-y-3">
            {sourceSnippets.map((snippet) => (
              <div key={snippet.citationNumber} className="border border-zinc-700 rounded-lg p-3 bg-zinc-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400 font-medium text-sm">[{snippet.citationNumber}]</span>
                  {snippet.isReranked && (
                    <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                      Reranked #{snippet.rerankPosition}
                    </span>
                  )}
                  <span className="text-zinc-400 text-xs">
                    Score: {snippet.originalScore.toFixed(3)}
                  </span>
                </div>
                <div className="text-zinc-300 text-xs leading-relaxed bg-black/20 rounded p-2">
                  {snippet.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results Details */}
      {searchResults && searchResults.length > 0 && showSearchDetails && (
        <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-900/50 p-3">
          <div className="text-xs font-medium text-zinc-400 mb-2">
            All Search Results {searchResults.some(r => r.isReranked) && <span className="text-emerald-400">(Reranked)</span>}
          </div>
          <div className="space-y-2">
            {searchResults.map((result, index) => (
              <div key={index} className="text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-zinc-500">#{index + 1}</span>
                  {result.isReranked && (
                    <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                      Rank: {result.rerankPosition}
                    </span>
                  )}
                  <span className="text-zinc-400">
                    Score: {result.originalScore.toFixed(3)}
                  </span>
                </div>
                <div className="text-zinc-300 bg-black/30 rounded p-2 text-[11px] leading-relaxed">
                  {result.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DocumentItem({ 
  document, 
  onDelete 
}: { 
  document: Document; 
  onDelete: (documentId: string, filename: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 transition-colors group">
      <DocumentIcon className="h-4 w-4 text-zinc-500 flex-shrink-0" />
      <span className="truncate flex-1" title={document.filename}>{document.filename}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(document.documentId, document.filename)
        }}
        className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
        title="Delete document"
      >
        <TrashIcon className="h-3 w-3" />
      </button>
    </div>
  )
}

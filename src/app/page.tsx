'use client'

import { useState, useEffect, useRef } from 'react'
import { apiClient, Project, Screenshot, Feedback } from '@/lib/api'
import { cn } from '@/lib/utils'

// Simple inline icons
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  )
}
function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M20 6L9 17l-5-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function XMarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type ViewMode = 'home' | 'project' | 'screenshot'
type UserRole = 'designer' | 'developer' | 'product_manager' | 'reviewer' | 'all'

export default function Page() {
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [currentRole, setCurrentRole] = useState<UserRole>('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProjects()
    checkConnection()
  }, [])

  // Filter feedback based on current role
  useEffect(() => {
    if (currentRole === 'all') {
      setFilteredFeedback(feedback)
    } else {
      const filtered = feedback.filter(item => 
        item.roleTags.includes(currentRole as 'designer' | 'developer' | 'product_manager' | 'reviewer')
      )
      setFilteredFeedback(filtered)
    }
  }, [feedback, currentRole])

  const checkConnection = async () => {
    try {
      await apiClient.healthCheck()
      setIsConnected(true)
    } catch (error) {
      setIsConnected(false)
    }
  }

  const loadProjects = async () => {
    try {
      const projectsData = await apiClient.getProjects()
      setProjects(projectsData)
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const loadFeedback = async (projectId: string) => {
    try {
      const feedbackData = await apiClient.getFeedback(projectId)
      setFeedback(feedbackData)
    } catch (error) {
      console.error('Failed to load feedback:', error)
    }
  }

  const createProject = async () => {
    if (!newProjectName.trim()) return

    try {
      setIsLoading(true)
      const project = await apiClient.createProject(newProjectName.trim(), newProjectDescription.trim())
      setProjects(prev => [project, ...prev])
      setNewProjectName('')
      setNewProjectDescription('')
      setShowNewProjectForm(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectProject = async (project: Project) => {
    setSelectedProject(project)
    setViewMode('project')
    setSelectedScreenshot(null)
    setSelectedFeedback(null)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedProject) return

    try {
      setIsLoading(true)
      const result = await apiClient.uploadScreenshot(selectedProject._id, file)
      setSelectedProject(result.project)
      setProjects(prev => prev.map(p => p._id === selectedProject._id ? result.project : p))
    } catch (error) {
      console.error('Failed to upload screenshot:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectScreenshot = async (screenshot: Screenshot) => {
    if (!selectedProject) return
    
    setSelectedScreenshot(screenshot)
    setSelectedFeedback(null)
    setViewMode('screenshot')
    await loadFeedback(selectedProject._id)
  }

  const generateFeedback = async (screenshot: Screenshot) => {
    if (!selectedProject) return

    try {
      setIsLoading(true)
      const feedbackData = await apiClient.generateFeedback(selectedProject._id, screenshot.filename)
      setFeedback(prev => [...feedbackData, ...prev])
    } catch (error) {
      console.error('Failed to generate feedback:', error)
      // Show error message to user
      alert('Failed to generate feedback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  const exportToPDF = async () => {
    if (!selectedProject) return

    try {
      const blob = await apiClient.exportRoleFilteredPDF(selectedProject._id, currentRole)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedProject.name}-${currentRole}-feedback.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      console.log(`PDF exported successfully for ${currentRole}`)
    } catch (error) {
      console.error('Failed to export PDF:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  const exportToJSON = async () => {
    if (!selectedProject) return

    try {
      const blob = await apiClient.exportRoleFilteredJSON(selectedProject._id, currentRole)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedProject.name}-${currentRole}-feedback.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      console.log(`JSON exported successfully for ${currentRole}`)
    } catch (error) {
      console.error('Failed to export JSON:', error)
      alert('Failed to export JSON. Please try again.')
    }
  }

  const toggleFeedbackResolved = async (feedbackId: string, currentResolved: boolean) => {
    try {
      const newResolved = !currentResolved
      const resolvedBy = 'Current User' // In a real app, this would be the actual user
      
      const updatedFeedback = await apiClient.markFeedbackResolved(feedbackId, newResolved, resolvedBy)
      
      // Update the feedback in the local state
      setFeedback(prev => prev.map(f => f._id === feedbackId ? updatedFeedback : f))
      
      console.log(`Feedback ${newResolved ? 'marked as resolved' : 'marked as unresolved'}`)
    } catch (error) {
      console.error('Failed to update feedback status:', error)
      alert('Failed to update feedback status. Please try again.')
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircleIcon className="h-4 w-4" />
      case 'medium': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'low': return <InformationCircleIcon className="h-4 w-4" />
      default: return <CheckCircleIcon className="h-4 w-4" />
    }
  }

  return (
      <div className="min-h-screen text-zinc-100 asimovian-regular" style={{
        background: 'radial-gradient(ellipse at center, rgba(25, 25, 25, 1) 0%, rgba(5, 5, 5, 1) 100%)',
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.01) 0%, transparent 50%)'
      }}>
            {/* Header */}
      <div className="backdrop-blur-md border-b border-zinc-700/50 px-6 py-4" style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.03) 0%, rgba(0, 0, 0, 0.5) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(100, 253, 0, 0.02)'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <img className="h-9 w-20" src="/image.png" alt="Logo" />
              </div>
            <div>
              <h1 className="font-semibold text-zinc-100">JURY</h1>
              <p className="text-xs text-zinc-400">AI-Powered UI Analysis</p>
            </div>
            </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className={cn(
                "px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300",
                isConnected ? "border-zinc-600/50 text-zinc-300" : "border-red-500/50 text-red-400"
              )} style={isConnected ? {
                background: 'linear-gradient(135deg, rgba(100, 253, 0, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
                boxShadow: '0 0 10px rgba(100, 253, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              } : {
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isConnected ? "" : "bg-red-500"
                  )} style={isConnected ? {backgroundColor: '#64FD00'} : {}} />
                  <span>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>

            {selectedProject && (
                  <button 
                onClick={() => setViewMode('home')}
                className="w-10 h-10 flex items-center justify-center text-sm border border-zinc-600/50 text-black rounded-full transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: '#64FD00',
                  boxShadow: '0 0 15px rgba(100, 253, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
                  >
                ← 
                  </button>
                  )}
                </div>
            </div>
            </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {viewMode === 'home' && (
          <>
            {/* Left Sidebar - Projects */}
            <div className="w-80 backdrop-blur-md border-r border-zinc-700/50 flex flex-col" style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.02) 0%, rgba(0, 0, 0, 0.4) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 50px rgba(100, 253, 0, 0.03)'
            }}>
              <div className="p-4 border-b border-zinc-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" style={{color: '#64FD00'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-lg font-medium text-zinc-100">Projects</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm text-zinc-400">{projects?.length || 0}</span>
                  </div>
                </div>
            </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {!projects || projects.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-12 w-12 rounded-full bg-zinc-700 flex items-center justify-center mb-3 mx-auto">
                      <PlusIcon className="h-6 w-6 text-zinc-400" />
              </div>
                    <p className="text-sm text-zinc-400">No projects yet</p>
                    <p className="text-xs text-zinc-500">Create your first project to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        onClick={() => selectProject(project)}
                        className="p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm border border-zinc-600/30"
                        style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.04) 0%, rgba(0, 0, 0, 0.6) 100%)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(100, 253, 0, 0.02)'
                        }}
                      >
                        <div className="font-medium text-zinc-100 mb-1">{project.name}</div>
                        <div className="text-xs text-zinc-400 mb-1">
                          {project.screenshots.length} screenshots
              </div>
                        {project.description && (
                          <div className="text-xs text-zinc-500 truncate">{project.description}</div>
                        )}
                </div>
                    ))}
                  </div>
                )}
                  </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                  <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 mx-auto">
                    <EyeIcon className="h-8 w-8 text-zinc-400" />
                </div>
                  <h2 className="text-2xl font-semibold text-zinc-100 mb-2">
                    Design Feedback Platform
                  </h2>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    Upload design screenshots and get AI-powered feedback with coordinates, severity levels, and role-based discussions.
                  </p>
                </div>

                {/* Create Project Section */}
                <div className="backdrop-blur-md border border-zinc-700/50 rounded-xl p-6 max-w-md mx-auto" style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.05) 0%, rgba(0, 0, 0, 0.6) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 40px rgba(100, 253, 0, 0.03)'
                }}>
                  <h3 className="text-lg font-medium text-zinc-100 mb-3">Create New Project</h3>
                  {!showNewProjectForm ? (
              <button 
                      onClick={() => setShowNewProjectForm(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-black font-medium rounded-lg transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
                      style={{
                        backgroundColor: '#64FD00',
                        boxShadow: '0 0 20px rgba(100, 253, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)'
                      }}
              >
                      <PlusIcon className="h-4 w-4" />
                      Create New Project
              </button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Project name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 text-sm"
                        style={{'--tw-ring-color': '#64FD00'} as React.CSSProperties}
                      />
                      <textarea
                        placeholder="Description (optional)"
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 text-sm"
                        style={{'--tw-ring-color': '#64FD00'} as React.CSSProperties}
                        rows={2}
                      />
                      <div className="flex gap-2">
                      <button
                          onClick={createProject}
                          disabled={!newProjectName.trim() || isLoading}
                          className="flex-1 px-3 py-2 disabled:bg-zinc-600 text-black font-medium rounded-lg transition-all duration-300 text-sm hover:opacity-90 hover:scale-[1.02]"
                          style={{
                            backgroundColor: '#64FD00',
                            boxShadow: !newProjectName.trim() || isLoading ? 'none' : '0 0 15px rgba(100, 253, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          {isLoading ? 'Creating...' : 'Create Project'}
                </button>
                <button 
                          onClick={() => setShowNewProjectForm(false)}
                          className="px-4 py-2 border border-zinc-600/50 text-zinc-300 font-medium rounded-full transition-all duration-300 text-sm hover:scale-[1.02]"
                          style={{
                            background: 'linear-gradient(135deg, rgba(100, 100, 100, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
                            boxShadow: '0 0 10px rgba(100, 100, 100, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          }}
              >
                          Cancel
                </button>
              </div>
                </div>
              )}
                  </div>
                  </div>
                </div>
          </>
        )}

        {viewMode === 'project' && selectedProject && (
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-zinc-700/50 backdrop-blur-md" style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.03) 0%, rgba(0, 0, 0, 0.5) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(100, 253, 0, 0.02)'
            }}>
              <div className="flex items-center justify-between">
              <div>
                  <h2 className="text-2xl font-semibold text-zinc-100">{selectedProject.name}</h2>
                  <p className="text-sm text-zinc-400">
                    {selectedProject.screenshots.length} screenshots uploaded
                  </p>
                </div>
                <div className="flex items-center gap-2">
                      <input
                  ref={fileInputRef}
                  type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                      />
                      <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="px-6 py-3 disabled:bg-zinc-700 text-black font-medium rounded-lg transition-colors flex items-center gap-2 hover:opacity-90"
                    style={{backgroundColor: '#64FD00'}}
                  >
                    <UploadIcon className="h-5 w-5" />
                       
                      </button>
                    </div>
        </div>
      </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedProject.screenshots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                    <UploadIcon className="h-10 w-10 text-zinc-400" />
              </div>
                  <h3 className="text-xl font-medium text-zinc-300 mb-3">
                    No Screenshots Yet
                  </h3>
                  <p className="text-zinc-400 max-w-md mb-6">
                    Upload your first design screenshot to get started with AI-powered feedback.
                  </p>
              <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 text-black font-medium rounded-lg transition-colors flex items-center gap-2 hover:opacity-90"
                    style={{backgroundColor: '#64FD00'}}
              >
                    <UploadIcon className="h-5 w-5" />
                    Upload Your First Screenshot
              </button>
            </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {selectedProject.screenshots.map((screenshot) => (
                    <div
                      key={screenshot.filename}
                      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] group backdrop-blur-md border border-zinc-700/50"
                      onClick={() => selectScreenshot(screenshot)}
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.04) 0%, rgba(0, 0, 0, 0.6) 100%)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(100, 253, 0, 0.02)'
                      }}
                    >
                      <div className="aspect-video flex items-center justify-center" style={{
                        background: 'linear-gradient(135deg, rgba(40, 40, 40, 1) 0%, rgba(15, 15, 15, 1) 100%)',
                        backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%), linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%)'
                      }}>
                        <img
                          src={`http://localhost:5000/uploads/${screenshot.filename}`}
                          alt={screenshot.originalName}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                        />
                  </div>
                      <div className="p-4">
                        <div className="text-sm font-medium text-zinc-100 truncate mb-1">
                          {screenshot.originalName}
              </div>
                        <div className="text-xs text-zinc-400">
                          {screenshot.width} × {screenshot.height}
              </div>
              </div>
              </div>
                  ))}
            </div>
              )}
        </div>
          </div>
        )}

        {viewMode === 'screenshot' && selectedScreenshot && (
          <div className="flex h-full">
            {/* Main Content - Screenshot and Past Feedback */}
            <div className="flex-1 flex flex-col">

              <div className="flex-1 overflow-y-auto p-6">
                {/* Screenshot */}
                <div className="mb-6">
                  <div className="backdrop-blur-md border border-zinc-700/50 rounded-xl overflow-hidden" style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.04) 0%, rgba(0, 0, 0, 0.6) 100%)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(100, 253, 0, 0.02)'
                  }}>
                    <div className="relative aspect-video flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, rgba(40, 40, 40, 1) 0%, rgba(15, 15, 15, 1) 100%)',
                      backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%), linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%)'
                    }}>
                      <img
                        src={`http://localhost:5000/uploads/${selectedScreenshot.filename}`}
                        alt={selectedScreenshot.originalName}
                        className="max-w-full max-h-full object-contain"
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;
                          const container = img.parentElement;
                          if (container) {
                            container.setAttribute('data-img-width', img.naturalWidth.toString());
                            container.setAttribute('data-img-height', img.naturalHeight.toString());
                            container.setAttribute('data-display-width', img.offsetWidth.toString());
                            container.setAttribute('data-display-height', img.offsetHeight.toString());
                          }
                        }}
                      />
                      
                      {/* Interactive Feedback Overlays */}
                      {filteredFeedback.map((item) => {
                        const containerElement = document.querySelector(`[data-img-width]`);
                        if (!containerElement) return null;
                        
                        const imgWidth = parseInt(containerElement.getAttribute('data-img-width') || '0');
                        const imgHeight = parseInt(containerElement.getAttribute('data-img-height') || '0');
                        const displayWidth = parseInt(containerElement.getAttribute('data-display-width') || '0');
                        const displayHeight = parseInt(containerElement.getAttribute('data-display-height') || '0');
                        
                        if (!imgWidth || !imgHeight || !displayWidth || !displayHeight) return null;
                        
                        // Calculate scale factors
                        const scaleX = displayWidth / imgWidth;
                        const scaleY = displayHeight / imgHeight;
                        
                        // Convert percentage coordinates to pixel coordinates
                        const x = (item.coordinates.x / 100) * imgWidth * scaleX;
                        const y = (item.coordinates.y / 100) * imgHeight * scaleY;
                        const width = (item.coordinates.width / 100) * imgWidth * scaleX;
                        const height = (item.coordinates.height / 100) * imgHeight * scaleY;
                        
                        const severityColors = {
                          high: '#ef4444',
                          medium: '#eab308',
                          low: '#22c55e'
                        };
                        
                        return (
                          <div
                            key={item._id}
                            className="absolute cursor-pointer group transition-all duration-200 hover:z-20"
                            style={{
                              left: `${x}px`,
                              top: `${y}px`,
                              width: `${width}px`,
                              height: `${height}px`,
                            }}
                            onClick={() => setSelectedFeedback(item)}
                          >
                            {/* Feedback Highlight Box */}
                            <div
                              className="absolute inset-0 border-2 rounded-lg opacity-70 group-hover:opacity-100 animate-pulse"
                              style={{
                                borderColor: severityColors[item.severity],
                                backgroundColor: `${severityColors[item.severity]}20`,
                                boxShadow: `0 0 20px ${severityColors[item.severity]}40`
                              }}
                            />
                            
                            {/* Feedback Indicator Dot */}
                            <div
                              className="absolute -top-2 -left-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform"
                              style={{
                                backgroundColor: severityColors[item.severity]
                              }}
                            >
                              {item.severity === 'high' ? '!' : item.severity === 'medium' ? '?' : '✓'}
                            </div>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                              <div className="bg-black text-white text-sm rounded-lg p-3 shadow-xl max-w-xs">
                                <div className="font-semibold mb-1">{item.category}</div>
                                <div className="text-xs text-gray-300 mb-2">{item.issue}</div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{
                                    backgroundColor: severityColors[item.severity],
                                    color: 'white'
                                  }}>
                                    {item.severity}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    Click for details
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
        </div>
      </div>
                </div>

                {/* Image Info and Download Options */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-4 py-3 rounded-full border border-zinc-600/50 text-zinc-300 transition-all duration-300" style={{
                          background: 'linear-gradient(135deg, rgba(100, 253, 0, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
                          boxShadow: '0 0 10px rgba(100, 253, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        }}>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full" style={{backgroundColor: '#64FD00'}} />
                            <span className="text-lg font-medium text-zinc-100">
                              {selectedScreenshot.originalName}
                            </span>
                            <span className="text-sm text-zinc-400">•</span>
                            <span className="text-sm text-zinc-400">
                              {feedback.length} feedback items
                            </span>
                            <span className="text-sm text-zinc-400">•</span>
                            <span className="text-sm text-zinc-400">
                              {selectedScreenshot.width} × {selectedScreenshot.height}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {feedback.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={exportToPDF}
                          className="px-4 py-2 text-black font-medium rounded-full transition-all duration-300 flex items-center gap-2 hover:opacity-90 hover:scale-[1.02]"
                          style={{
                            backgroundColor: '#64FD00',
                            boxShadow: '0 0 20px rgba(100, 253, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          <DownloadIcon className="h-4 w-4" />
                          Export {currentRole === 'all' ? 'All' : currentRole.replace('_', ' ')} PDF
                        </button>
                        <button
                          onClick={exportToJSON}
                          className="px-4 py-2 text-black font-medium rounded-full transition-all duration-300 flex items-center gap-2 hover:opacity-90 hover:scale-[1.02]"
                          style={{
                            backgroundColor: '#64FD00',
                            boxShadow: '0 0 20px rgba(100, 253, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          <DownloadIcon className="h-4 w-4" />
                          Export {currentRole === 'all' ? 'All' : currentRole.replace('_', ' ')} JSON
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-zinc-100">Feedback Analysis</h3>
                    {feedback.length > 0 && (
                      <div className="text-sm text-zinc-400">
                        {feedback.length} issues found
                      </div>
                    )}
                  </div>

                  {/* Role Selector */}
                  <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-zinc-300 font-medium">View as:</span>
                      {[
                        { id: 'all', label: 'All Roles', icon: '👥', color: '#64FD00' },
                        { id: 'designer', label: 'Designer', icon: '🎨', color: '#64FD00' },
                        { id: 'developer', label: 'Developer', icon: '💻', color: '#3b82f6' },
                        { id: 'product_manager', label: 'Product Manager', icon: '📊', color: '#8b5cf6' },
                        { id: 'reviewer', label: 'Reviewer', icon: '👤', color: '#f59e0b' }
                      ].map((role) => (
                        <button
                          key={role.id}
                          onClick={() => setCurrentRole(role.id as UserRole)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                            currentRole === role.id
                              ? "text-black shadow-lg scale-105"
                              : "text-zinc-300 hover:text-white border border-zinc-600 hover:border-zinc-500"
                          )}
                          style={currentRole === role.id ? {
                            backgroundColor: role.color,
                            boxShadow: `0 0 20px ${role.color}40`
                          } : {}}
                        >
                          <span>{role.icon}</span>
                          {role.label}
                          {role.id !== 'all' && currentRole === role.id && (
                            <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs">
                              {filteredFeedback.length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredFeedback.length === 0 ? (
                    <div className="bg-zinc-800 rounded-lg p-8 text-center">
                      <div className="h-16 w-16 rounded-full bg-zinc-700 flex items-center justify-center mb-4 mx-auto">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-zinc-400" />
                      </div>
                      <h4 className="text-lg font-medium text-zinc-300 mb-2">
                        {currentRole === 'all' 
                          ? 'No Feedback Yet'
                          : `No Feedback for ${currentRole.replace('_', ' ')}`
                        }
                      </h4>
                      <p className="text-zinc-400">
                        {currentRole === 'all'
                          ? 'Generate AI feedback using the sidebar to get detailed analysis of this screenshot.'
                          : 'Try switching to "All Roles" to see all feedback items.'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredFeedback.map((item) => (
                        <div key={item._id} className={cn(
                          "rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] backdrop-blur-md border border-zinc-700/50",
                          item.resolved && "opacity-75"
                        )} style={{
                          background: item.resolved 
                            ? 'rgba(0, 0, 0, 0.4)' 
                            : 'rgba(0, 0, 0, 0.4)',
                          backgroundImage: item.resolved 
                            ? 'linear-gradient(135deg, rgba(100, 253, 0, 0.08) 0%, rgba(0, 0, 0, 0.6) 100%)'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.04) 0%, rgba(0, 0, 0, 0.6) 100%)',
                          boxShadow: item.resolved 
                            ? `0 0 20px rgba(100, 253, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 40px rgba(100, 253, 0, 0.05)` 
                            : `0 0 20px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(239, 68, 68, 0.03)`
                        }}>
                          {/* Header with severity chart */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                                  <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center",
                                    item.severity === 'high' ? "bg-red-500" : 
                                    item.severity === 'medium' ? "bg-yellow-500" : "bg-green-500"
                                  )}>
                                    {getSeverityIcon(item.severity)}
                                  </div>
                                </div>
                                <div className={cn(
                                  "absolute -top-1 -right-1 w-3 h-3 rounded-full",
                                  item.severity === 'high' ? "bg-red-500" : 
                                  item.severity === 'medium' ? "bg-yellow-500" : "bg-green-500"
                                )}></div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-medium text-zinc-100 capitalize">{item.severity}</div>
                                  {item.resolved && (
                                    <div className="flex items-center gap-1 text-xs" style={{color: '#64FD00'}}>
                                      <CheckIcon className="h-3 w-3" />
                                      Resolved
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm text-zinc-400">{item.category}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-zinc-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </div>
                              <button
                                onClick={() => toggleFeedbackResolved(item._id, item.resolved)}
                                className={cn(
                                  "p-2 rounded-lg transition-colors",
                                  item.resolved 
                                    ? "hover:opacity-80" 
                                    : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-300"
                                )}
                                style={item.resolved ? {backgroundColor: '#64FD00', color: 'black'} : {}}
                                title={item.resolved ? "Mark as unresolved" : "Mark as resolved"}
                              >
                                {item.resolved ? (
                                  <CheckIcon className="h-4 w-4" style={{color: 'black'}} />
                                ) : (
                                  <XMarkIcon className="h-4 w-4" style={{color: 'red'}} />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Circular Progress Chart */}
                          <div className="mb-3 flex items-center justify-center">
                            <div className="relative w-16 h-16">
                              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                {/* Background circle */}
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#374151"
                                  strokeWidth="2"
                                />
                                {/* Progress circle */}
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke={item.severity === 'high' ? "#ef4444" : item.severity === 'medium' ? "#eab308" : "#22c55e"}
                                  strokeWidth="2"
                                  strokeDasharray={`${item.severity === 'high' ? '100' : item.severity === 'medium' ? '60' : '30'}, 100`}
                                  className="transition-all duration-1000 ease-out"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-sm font-bold text-zinc-100">
                                  {item.severity === 'high' ? '100%' : item.severity === 'medium' ? '60%' : '30%'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Vertical Bar Chart */}
                          <div className="mb-3">
                            <div className="text-sm text-zinc-400 mb-1 text-center">Severity Level</div>
                            <div className="flex items-end justify-center gap-1 h-12">
                              <div className={cn(
                                "w-3 rounded-t transition-all duration-500",
                                item.severity === 'high' ? "bg-red-500 h-12" : 
                                item.severity === 'medium' ? "bg-yellow-500 h-8" : "bg-green-500 h-4"
                              )}></div>
                              <div className={cn(
                                "w-3 rounded-t transition-all duration-500",
                                item.severity === 'high' ? "bg-red-400 h-10" : 
                                item.severity === 'medium' ? "bg-yellow-400 h-6" : "bg-green-400 h-3"
                              )}></div>
                              <div className={cn(
                                "w-3 rounded-t transition-all duration-500",
                                item.severity === 'high' ? "bg-red-300 h-8" : 
                                item.severity === 'medium' ? "bg-yellow-300 h-4" : "bg-green-300 h-2"
                              )}></div>
                              <div className={cn(
                                "w-3 rounded-t transition-all duration-500",
                                item.severity === 'high' ? "bg-red-200 h-6" : 
                                item.severity === 'medium' ? "bg-yellow-200 h-3" : "bg-green-200 h-1"
                              )}></div>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-500 mt-1">
                              <span>Low</span>
                              <span>High</span>
                            </div>
                          </div>

                          {/* Issue Description */}
                          <div className="mb-3">
                            <div className="text-sm font-medium text-zinc-100 mb-1">Issue Description:</div>
                            <div className="text-sm text-zinc-300 bg-zinc-700/50 p-3 rounded text-justify">
                              {item.issue.length > 100 ? `${item.issue.substring(0, 100)}...` : item.issue}
                            </div>
                          </div>

                          {/* Recommendation */}
                          <div className="mb-3">
                            <div className="text-sm font-medium text-zinc-100 mb-1">Recommendation:</div>
                            <div className="text-sm text-zinc-300 bg-zinc-700/50 p-3 rounded text-justify">
                              {item.recommendation.length > 100 ? `${item.recommendation.substring(0, 100)}...` : item.recommendation}
                            </div>
                          </div>

                          {/* Location with icon */}
                          <div className="mb-3">
                            <div className="text-sm font-medium text-zinc-100 mb-1">Location:</div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-700/30 p-2 rounded">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              ({item.coordinates.x}, {item.coordinates.y})
                            </div>
                          </div>

                          {/* Role Tags */}
                          <div className="mb-3">
                            <div className="text-sm font-medium text-zinc-100 mb-2">Involved Roles:</div>
                            <div className="flex flex-wrap gap-2">
                              {item.roleTags.map((role) => {
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
                                return (
                                  <div
                                    key={role}
                                    className="px-2 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm"
                                    style={{
                                      backgroundColor: getRoleColor(role),
                                      boxShadow: `0 0 10px ${getRoleColor(role)}40`
                                    }}
                                  >
                                    {getRoleInitial(role)}
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Role Distribution Chart */}
                          <div className="mb-3">
                            <div className="text-sm text-zinc-400 mb-2 text-center">Role Distribution</div>
                            <div className="flex items-center justify-center gap-2">
                              {item.roleTags.map((role, index) => {
                                const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
                                const roleIcons = {
                                  designer: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>,
                                  developer: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
                                  product_manager: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
                                  reviewer: <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                };
  return (
                                  <div key={role} className="flex flex-col items-center">
                                    <div 
                                      className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                                      style={{ backgroundColor: `${colors[index % colors.length]}20` }}
                                    >
                                      <div style={{ color: colors[index % colors.length] }}>
                                        {roleIcons[role as keyof typeof roleIcons]}
        </div>
      </div>
                                    <div className="text-sm text-zinc-400 text-center">
                                      {role === 'product_manager' ? 'PM' : role.charAt(0).toUpperCase()}
        </div>
          </div>
                                );
                              })}
                </div>
                </div>

                          {/* Impact Score Chart */}
                          <div className="mb-3">
                            <div className="text-sm text-zinc-400 mb-1 text-center">Impact Score</div>
                            <div className="relative w-full h-6 bg-zinc-700 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all duration-1000 ease-out",
                                  item.severity === 'high' ? "bg-gradient-to-r from-red-500 to-red-400" : 
                                  item.severity === 'medium' ? "bg-gradient-to-r from-yellow-500 to-yellow-400" : 
                                  "bg-gradient-to-r from-green-500 to-green-400"
                                )}
                                style={{ 
                                  width: `${item.severity === 'high' ? '100' : item.severity === 'medium' ? '60' : '30'}%` 
                                }}
                              ></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-zinc-100">
                                  {item.severity === 'high' ? '100%' : item.severity === 'medium' ? '60%' : '30%'}
                  </span>
                </div>
                </div>
              </div>

                          {/* Discussion Activity Chart */}
                          <div className="mb-3">
                            <div className="text-sm text-zinc-400 mb-1 text-center">Discussion Activity</div>
                            <div className="flex items-end justify-center gap-1 h-8 mb-1">
                              {/* Mini line chart showing discussion activity */}
                              {[2, 4, 1, 3, 2, 5, item.discussions.length].map((height, index) => (
                                <div
                                  key={index}
                                  className="w-1 bg-emerald-500/30 rounded-t transition-all duration-300"
                                  style={{ height: `${Math.max(height * 2, 2)}px` }}
                                ></div>
            ))}
          </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                              {item.discussions.length} discussions
        </div>
                          </div>

                          {/* Discussion Button */}
                          <div className="bg-zinc-700/50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                {item.discussions.length} discussion{item.discussions.length !== 1 ? 's' : ''}
                                {item.resolved && (
                                  <span style={{color: '#64FD00'}}></span>
                                )}
                              </div>
                              <button
                                onClick={() => window.open(`/discussion?feedbackId=${item._id}`, '_blank')}
                                className="px-4 py-2 text-black text-sm rounded transition-colors flex items-center gap-2 hover:opacity-90"
                                style={{backgroundColor: '#64FD00'}}
                              >
                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                
                              </button>
                            </div>
                          </div>
              </div>
                      ))}
            </div>
                  )}
              </div>
            </div>
          </div>

            {/* Sidebar - Generate New Feedback (only for screenshots with no feedback) */}
            {feedback.length === 0 && (
              <div className="w-80 backdrop-blur-md border-l border-zinc-700/50 flex flex-col" style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.02) 0%, rgba(0, 0, 0, 0.4) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 50px rgba(100, 253, 0, 0.03)'
              }}>
                <div className="p-4 border-b border-zinc-700">
                  <h3 className="text-lg font-medium text-zinc-100">Generate AI Feedback</h3>
                  <p className="text-sm text-zinc-400">Get detailed analysis of this screenshot</p>
                  </div>

                <div className="flex-1 p-4">
                  <div className="backdrop-blur-sm border border-zinc-600/30 rounded-lg p-4 mb-4" style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.04) 0%, rgba(0, 0, 0, 0.6) 100%)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(100, 253, 0, 0.02)'
                  }}>
                    <div className="text-sm text-zinc-300 mb-2">Screenshot Info:</div>
                    <div className="text-xs text-zinc-400">
                      <div>Name: {selectedScreenshot.originalName}</div>
                      <div>Size: {selectedScreenshot.width} × {selectedScreenshot.height}</div>
                      <div>Status: No feedback yet</div>
                </div>
                  </div>

                  <button
                    onClick={() => generateFeedback(selectedScreenshot)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 disabled:bg-zinc-600 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                    style={{backgroundColor: '#64FD00'}}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <EyeIcon className="h-5 w-5" />
                        Generate AI Feedback
                      </>
                    )}
                  </button>

                  {isLoading && (
                    <div className="mt-4 p-3 bg-zinc-700 rounded-lg">
                      <div className="text-sm text-zinc-300 mb-2">AI Analysis in Progress...</div>
                      <div className="text-xs text-zinc-400">
                        Our AI is examining your screenshot and will provide detailed feedback with coordinates, severity levels, and recommendations.
                  </div>
                </div>
              )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  )
}
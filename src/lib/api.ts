const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface SourceSnippet {
  citationNumber: number;
  text: string;
  originalScore: number;
  rerankPosition?: number;
  isReranked: boolean;
}

export interface ChatResponse {
  response: string;
  citations?: number[];
  sourceSnippets?: SourceSnippet[];
  sessionId: string;
  searchResults: Array<{
    text: string;
    originalScore: number;
    rerankPosition?: number;
    isReranked: boolean;
  }>;
}

export interface ChatHistoryResponse {
  sessionId: string;
  history: ChatMessage[];
}

export interface Session {
  sessionId: string;
  messageCount: number;
  lastActivity: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  filename: string;
  documentsProcessed: number;
  type: string;
  source: string;
  documentId: string;
}

export interface Document {
  documentId: string;
  filename: string;
  type: string;
  source: string;
  documentsProcessed: number;
  uploadedAt: string;
}

export interface DocumentsResponse {
  documents: Document[];
}

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
  filename: string;
  embeddingsDeleted: number;
  filterUsed?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId: sessionId || 'default',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(`${this.baseUrl}/chat/history/${sessionId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async clearChatHistory(sessionId: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/chat/history/${sessionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getSessions(): Promise<{ sessions: Session[] }> {
    const response = await fetch(`${this.baseUrl}/sessions`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async searchDocuments(query: string, limit?: number, useReranking?: boolean): Promise<{ 
    query: string; 
    useReranking: boolean;
    totalCandidates: number;
    results: Array<{ 
      text: string; 
      originalScore: number;
      rerankPosition?: number;
      isReranked: boolean;
    }> 
  }> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, limit, useReranking }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async uploadDocument(file: File, url?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('document', file);
    
    if (url && url.trim()) {
      formData.append('url', url.trim());
    }

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getDocuments(): Promise<DocumentsResponse> {
    const response = await fetch(`${this.baseUrl}/documents`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteDocument(documentId: string): Promise<DeleteDocumentResponse> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async debugEmbeddings(documentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/debug/embeddings/${documentId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Project {
  _id: string;
  name: string;
  description: string;
  screenshots: Screenshot[];
  createdAt: string;
  updatedAt: string;
}

export interface Screenshot {
  filename: string;
  originalName: string;
  path: string;
  width: number;
  height: number;
  uploadedAt: string;
}

export interface Feedback {
  _id: string;
  category: 'Accessibility' | 'Visual Hierarchy' | 'Content & Copy' | 'UI/UX Patterns';
  issue: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
  roleTags: ('designer' | 'developer' | 'product_manager' | 'reviewer')[];
  discussions: Discussion[];
  createdAt: string;
  createdBy: string;
  projectId: string;
  screenshotId: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface Discussion {
  role: 'designer' | 'developer' | 'product_manager' | 'reviewer';
  message: string;
  createdAt: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${this.baseUrl}/api/projects`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async createProject(name: string, description: string = ''): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getProject(id: string): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/api/projects/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Screenshots
  async uploadScreenshot(projectId: string, file: File): Promise<{ screenshot: Screenshot; project: Project }> {
    const formData = new FormData();
    formData.append('screenshot', file);

    const response = await fetch(`${this.baseUrl}/api/projects/${projectId}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Feedback
  async generateFeedback(projectId: string, screenshotId: string): Promise<Feedback[]> {
    const response = await fetch(`${this.baseUrl}/api/projects/${projectId}/feedback/${screenshotId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getFeedback(projectId: string): Promise<Feedback[]> {
    const response = await fetch(`${this.baseUrl}/api/projects/${projectId}/feedback`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getAllFeedback(): Promise<Feedback[]> {
    const response = await fetch(`${this.baseUrl}/api/feedback`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getFeedbackById(feedbackId: string): Promise<Feedback> {
    const response = await fetch(`${this.baseUrl}/api/feedback/${feedbackId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async addDiscussion(feedbackId: string, role: string, message: string): Promise<Feedback> {
    const response = await fetch(`${this.baseUrl}/api/feedback/${feedbackId}/discussion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role, message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async markFeedbackResolved(feedbackId: string, resolved: boolean, resolvedBy: string): Promise<Feedback> {
    const response = await fetch(`${this.baseUrl}/api/feedback/${feedbackId}/resolve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resolved, resolvedBy }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Export
  async exportToPDF(projectId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/projects/${projectId}/export/pdf`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.blob();
  }

  async exportToJSON(projectId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/projects/${projectId}/export/json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.blob();
  }

  // Export role-filtered PDF
  async exportRoleFilteredPDF(projectId: string, role: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/projects/${projectId}/export/pdf/${role}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.blob();
  }

  // Export role-filtered JSON
  async exportRoleFilteredJSON(projectId: string, role: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/projects/${projectId}/export/json/${role}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.blob();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/api/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();

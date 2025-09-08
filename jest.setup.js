// Jest setup file for mocking API calls
import { jest } from '@jest/globals';

// Mock the API client globally
jest.mock('./src/lib/api', () => {
  const mockApiClient = {
    getProjects: jest.fn().mockResolvedValue([
      {
        _id: 'test-project-1',
        name: 'Test Project',
        description: 'Test Description',
        screenshots: [
          {
            filename: 'test-screenshot.jpg',
            originalName: 'homepage.png',
            path: '/uploads/test-screenshot.jpg',
            width: 1920,
            height: 1080,
            uploadedAt: '2023-01-01T00:00:00.000Z'
          }
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
    ]),
    healthCheck: jest.fn().mockResolvedValue({
      status: 'OK',
      message: 'API is running',
      timestamp: new Date().toISOString()
    }),
    createProject: jest.fn().mockResolvedValue({
      _id: 'test-project-2',
      name: 'New Project',
      description: 'New Description',
      screenshots: [],
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z'
    }),
    uploadScreenshot: jest.fn().mockResolvedValue({
      screenshot: {
        filename: 'uploaded.jpg',
        originalName: 'uploaded.jpg',
        path: '/uploads/uploaded.jpg',
        width: 1920,
        height: 1080,
        uploadedAt: new Date().toISOString()
      },
      project: {
        _id: 'test-project-1',
        name: 'Test Project',
        screenshots: []
      }
    }),
    getFeedback: jest.fn().mockResolvedValue([
      {
        _id: 'test-feedback-1',
        category: 'Accessibility',
        issue: 'Test accessibility issue',
        coordinates: { x: 10, y: 20, width: 30, height: 40 },
        severity: 'high',
        recommendation: 'Test recommendation',
        roleTags: ['designer', 'developer'],
        discussions: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        resolved: false,
        projectId: 'test-project-1',
        screenshotId: 'test-screenshot.jpg'
      }
    ]),
    generateFeedback: jest.fn().mockResolvedValue([]),
    exportRoleFilteredPDF: jest.fn().mockResolvedValue(new Blob(['test pdf'], { type: 'application/pdf' })),
    exportRoleFilteredJSON: jest.fn().mockResolvedValue(new Blob(['{}'], { type: 'application/json' })),
    markFeedbackResolved: jest.fn().mockResolvedValue({
      _id: 'test-feedback-1',
      category: 'Accessibility',
      issue: 'Test accessibility issue',
      coordinates: { x: 10, y: 20, width: 30, height: 40 },
      severity: 'high',
      recommendation: 'Test recommendation',
      roleTags: ['designer', 'developer'],
      discussions: [],
      createdAt: '2023-01-01T00:00:00.000Z',
      resolved: true,
      projectId: 'test-project-1',
      screenshotId: 'test-screenshot.jpg'
    }),
    getAllFeedback: jest.fn().mockResolvedValue([]),
    getFeedbackById: jest.fn().mockResolvedValue(null),
    addDiscussion: jest.fn().mockResolvedValue(null)
  };

  return {
    ApiClient: jest.fn().mockImplementation(() => mockApiClient),
    apiClient: mockApiClient
  };
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    forEach: jest.fn()
  }),
  usePathname: () => '/',
  useParams: () => ({})
}));

// Mock window.URL for file handling
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn(),
  },
  writable: true
});

// Global test setup
global.beforeEach(() => {
  jest.clearAllMocks();
});

// Debug test to check if mocks are working
import { apiClient } from '../src/lib/api';

describe('Debug API Mock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('apiClient should be mocked', async () => {
    console.log('apiClient:', apiClient);
    console.log('apiClient.getProjects:', apiClient.getProjects);

    const result = await apiClient.getProjects();
    console.log('getProjects result:', result);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Project');
  });
});

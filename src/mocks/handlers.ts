import { http, HttpResponse } from 'msw';

export const handlers = [
  // Example: mock GET /api/user
  http.get('/api/user', () => {
    return HttpResponse.json({ id: '1', full_name: 'Test User' });
  }),
  // Add more handlers as needed for your API endpoints
];

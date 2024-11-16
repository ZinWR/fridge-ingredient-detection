import { POST } from '../app/api/detect/route';

describe('API Route Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 500 error if the Clarifai API key is missing', async () => {
    delete process.env.CLARIFAI_API_KEY;

    const request = new Request('http://localhost/api/detect', {
      method: 'POST',
      body: JSON.stringify({ image: 'dummy_image_data' }),
    });

    const response = await POST(request);
    const jsonResponse = await response.json();
    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({ error: 'Clarifai API key is not configured' });
  });

  it('should return a 400 error if no image is provided in the request body', async () => {
    process.env.CLARIFAI_API_KEY = 'mock-api-key';

    const request = new Request('http://localhost/api/detect', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const jsonResponse = await response.json();
    expect(response.status).toBe(500); 
    expect(jsonResponse.error).toBeDefined();
  });

  it('should return a 500 error if the Clarifai API fails', async () => {
    process.env.CLARIFAI_API_KEY = 'mock-api-key';

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => 'Bad Request',
    }) as jest.Mock;

    const request = new Request('http://localhost/api/detect', {
      method: 'POST',
      body: JSON.stringify({ image: 'dummy_image_data' }),
    });

    const response = await POST(request);
    const jsonResponse = await response.json();
    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ error: 'Failed to fetch data from Clarifai API' });
    global.fetch.mockRestore();
  });

  it('should return an empty ingredient list if no high-confidence concepts are returned', async () => {
    process.env.CLARIFAI_API_KEY = 'mock-api-key';

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        outputs: [
          {
            data: {
              concepts: [
                { name: 'LowConfidenceItem', value: 0.3 },
                { name: 'AnotherLowConfidence', value: 0.5 },
              ],
            },
          },
        ],
      }),
    }) as jest.Mock;

    const request = new Request('http://localhost/api/detect', {
      method: 'POST',
      body: JSON.stringify({ image: 'dummy_image_data' }),
    });

    const response = await POST(request);
    const jsonResponse = await response.json();
    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({ ingredients: [] });
    global.fetch.mockRestore();
  });

  it('should handle a successful request with valid high-confidence ingredients', async () => {
    process.env.CLARIFAI_API_KEY = 'mock-api-key';

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        outputs: [
          {
            data: {
              concepts: [
                { name: 'Pizza', value: 0.95 },
                { name: 'Pasta', value: 0.92 },
              ],
            },
          },
        ],
      }),
    }) as jest.Mock;

    const request = new Request('http://localhost/api/detect', {
      method: 'POST',
      body: JSON.stringify({ image: 'dummy_image_data' }),
    });

    const response = await POST(request);
    const jsonResponse = await response.json();
    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({ ingredients: ['Pizza', 'Pasta'] });
    global.fetch.mockRestore();
  });
});

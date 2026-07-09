const { fetchMessage } = require('./script');

describe('fetchMessage', () => {
  afterEach(() => {
    global.fetch = undefined;
  });

  it('returns the message from a successful response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ message: 'Hello from the backend!' }),
    });

    const result = await fetchMessage('http://example.com/api/message');
    expect(result).toBe('Hello from the backend!');
    expect(global.fetch).toHaveBeenCalledWith('http://example.com/api/message');
  });

  it('propagates errors when the fetch fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network error'));

    await expect(fetchMessage('http://example.com/api/message')).rejects.toThrow('network error');
  });
});

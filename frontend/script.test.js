const { fetchMessage, fetchNotes, createNote } = require('./script');

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

describe('fetchNotes', () => {
  afterEach(() => {
    global.fetch = undefined;
  });

  it('returns the parsed list of notes', async () => {
    const notes = [{ id: 1, text: 'Learn Terraform' }];
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(notes),
    });

    const result = await fetchNotes('http://example.com/api/notes');
    expect(result).toEqual(notes);
  });
});

describe('createNote', () => {
  afterEach(() => {
    global.fetch = undefined;
  });

  it('posts the note text and returns the created note', async () => {
    const created = { id: 2, text: 'Ship it' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(created),
    });

    const result = await createNote('http://example.com/api/notes', 'Ship it');
    expect(result).toEqual(created);
    expect(global.fetch).toHaveBeenCalledWith('http://example.com/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Ship it' }),
    });
  });

  it('throws when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    await expect(createNote('http://example.com/api/notes', 'Ship it')).rejects.toThrow(
      'Failed to create note'
    );
  });
});

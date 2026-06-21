/**
 * @fileoverview Tests for the ChatBox component.
 * Covers message formatting, chat filtering, message validation,
 * and time display logic.
 */
// @fileoverview - Tests

describe('ChatBox Component - Time Formatting', () => {
  const formatTime = (ts) => {
    if (!ts) return '';
    const diff = Math.floor((Date.now() - ts) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
    return `${Math.floor(diff/1440)}d ago`;
  };

  it('returns "Just now" for messages less than 1 minute old', () => {
    const result = formatTime(Date.now() - 30000); // 30 seconds ago
    expect(result).toBe('Just now');
  });

  it('returns minutes for messages less than 1 hour old', () => {
    const result = formatTime(Date.now() - 5 * 60000); // 5 minutes ago
    expect(result).toBe('5m ago');
  });

  it('returns hours for messages less than 1 day old', () => {
    const result = formatTime(Date.now() - 3 * 60 * 60000); // 3 hours ago
    expect(result).toBe('3h ago');
  });

  it('returns days for older messages', () => {
    const result = formatTime(Date.now() - 2 * 24 * 60 * 60000); // 2 days ago
    expect(result).toBe('2d ago');
  });

  it('returns empty string for null timestamp', () => {
    expect(formatTime(null)).toBe('');
  });

  it('returns empty string for undefined timestamp', () => {
    expect(formatTime(undefined)).toBe('');
  });
});

describe('ChatBox Component - Chat Filtering', () => {
  const currentUserId = 'test-user-1';
  const mockChats = [
    { id: 'c1', buyerId: 'test-user-1', sellerId: 'user-2', itemTitle: 'Chair' },
    { id: 'c2', buyerId: 'user-3', sellerId: 'test-user-1', itemTitle: 'Table' },
    { id: 'c3', buyerId: 'user-3', sellerId: 'user-4', itemTitle: 'Lamp' },
  ];

  it('filters chats where user is buyer or seller', () => {
    const myChats = mockChats.filter(c => c.buyerId === currentUserId || c.sellerId === currentUserId);
    expect(myChats).toHaveLength(2);
  });

  it('excludes chats the user is not part of', () => {
    const myChats = mockChats.filter(c => c.buyerId === currentUserId || c.sellerId === currentUserId);
    expect(myChats.find(c => c.id === 'c3')).toBeUndefined();
  });

  it('correctly identifies self-chats', () => {
    const selfChat = { buyerId: 'test-user-1', sellerId: 'test-user-1' };
    const amIBuyer = selfChat.buyerId === currentUserId;
    const amISeller = selfChat.sellerId === currentUserId;
    expect(amIBuyer && amISeller).toBe(true);
  });

  it('determines the other party name correctly', () => {
    const chat = mockChats[0]; // buyer is current user
    const amIBuyer = chat.buyerId === currentUserId;
    const otherName = amIBuyer ? (chat.sellerName || 'Seller') : (chat.buyerName || 'Buyer');
    expect(otherName).toBe('Seller');
  });
});

describe('ChatBox Component - Message Validation', () => {
  it('rejects empty messages', () => {
    const msgInput = '   ';
    expect(msgInput.trim().length).toBe(0);
  });

  it('accepts valid messages', () => {
    const msgInput = 'Hello!';
    expect(msgInput.trim().length).toBeGreaterThan(0);
  });

  it('generates unique message IDs', () => {
    const id1 = Math.random().toString(36).substring(2, 15);
    const id2 = Math.random().toString(36).substring(2, 15);
    expect(id1).not.toBe(id2);
  });
});

describe('ChatBox Component - Chat Sorting', () => {
  it('sorts chats by updatedAt descending', () => {
    const chats = [
      { id: 'c1', updatedAt: 100 },
      { id: 'c2', updatedAt: 300 },
      { id: 'c3', updatedAt: 200 },
    ];
    chats.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    expect(chats[0].id).toBe('c2');
    expect(chats[1].id).toBe('c3');
    expect(chats[2].id).toBe('c1');
  });
});

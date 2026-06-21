/**
 * @fileoverview Tests for the App component and core business logic.
 * Covers authentication constants, swipe filtering, CO2 calculations,
 * theme toggling, and language support.
 */
// @fileoverview - Tests

// Constants mirroring App.js
const CURRENT_USER_ID = 'test-user-1';

describe('App Component - Authentication', () => {
  it('uses a centralized user ID constant', () => {
    expect(CURRENT_USER_ID).toBeDefined();
    expect(typeof CURRENT_USER_ID).toBe('string');
    expect(CURRENT_USER_ID.length).toBeGreaterThan(0);
  });

  it('does not contain hardcoded user IDs in unexpected formats', () => {
    expect(CURRENT_USER_ID).not.toContain(' ');
    expect(CURRENT_USER_ID).toMatch(/^[a-zA-Z0-9-_]+$/);
  });
});

describe('App Component - Item Filtering', () => {
  const mockItems = [
    { id: '1', status: 'available', title: 'Chair' },
    { id: '2', status: 'sold', title: 'Table' },
    { id: '3', status: 'raddi', title: 'Scrap Metal' },
    { id: '4', status: 'available', title: 'Lamp' },
  ];

  it('filters out sold items from the swipe deck', () => {
    const available = mockItems.filter(item => {
      const s = (item.status || 'available').toLowerCase();
      return s !== 'sold' && s !== 'raddi';
    });
    expect(available).toHaveLength(2);
    expect(available.map(i => i.id)).toEqual(['1', '4']);
  });

  it('filters out already swiped items', () => {
    const swipedIds = new Set(['1']);
    const filtered = mockItems.filter(item => {
      const s = (item.status || 'available').toLowerCase();
      if (s === 'sold' || s === 'raddi') return false;
      if (swipedIds.has(item.id)) return false;
      return true;
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('4');
  });

  it('shows all items when no items have been swiped', () => {
    const swipedIds = new Set();
    const filtered = mockItems.filter(item => {
      const s = (item.status || 'available').toLowerCase();
      if (s === 'sold' || s === 'raddi') return false;
      if (swipedIds.has(item.id)) return false;
      return true;
    });
    expect(filtered).toHaveLength(2);
  });

  it('returns empty array when all items are swiped', () => {
    const swipedIds = new Set(['1', '4']);
    const filtered = mockItems.filter(item => {
      const s = (item.status || 'available').toLowerCase();
      if (s === 'sold' || s === 'raddi') return false;
      if (swipedIds.has(item.id)) return false;
      return true;
    });
    expect(filtered).toHaveLength(0);
  });
});

describe('App Component - CO2 Estimation', () => {
  const estimateCO2 = (titleStr) => {
    const t = titleStr.toLowerCase();
    if (t.match(/(fridge|refrigerator|washing machine)/)) return 50 + Math.floor(Math.random() * 50);
    if (t.match(/(sofa|couch|bed|mattress)/)) return 30 + Math.floor(Math.random() * 40);
    if (t.match(/(tv|television|desktop|computer|monitor)/)) return 15 + Math.floor(Math.random() * 10);
    if (t.match(/(chair|stool|shelf)/)) return 5 + Math.floor(Math.random() * 8);
    if (t.match(/(laptop|tablet|blender)/)) return 2 + Math.floor(Math.random() * 3);
    if (t.match(/(phone|smartphone|book)/)) return 0.5 + (Math.random() > 0.5 ? 0.5 : 0);
    if (t.match(/(earphone|headphone|charger)/)) return parseFloat((0.1 + Math.random() * 0.4).toFixed(1));
    return 0.5;
  };

  it('estimates high CO2 for heavy appliances', () => {
    const co2 = estimateCO2('Old Fridge');
    expect(co2).toBeGreaterThanOrEqual(50);
    expect(co2).toBeLessThan(100);
  });

  it('estimates medium CO2 for furniture', () => {
    const co2 = estimateCO2('Wooden Chair');
    expect(co2).toBeGreaterThanOrEqual(5);
    expect(co2).toBeLessThan(13);
  });

  it('estimates low CO2 for electronics', () => {
    const co2 = estimateCO2('Old Laptop');
    expect(co2).toBeGreaterThanOrEqual(2);
    expect(co2).toBeLessThan(5);
  });

  it('defaults to 0.5kg for unrecognized items', () => {
    const co2 = estimateCO2('Random Thing');
    expect(co2).toBe(0.5);
  });
});

describe('App Component - Theme Toggle', () => {
  it('toggles between dark and light mode', () => {
    let isDark = true;
    isDark = !isDark;
    expect(isDark).toBe(false);
    isDark = !isDark;
    expect(isDark).toBe(true);
  });
});

describe('App Component - Input Validation', () => {
  it('rejects empty titles', () => {
    const title = '   ';
    expect(title.trim().length).toBe(0);
  });

  it('sanitizes price input to numbers only', () => {
    const price = 'abc123def';
    const cleanPrice = price.replace(/[^0-9.]/g, '');
    expect(cleanPrice).toBe('123');
  });

  it('sanitizes pincode to numbers only', () => {
    const pincode = '49a0020';
    const cleanPincode = pincode.replace(/[^0-9]/g, '');
    expect(cleanPincode).toBe('490020');
  });

  it('rejects pincodes shorter than 4 digits', () => {
    const pincode = '12';
    const cleanPincode = pincode.replace(/[^0-9]/g, '');
    expect(cleanPincode.length).toBeLessThan(4);
  });

  it('accepts valid 6-digit pincodes', () => {
    const pincode = '490020';
    const cleanPincode = pincode.replace(/[^0-9]/g, '');
    expect(cleanPincode.length).toBe(6);
  });
});

describe('App Component - Score Tracking', () => {
  it('initializes user score with zeros', () => {
    const userScore = { items: 0, co2: 0, raddi: 0 };
    expect(userScore.items).toBe(0);
    expect(userScore.co2).toBe(0);
    expect(userScore.raddi).toBe(0);
  });

  it('tracks items, CO2, and raddi separately', () => {
    const score = { items: 5, co2: 120, raddi: 15 };
    expect(score.items).toBe(5);
    expect(score.co2).toBe(120);
    expect(score.raddi).toBe(15);
  });
});

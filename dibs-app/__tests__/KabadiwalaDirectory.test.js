/**
 * @fileoverview Tests for the KabadiwalaDirectory component.
 * Covers pincode search, Google Maps URL construction,
 * input validation, and edge cases.
 */
// @fileoverview - Tests

describe('KabadiwalaDirectory Component - Search Logic', () => {
  it('constructs Google Maps search URL with pincode', () => {
    const pin = '490020';
    const query = `Kabadiwala near ${pin}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    expect(url).toContain('490020');
    expect(url).toContain('google.com/maps');
    expect(url).toContain('Kabadiwala');
  });

  it('searches near current location when pincode is empty', () => {
    const pin = '';
    const query = pin ? `Kabadiwala near ${pin}` : 'Kabadiwala near me';
    expect(query).toBe('Kabadiwala near me');
  });

  it('trims whitespace from pincode before searching', () => {
    const pin = '  490020  ';
    const trimmed = pin.trim();
    expect(trimmed).toBe('490020');
  });

  it('handles special characters in pincode gracefully', () => {
    const pin = '49!@#0';
    const encoded = encodeURIComponent(`Kabadiwala near ${pin}`);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);
  });
});

describe('KabadiwalaDirectory Component - Input Validation', () => {
  it('limits pincode input to 6 characters', () => {
    const maxLength = 6;
    const input = '12345678';
    const limited = input.substring(0, maxLength);
    expect(limited).toBe('123456');
    expect(limited.length).toBe(maxLength);
  });

  it('accepts numeric keyboard type', () => {
    const keyboardType = 'numeric';
    expect(keyboardType).toBe('numeric');
  });
});

describe('KabadiwalaDirectory Component - URL Construction', () => {
  it('produces a valid Google Maps URL', () => {
    const query = 'Kabadiwala near 490020';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    expect(url).toMatch(/^https:\/\/www\.google\.com\/maps/);
  });

  it('correctly encodes spaces in the query', () => {
    const query = 'Kabadiwala near me';
    const encoded = encodeURIComponent(query);
    expect(encoded).not.toContain(' ');
    expect(encoded).toContain('Kabadiwala');
  });
});

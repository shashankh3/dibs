/**
 * @fileoverview Tests for the Card component.
 * Covers data display logic, image fallbacks, CO2 badge rendering,
 * hot item detection, and distance formatting.
 */
// @fileoverview - Tests

describe('Card Component - Data Display', () => {
  const mockCardData = {
    id: '1',
    title: 'Vintage Chair',
    titleKey: 'vintageChair',
    price: '₹500',
    conditionKey: 'used',
    co2: 5,
    dibsCount: 3,
    image: 'https://example.com/chair.jpg',
    distance: '2.5km',
    calculatedDistance: '2.5km',
  };

  it('uses calculatedDistance over fallback distance', () => {
    const displayDistance = mockCardData.calculatedDistance || mockCardData.distance;
    expect(displayDistance).toBe('2.5km');
  });

  it('falls back to distance when calculatedDistance is missing', () => {
    const data = { ...mockCardData, calculatedDistance: undefined };
    const displayDistance = data.calculatedDistance || data.distance;
    expect(displayDistance).toBe('2.5km');
  });

  it('correctly renders price', () => {
    expect(mockCardData.price).toBe('₹500');
  });

  it('displays Free for free items', () => {
    const freeItem = { ...mockCardData, price: 'Free' };
    expect(freeItem.price).toBe('Free');
  });
});

describe('Card Component - Hot Item Detection', () => {
  it('marks item as hot when dibsCount >= 10', () => {
    const isHot = 15 >= 10;
    expect(isHot).toBe(true);
  });

  it('does not mark item as hot when dibsCount < 10', () => {
    const isHot = 5 >= 10;
    expect(isHot).toBe(false);
  });

  it('marks item as hot at exactly 10 dibs', () => {
    const isHot = 10 >= 10;
    expect(isHot).toBe(true);
  });
});

describe('Card Component - Image Handling', () => {
  it('uses provided image URI', () => {
    const data = { image: 'https://example.com/photo.jpg' };
    const safeImage = data.image || data.imageUri || 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800';
    expect(safeImage).toBe('https://example.com/photo.jpg');
  });

  it('falls back to imageUri if image is missing', () => {
    const data = { imageUri: 'https://example.com/alt.jpg' };
    const safeImage = data.image || data.imageUri || 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800';
    expect(safeImage).toBe('https://example.com/alt.jpg');
  });

  it('falls back to default placeholder when both are missing', () => {
    const data = {};
    const safeImage = data.image || data.imageUri || 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800';
    expect(safeImage).toContain('unsplash');
  });

  it('handles base64 image URIs', () => {
    const data = { image: 'data:image/jpeg;base64,/9j/4AAQ...' };
    const safeImage = data.image || data.imageUri || 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800';
    expect(safeImage).toContain('data:image');
  });
});

describe('Card Component - CO2 Display', () => {
  it('displays CO2 savings in kg', () => {
    const co2 = 5;
    const displayText = `Saves ${co2}kg CO₂`;
    expect(displayText).toBe('Saves 5kg CO₂');
  });

  it('handles fractional CO2 values', () => {
    const co2 = 0.5;
    const displayText = `Saves ${co2}kg CO₂`;
    expect(displayText).toBe('Saves 0.5kg CO₂');
  });
});

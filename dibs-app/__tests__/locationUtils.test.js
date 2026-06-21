/**
 * @fileoverview Tests for locationUtils module.
 * Covers Haversine distance calculation, pincode-to-coordinate mapping,
 * and edge cases for missing or partial data.
 */
import { getPincodeCoords, getDistanceKm, PINCODE_COORDS } from '../utils/locationUtils';

describe('locationUtils - getPincodeCoords', () => {
  it('returns exact coordinates for a known pincode', () => {
    const coords = getPincodeCoords('490020');
    expect(coords).toEqual([21.2167, 81.4167]);
  });

  it('falls back to prefix-3 match for an unknown pincode in a known zone', () => {
    // 490xxx should match any 490-prefixed pincode
    const coords = getPincodeCoords('490999');
    expect(coords[0]).toBeCloseTo(21, 0);
    expect(coords[1]).toBeCloseTo(81, 0);
  });

  it('returns default fallback for a completely unknown pincode', () => {
    const coords = getPincodeCoords('999999');
    expect(coords).toEqual([22.5, 78.5]);
  });

  it('returns default fallback for null pincode', () => {
    const coords = getPincodeCoords(null);
    expect(coords).toEqual([22.5, 78.5]);
  });

  it('returns default fallback for undefined pincode', () => {
    const coords = getPincodeCoords(undefined);
    expect(coords).toEqual([22.5, 78.5]);
  });

  it('handles numeric pincode input', () => {
    const coords = getPincodeCoords(490020);
    expect(coords).toEqual([21.2167, 81.4167]);
  });

  it('handles pincodes with leading/trailing whitespace', () => {
    const coords = getPincodeCoords('  490020  ');
    expect(coords).toEqual([21.2167, 81.4167]);
  });

  it('contains all major Indian cities', () => {
    expect(PINCODE_COORDS['560001']).toBeDefined(); // Bangalore
    expect(PINCODE_COORDS['400001']).toBeDefined(); // Mumbai
    expect(PINCODE_COORDS['110001']).toBeDefined(); // Delhi
    expect(PINCODE_COORDS['700001']).toBeDefined(); // Kolkata
    expect(PINCODE_COORDS['600001']).toBeDefined(); // Chennai
  });
});

describe('locationUtils - getDistanceKm', () => {
  it('returns 0 for same coordinates', () => {
    const dist = getDistanceKm(28.6, 77.2, 28.6, 77.2);
    expect(dist).toBe(0);
  });

  it('calculates correct distance between Delhi and Mumbai (~1150km)', () => {
    // Delhi: 28.6328, 77.2197  Mumbai: 18.9388, 72.8354
    const dist = getDistanceKm(28.6328, 77.2197, 18.9388, 72.8354);
    expect(dist).toBeGreaterThan(1100);
    expect(dist).toBeLessThan(1200);
  });

  it('calculates short distances correctly', () => {
    // Two points ~1km apart
    const dist = getDistanceKm(28.6328, 77.2197, 28.6418, 77.2197);
    expect(dist).toBeGreaterThan(0.5);
    expect(dist).toBeLessThan(2);
  });

  it('is symmetric (a->b == b->a)', () => {
    const d1 = getDistanceKm(28.6, 77.2, 18.9, 72.8);
    const d2 = getDistanceKm(18.9, 72.8, 28.6, 77.2);
    expect(d1).toBeCloseTo(d2, 5);
  });

  it('returns positive values for any two distinct points', () => {
    const dist = getDistanceKm(0, 0, 1, 1);
    expect(dist).toBeGreaterThan(0);
  });
});

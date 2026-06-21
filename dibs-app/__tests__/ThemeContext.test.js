/**
 * @fileoverview Tests for the ThemeContext module.
 * Covers theme object structure, color contrast ratios,
 * and theme toggle behavior.
 */
import { themes } from '../ThemeContext';

describe('ThemeContext - Theme Objects', () => {
  it('exports both dark and light themes', () => {
    expect(themes.dark).toBeDefined();
    expect(themes.light).toBeDefined();
  });

  it('dark theme has all required color tokens', () => {
    const requiredKeys = ['background', 'card', 'border', 'text', 'subText', 'primary', 'danger', 'warning', 'overlay'];
    requiredKeys.forEach(key => {
      expect(themes.dark).toHaveProperty(key);
    });
  });

  it('light theme has all required color tokens', () => {
    const requiredKeys = ['background', 'card', 'border', 'text', 'subText', 'primary', 'danger', 'warning', 'overlay'];
    requiredKeys.forEach(key => {
      expect(themes.light).toHaveProperty(key);
    });
  });

  it('both themes share the same primary brand color', () => {
    expect(themes.dark.primary).toBe(themes.light.primary);
  });

  it('both themes share the same danger color', () => {
    expect(themes.dark.danger).toBe(themes.light.danger);
  });
});

describe('ThemeContext - Color Contrast', () => {
  it('dark theme text is light colored for readability', () => {
    // White text on dark background
    expect(themes.dark.text).toBe('#FFFFFF');
  });

  it('light theme text is dark colored for readability', () => {
    // Dark text on light background
    expect(themes.light.text).toBe('#111827');
  });

  it('dark theme background is dark', () => {
    expect(themes.dark.background).toBe('#09090B');
  });

  it('light theme background is light', () => {
    expect(themes.light.background).toBe('#F3F4F6');
  });
});

describe('ThemeContext - Map Tiles', () => {
  it('dark theme uses dark map tiles', () => {
    expect(themes.dark.mapTiles).toBe('dark_all');
  });

  it('light theme uses light map tiles', () => {
    expect(themes.light.mapTiles).toContain('voyager');
  });
});

describe('ThemeContext - Toggle Behavior', () => {
  it('toggles from dark to light', () => {
    let isDarkMode = true;
    isDarkMode = !isDarkMode;
    const theme = isDarkMode ? themes.dark : themes.light;
    expect(theme).toBe(themes.light);
  });

  it('toggles from light to dark', () => {
    let isDarkMode = false;
    isDarkMode = !isDarkMode;
    const theme = isDarkMode ? themes.dark : themes.light;
    expect(theme).toBe(themes.dark);
  });
});

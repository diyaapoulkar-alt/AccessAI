// Color Contrast calculation utilities adhering to WCAG 2.1 specifications

export function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function calculateContrastRatio(hex1, hex2) {
  try {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const ratio = (brightest + 0.05) / (darkest + 0.05);
    return Math.round(ratio * 10) / 10;
  } catch (e) {
    return 4.5;
  }
}

export function getWCAGRating(ratio, fontSize = 'small') {
  if (fontSize === 'large') {
    if (ratio >= 4.5) return { rating: 'AAA', status: 'pass', color: 'emerald' };
    if (ratio >= 3.0) return { rating: 'AA', status: 'pass', color: 'blue' };
    return { rating: 'FAIL', status: 'fail', color: 'rose' };
  } else {
    if (ratio >= 7.0) return { rating: 'AAA', status: 'pass', color: 'emerald' };
    if (ratio >= 4.5) return { rating: 'AA', status: 'pass', color: 'blue' };
    return { rating: 'FAIL', status: 'fail', color: 'rose' };
  }
}

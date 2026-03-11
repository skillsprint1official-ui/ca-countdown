// Vercel Serverless Function — returns wallpaper as SVG image
// MacroDroid HTTP GET → this URL → saves as image file

export default function handler(req, res) {
  const START = new Date('2025-03-11'); START.setHours(0,0,0,0);
  const EXAM  = new Date('2026-05-14'); EXAM.setHours(0,0,0,0);
  const TODAY = new Date(); TODAY.setHours(0,0,0,0);

  const MS = 86400000;
  const daysLeft = Math.max(0, Math.round((EXAM - TODAY) / MS));
  const total    = Math.round((EXAM - START) / MS);
  const gone     = Math.min(total, Math.max(0, Math.round((TODAY - START) / MS)));
  const pct      = Math.round((gone / total) * 100);

  const DAYS  = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const MONTHS= ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dateStr = DAYS[TODAY.getDay()] + ', ' + String(TODAY.getDate()).padStart(2,'0') + ' ' + MONTHS[TODAY.getMonth()];

  function getStatus(d) {
    if(d<=0)  return 'EXAM DAY. JAI HO!';
    if(d<=3)  return 'LAST FEW DAYS. ALL IN.';
    if(d<=7)  return 'FINAL WEEK. LOCK IN.';
    if(d<=14) return 'TWO WEEKS. NO BREAKS.';
    if(d<=30) return 'LAST MONTH. GRIND.';
    if(d<=60) return 'GRIND SEASON.';
    if(d<=90) return 'BUILD THE HABIT NOW.';
    return 'EARLY START = BIG LEAD.';
  }

  const numColor = daysLeft<=7 ? '#e05555' : daysLeft<=30 ? '#e0a030' : '#c8a96e';

  // Build circles SVG elements
  // 1080x2340 canvas, circles grid
  const dotR = 17, gap = 13, cols = 16;
  const gridW = cols * (dotR*2 + gap) - gap;
  const gridStartX = (1080 - gridW) / 2 + dotR;
  let circles = '';
  let cx = gridStartX, cy = 1340;
  for(let i = 0; i < total; i++) {
    if(i > 0 && i % cols === 0) { cy += dotR*2 + gap; cx = gridStartX; }
    const color = i < gone ? '#c8a96e' : i === gone ? '#ffffff' : '#191919';
    const glow  = i === gone ? `filter="url(#glow)"` : '';
    circles += `<circle cx="${cx}" cy="${cy}" r="${dotR}" fill="${color}" ${glow}/>`;
    cx += dotR*2 + gap;
  }

  const lastCircleY = cy;
  const barY  = lastCircleY + 80;
  const barW  = 580;
  const barX  = (1080 - barW) / 2;
  const fillW = Math.round(barW * pct / 100);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="2340" viewBox="0 0 1080 2340" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="numglow">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="2340" fill="#000000"/>

  <!-- Date -->
  <text x="540" y="200" 
    font-family="'Arial Black', Arial, sans-serif" 
    font-size="60" font-weight="900"
    fill="#1e1e1e" text-anchor="middle" letter-spacing="10">
    ${dateStr}
  </text>

  <!-- DAYS REMAINING label -->
  <text x="540" y="560"
    font-family="'Courier New', monospace"
    font-size="34" fill="#1c1c1c" text-anchor="middle" letter-spacing="12">
    DAYS REMAINING
  </text>

  <!-- Big Number -->
  <text x="540" y="1080"
    font-family="'Arial Black', Arial, sans-serif"
    font-size="680" font-weight="900"
    fill="${numColor}" text-anchor="middle"
    filter="url(#numglow)"
    letter-spacing="-10">
    ${daysLeft}
  </text>

  <!-- Status -->
  <text x="540" y="1168"
    font-family="'Arial Black', Arial, sans-serif"
    font-size="46" font-weight="900"
    fill="#222222" text-anchor="middle" letter-spacing="6">
    ${getStatus(daysLeft)}
  </text>

  <!-- Divider -->
  <line x1="220" y1="1228" x2="860" y2="1228" stroke="#0e0e0e" stroke-width="1"/>

  <!-- Circles -->
  ${circles}

  <!-- Progress bar bg -->
  <rect x="${barX}" y="${barY}" width="${barW}" height="4" rx="2" fill="#111111"/>
  <!-- Progress bar fill -->
  <rect x="${barX}" y="${barY}" width="${fillW}" height="4" rx="2" fill="#c8a96e"/>

  <!-- Progress label -->
  <text x="540" y="${barY + 48}"
    font-family="'Courier New', monospace"
    font-size="26" fill="#1a1a1a" text-anchor="middle" letter-spacing="4">
    ${pct}% PREP DONE
  </text>

  <!-- Exam tag -->
  <text x="540" y="2240"
    font-family="'Courier New', monospace"
    font-size="28" fill="#111111" text-anchor="middle" letter-spacing="6">
    TARGET · MAY 14, 2026
  </text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Content-Disposition', 'attachment; filename="ca-wallpaper.png"');
  res.status(200).send(svg);
}

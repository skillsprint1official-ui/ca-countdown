import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler(req) {
  const START = new Date('2025-03-11'); START.setHours(0,0,0,0);
  const EXAM  = new Date('2026-05-14'); EXAM.setHours(0,0,0,0);
  const TODAY = new Date(); TODAY.setHours(0,0,0,0);

  const MS = 86400000;
  const daysLeft = Math.max(0, Math.round((EXAM - TODAY) / MS));
  const total    = Math.round((EXAM - START) / MS);
  const gone     = Math.min(total, Math.max(0, Math.round((TODAY - START) / MS)));
  const pct      = Math.round((gone / total) * 100);

  const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
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

  const cols = 20;
  const circles = Array.from({length: total}, (_, i) => ({
    color: i < gone ? '#c8a96e' : i === gone ? '#ffffff' : '#1e1e1e',
    isToday: i === gone
  }));
  const rows = [];
  for(let i = 0; i < circles.length; i += cols) rows.push(circles.slice(i, i+cols));

  return new ImageResponse(
    <div style={{
      width:'1080px', height:'2340px', background:'#000',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'space-between', padding:'120px 40px 100px',
    }}>
      <div style={{fontSize:52,color:'#1e1e1e',letterSpacing:14,fontWeight:900}}>{dateStr}</div>

      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0px'}}>
        <div style={{fontSize:30,color:'#1a1a1a',letterSpacing:12,marginBottom:'16px'}}>DAYS REMAINING</div>
        <div style={{fontSize:580,color:numColor,lineHeight:0.85,fontWeight:900,letterSpacing:'-10px'}}>{daysLeft}</div>
        <div style={{fontSize:44,color:'#222',letterSpacing:8,marginTop:'24px',fontWeight:900}}>{getStatus(daysLeft)}</div>
      </div>

      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',width:'100%'}}>
        <div style={{fontSize:20,color:'#181818',letterSpacing:6,marginBottom:'8px'}}>● GONE  ◉ TODAY  ○ LEFT</div>
        {rows.map((row,ri) => (
          <div key={ri} style={{display:'flex',flexDirection:'row',gap:'8px'}}>
            {row.map((c,ci) => (
              <div key={ci} style={{
                width:'28px',height:'28px',borderRadius:'50%',
                background:c.color,
                boxShadow:c.isToday?'0 0 14px #fff':'none'
              }}/>
            ))}
          </div>
        ))}
      </div>

      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',width:'100%'}}>
        <div style={{width:'600px',height:'4px',background:'#111',borderRadius:'2px',overflow:'hidden'}}>
          <div style={{width:`${pct}%`,height:'100%',background:'#c8a96e'}}/>
        </div>
        <div style={{fontSize:24,color:'#1a1a1a',letterSpacing:4}}>{pct}% PREP DONE</div>
        <div style={{fontSize:26,color:'#111',letterSpacing:6,marginTop:'8px'}}>TARGET · MAY 14, 2026</div>
      </div>
    </div>,
    {
      width:1080, height:2340,
      headers:{
        'Content-Disposition':'attachment; filename="ca-wallpaper.png"',
        'Cache-Control':'no-cache,no-store,must-revalidate',
      }
    }
  );
}

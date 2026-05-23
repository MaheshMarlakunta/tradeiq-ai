import { useState, useEffect, useRef, createContext, useContext } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#04070F", surface: "#0A1020", surfaceAlt: "#0F1929", card: "#111E32",
  border: "#1A2D4A", accent: "#00D4FF", accentGlow: "rgba(0,212,255,0.12)",
  gold: "#F5A623", green: "#00E676", red: "#FF4757", purple: "#A855F7",
  wa: "#075E54", waDark: "#054640", waBubble: "#1F2C34", waGreen: "#25D366",
  text: "#E8EDF5", textMuted: "#5A7399", textDim: "#2D4060",
};

const GS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.bg};color:${C.text};font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
  .mono{font-family:'IBM Plex Mono',monospace!important;}
  .hindi{font-family:'Noto Sans Devanagari','Plus Jakarta Sans',sans-serif!important;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:none;}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,212,255,.2)}50%{box-shadow:0 0 50px rgba(0,212,255,.5)}}
  @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
  @keyframes waPop{from{opacity:0;transform:scale(.92);}to{opacity:1;transform:scale(1);}}
  @keyframes modalIn{from{opacity:0;transform:scale(.95);}to{opacity:1;transform:scale(1);}}
  @keyframes typing{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
`;

// ─── LANGUAGE CONTEXT ─────────────────────────────────────────────────────────
const LangCtx = createContext({ lang: "en", t: x => x });
const useLang = () => useContext(LangCtx);

const TRANS = {
  en: {
    appName: "TradeIQ AI", tagline: "AI Trade Journal", launchApp: "🚀 Launch App",
    upgradeBtn: "⚡ Upgrade to Pro", home: "Home", pro: "PRO",
    journal: "Journal", dashboard: "Dashboard", aiCoach: "AI Coach", waLogger: "WhatsApp Logger",
    logTrade: "+ Log Trade", importBroker: "🔗 Import Broker",
    stockSymbol: "Stock Symbol *", direction: "Direction *", segment: "Segment",
    entryPrice: "Entry Price ₹ *", exitPrice: "Exit Price ₹ *", quantity: "Quantity *",
    strategy: "Strategy", emotion: "Emotion", date: "Date", notes: "Notes",
    saveTrade: "Save Trade", cancel: "Cancel", estPnl: "Est. P&L:",
    search: "Search stock or strategy...", totalTrades: "trades",
    netPnl: "Net P&L", winRate: "Win Rate", profitFactor: "Profit Factor",
    avgWin: "Avg Win", avgLoss: "Avg Loss", totalTradesStat: "Total Trades",
    equityCurve: "Equity Curve", pnlByStrategy: "P&L by Strategy",
    winLossRatio: "Win / Loss Ratio", emotionImpact: "Emotion Impact",
    tradePnl: "Trade-by-Trade P&L", wins: "Wins", losses: "Losses",
    fullAnalysis: "🧠 Full AI Analysis", askAnything: "Ask anything about your trading performance",
    askAI: "Ask AI →", analyzing: "Analyzing your trades...", aiCoaching: "AI Performance Coach",
    poweredBy: "Powered by Claude AI · Analyzing your",
    waTitle: "WhatsApp Trade Logger", waSubtitle: "Type a trade naturally — AI parses it instantly",
    waPlaceholder: "e.g. Bought 100 Reliance at 2820, sold at 2847 today, breakout trade, felt confident",
    waHint: "💡 Just describe your trade like you'd tell a friend. AI does the rest.",
    waSend: "Send", waParsing: "Parsing your trade...", waLogged: "✅ Trade logged!",
    waWelcome: "👋 Welcome to WhatsApp Trade Logger!\n\nJust type your trade naturally:\n• \"Bought 100 Reliance at 2820, sold 2847\"\n• \"Shorted Infy 200 qty entry 1490 exit 1456\"\n• \"HDFC Bank 150 shares, 1615 buy 1628 sell\"\n\nAI will parse it and log it automatically. No forms needed! 🚀",
    waError: "❌ Could not parse trade. Please try again with more details.",
    quickPrompts: ["Why am I losing money?", "My best performing strategy?", "Emotion vs P&L impact?", "Best time to trade?", "Mistakes I keep repeating?", "Give me a 30-day plan"],
    profit: "PROFIT", loss: "LOSS", long: "LONG", short: "SHORT",
    delete: "✕", filter: "Filter", all: "ALL", win: "WIN",
    noTrades: "No trades yet. Log your first trade above!",
    connectBroker: "Connect your broker to auto-import trades",
    pnlChart: "P&L Trend",
  },
  hi: {
    appName: "TradeIQ AI", tagline: "AI ट्रेड जर्नल", launchApp: "🚀 ऐप खोलें",
    upgradeBtn: "⚡ Pro में अपग्रेड करें", home: "होम", pro: "PRO",
    journal: "जर्नल", dashboard: "डैशबोर्ड", aiCoach: "AI कोच", waLogger: "WhatsApp लॉगर",
    logTrade: "+ ट्रेड लॉग करें", importBroker: "🔗 ब्रोकर इम्पोर्ट",
    stockSymbol: "स्टॉक का नाम *", direction: "दिशा *", segment: "सेगमेंट",
    entryPrice: "खरीद मूल्य ₹ *", exitPrice: "बिक्री मूल्य ₹ *", quantity: "मात्रा *",
    strategy: "रणनीति", emotion: "भावना", date: "तारीख", notes: "नोट्स",
    saveTrade: "ट्रेड सेव करें", cancel: "रद्द करें", estPnl: "अनुमानित P&L:",
    search: "स्टॉक या रणनीति खोजें...", totalTrades: "ट्रेड",
    netPnl: "कुल लाभ/हानि", winRate: "जीत दर", profitFactor: "प्रॉफिट फैक्टर",
    avgWin: "औसत लाभ", avgLoss: "औसत हानि", totalTradesStat: "कुल ट्रेड",
    equityCurve: "इक्विटी कर्व", pnlByStrategy: "रणनीति अनुसार P&L",
    winLossRatio: "जीत / हार अनुपात", emotionImpact: "भावना का प्रभाव",
    tradePnl: "प्रत्येक ट्रेड का P&L", wins: "जीत", losses: "हार",
    fullAnalysis: "🧠 पूरा AI विश्लेषण", askAnything: "अपने ट्रेडिंग प्रदर्शन के बारे में कुछ भी पूछें",
    askAI: "AI से पूछें →", analyzing: "आपके ट्रेड का विश्लेषण हो रहा है...", aiCoaching: "AI प्रदर्शन कोच",
    poweredBy: "Claude AI द्वारा · आपके",
    waTitle: "WhatsApp ट्रेड लॉगर", waSubtitle: "सामान्य भाषा में ट्रेड लिखें — AI तुरंत पहचानेगा",
    waPlaceholder: "जैसे: 100 रिलायंस 2820 पर खरीदा, 2847 पर बेचा, ब्रेकआउट ट्रेड था",
    waHint: "💡 बस अपने ट्रेड को सामान्य भाषा में लिखें — हिंदी या English में। AI बाकी काम करेगा।",
    waSend: "भेजें", waParsing: "ट्रेड पहचाना जा रहा है...", waLogged: "✅ ट्रेड लॉग हो गया!",
    waWelcome: "👋 WhatsApp ट्रेड लॉगर में आपका स्वागत है!\n\nबस अपना ट्रेड सामान्य भाषा में लिखें:\n• \"100 रिलायंस 2820 पर खरीदा, 2847 पर बेचा\"\n• \"Infy 200 qty short किया 1490 से 1456 तक\"\n• \"HDFC Bank 150 शेयर, खरीद 1615 बिक्री 1628\"\n\nAI खुद पहचानेगा और जर्नल में जोड़ेगा। कोई फॉर्म नहीं! 🚀",
    waError: "❌ ट्रेड नहीं पहचाना जा सका। कृपया अधिक जानकारी के साथ दोबारा लिखें।",
    quickPrompts: ["मैं पैसे क्यों गँवा रहा हूँ?", "मेरी सबसे अच्छी रणनीति?", "भावना का P&L पर असर?", "ट्रेड करने का सबसे अच्छा समय?", "मेरी बार-बार की गलतियाँ?", "30 दिन का सुधार प्लान दो"],
    profit: "लाभ", loss: "हानि", long: "खरीद", short: "बिक्री",
    delete: "✕", filter: "फ़िल्टर", all: "सभी", win: "जीत",
    noTrades: "अभी तक कोई ट्रेड नहीं। पहला ट्रेड ऊपर लॉग करें!",
    connectBroker: "ट्रेड ऑटो-इम्पोर्ट के लिए ब्रोकर कनेक्ट करें",
    pnlChart: "P&L ट्रेंड",
  }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = n => Math.abs(n) >= 100000 ? `${(n/100000).toFixed(1)}L` : Math.abs(n) >= 1000 ? `${(n/1000).toFixed(1)}K` : String(Math.round(n));
const fmtFull = n => `${n >= 0 ? "+" : ""}₹${Math.abs(n).toLocaleString("en-IN")}`;
const calcPnL = t => { const e=parseFloat(t.entry),x=parseFloat(t.exit),q=parseInt(t.qty); if(!e||!x||!q) return null; return t.type==="LONG"?(x-e)*q:(e-x)*q; };
const now = () => new Date().toISOString().slice(0,10);

// ─── BASE UI ──────────────────────────────────────────────────────────────────
const Badge = ({children,color=C.accent,s={}}) => (
  <span style={{background:`${color}18`,color,border:`1px solid ${color}30`,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",fontFamily:"'IBM Plex Mono',monospace",whiteSpace:"nowrap",...s}}>{children}</span>
);
const Btn = ({children,onClick,variant="primary",size="md",disabled=false,style:sx={},full=false}) => {
  const [h,setH]=useState(false);
  const sz={sm:{padding:"7px 14px",fontSize:12},md:{padding:"11px 22px",fontSize:14},lg:{padding:"15px 34px",fontSize:16}}[size];
  const v={primary:{bg:C.accent,color:C.bg,border:"none"},outline:{bg:"transparent",color:C.accent,border:`1.5px solid ${C.accent}`},ghost:{bg:h?C.surfaceAlt:"transparent",color:C.textMuted,border:`1px solid ${C.border}`},danger:{bg:C.red,color:"#fff",border:"none"},gold:{bg:C.gold,color:C.bg,border:"none"},wa:{bg:C.waGreen,color:"#fff",border:"none"}}[variant];
  return <button onClick={disabled?undefined:onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{...sz,background:v.bg,color:v.color,border:v.border,borderRadius:10,cursor:disabled?"not-allowed":"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,opacity:disabled?.5:1,transition:"all .15s",width:full?"100%":"auto",transform:h&&!disabled?"translateY(-1px)":"none",...sx}}>{children}</button>;
};
const Input = ({label,type="text",value,onChange,placeholder,style:sx={}}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label && <label style={{fontSize:10,color:C.textMuted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"'IBM Plex Mono',monospace",...sx}}/>
  </div>
);
const Sel = ({label,value,onChange,options}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label && <label style={{fontSize:10,color:C.textMuted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace"}}>{options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}</select>
  </div>
);
const Card = ({children,style:sx={},glow=false}) => (
  <div style={{background:C.card,border:`1px solid ${glow?`${C.accent}50`:C.border}`,borderRadius:16,padding:20,boxShadow:glow?`0 0 40px ${C.accentGlow}`:"none",...sx}}>{children}</div>
);
const Modal = ({open,onClose,children,width=480}) => !open?null:(
  <div style={{position:"fixed",inset:0,background:"rgba(4,7,15,.9)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(8px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,padding:28,width:"100%",maxWidth:width,animation:"modalIn .2s ease",maxHeight:"90vh",overflowY:"auto"}}>{children}</div>
  </div>
);
const Spinner = ({size=20,color=C.accent}) => <div style={{width:size,height:size,border:`2px solid ${C.border}`,borderTop:`2px solid ${color}`,borderRadius:"50%",animation:"spin .8s linear infinite",flexShrink:0}}/>;

// ─── TICKER ───────────────────────────────────────────────────────────────────
const TICKS = [{s:"NIFTY 50",p:"24,635",c:"+0.82%"},{s:"SENSEX",p:"81,247",c:"+0.75%"},{s:"RELIANCE",p:"2,847",c:"+1.24%"},{s:"TCS",p:"3,542",c:"+0.87%"},{s:"HDFC BANK",p:"1,628",c:"-0.32%"},{s:"INFY",p:"1,456",c:"+2.15%"},{s:"SBIN",p:"782",c:"+1.89%"},{s:"COAL INDIA",p:"418",c:"-0.45%"},{s:"SUN PHARMA",p:"1,623",c:"+1.12%"},{s:"TATA STEEL",p:"152",c:"-1.23%"},{s:"CEAT",p:"3,124",c:"+2.34%"},{s:"WIPRO",p:"462",c:"+0.91%"}];
const Ticker = () => {
  const [ticks, setTicks] = useState(TICKS);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/stocks");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.length) setTicks(data.map(d => ({
          s: d.s, p: d.p, c: d.c, live: true
        })));
      } catch {}
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const items = [...ticks, ...ticks];
  return (
    <div style={{background:C.surfaceAlt,borderBottom:`1px solid ${C.border}`,overflow:"hidden",padding:"6px 0"}}>
      <div style={{display:"flex",animation:"ticker 35s linear infinite",whiteSpace:"nowrap"}}>
        {items.map((t,i)=>(
          <span key={i} style={{padding:"0 24px",display:"inline-flex",gap:8,alignItems:"center",fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>
            <span style={{color:C.textMuted}}>{t.s}</span>
            <span style={{color:C.text}}>{t.p}</span>
            <span style={{color:t.c?.startsWith("+")?C.green:C.red}}>{t.c}</span>
            {t.live && <span style={{color:C.green,fontSize:8}}>●</span>}
            <span style={{color:C.textDim}}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
};
const Nav = ({page,setPage,onUpgrade,isPro,lang,setLang}) => {
  const {t} = useLang();
  return (
    <nav style={{position:"sticky",top:0,zIndex:200,background:`${C.bg}F2`,backdropFilter:"blur(24px)",borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",maxWidth:1280,margin:"0 auto",gap:12,flexWrap:"wrap"}}>
        <div onClick={()=>setPage("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.accent},${C.purple})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#fff",fontSize:15}}>T</div>
          <span style={{fontSize:18,fontWeight:800,letterSpacing:-.5}}>{t("appName")}<span style={{color:C.accent}}>·AI</span></span>
          {isPro && <Badge color={C.gold}>{t("pro")}</Badge>}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {/* Lang Toggle */}
          <button onClick={()=>setLang(l=>l==="en"?"hi":"en")} style={{background:lang==="hi"?`${C.gold}18`:C.surfaceAlt,border:`1px solid ${lang==="hi"?C.gold:C.border}`,borderRadius:8,padding:"7px 14px",cursor:"pointer",display:"flex",gap:6,alignItems:"center",color:lang==="hi"?C.gold:C.textMuted,fontWeight:700,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .2s"}}>
            <span style={{fontSize:14}}>🇮🇳</span>
            {lang==="hi"?"हिंदी ON":"हिंदी"}
          </button>
          {!isPro && <Btn size="sm" variant="gold" onClick={onUpgrade}>{t("upgradeBtn")}</Btn>}
          <Btn size="sm" variant={page==="app"?"primary":"outline"} onClick={()=>setPage("app")}>{page==="app"?t("dashboard"):t("launchApp")}</Btn>
          {page==="app" && <Btn size="sm" variant="ghost" onClick={()=>setPage("home")}>{t("home")}</Btn>}
        </div>
      </div>
    </nav>
  );
};

// ─── WHATSAPP TRADE LOGGER ────────────────────────────────────────────────────
const WA_QUICK = [
  "Bought 100 Reliance at 2820, sold at 2847, breakout trade",
  "Shorted Infy 200 qty, entry 1490 exit 1456, momentum",
  "HDFC Bank 150 shares, buy 1615 sell 1628, support level",
  "100 रिलायंस 2820 पर खरीदा, 2847 पर बेचा",
  "SBIN 500 qty long, 790 entry 782 exit, FOMO trade lost",
  "Coal India short 800 qty entry 425 exit 418, resistance worked",
];

const WaLogger = ({onTradeLogged, lang}) => {
  const {t} = useLang();
  const [msgs, setMsgs] = useState([{id:0,from:"ai",text:t("waWelcome"),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),type:"text"}]);
  const [input, setInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [lastTrade, setLastTrade] = useState(null);
  const bottomRef = useRef();

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const addMsg = (from,text,type="text",trade=null) => {
    const m = {id:Date.now(),from,text,type,trade,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})};
    setMsgs(prev=>[...prev,m]);
    return m;
  };

  const parseTrade = async (userMsg) => {
    if(!userMsg.trim()) return;
    addMsg("user",userMsg);
    setInput("");
    setParsing(true);

    try {
      const sysPrompt = lang==="hi"
        ? `आप एक ट्रेड पार्सर हैं। उपयोगकर्ता हिंदी या अंग्रेजी में ट्रेड का वर्णन करेगा। आपको सिर्फ JSON में जवाब देना है।
JSON format: {"stock":"SYMBOL","type":"LONG या SHORT","entry":"price","exit":"price","qty":"quantity","strategy":"Breakout/Pullback/Momentum/Support-Resistance/News Based/Other","emotion":"Confident/FOMO/Anxious/Revenge/Disciplined/Greedy/Patient","notes":"short note in Hindi","parsed":true}
अगर समझ न आए तो: {"parsed":false}
सिर्फ JSON, कुछ और नहीं।`
        : `You are a trade parser. Extract trade details from natural language (English or Hindi) and respond ONLY with JSON.
Format: {"stock":"NSE_SYMBOL_CAPS","type":"LONG or SHORT","entry":"price","exit":"price","qty":"quantity","strategy":"Breakout/Pullback/Momentum/Support/Resistance/News Based/Other","emotion":"Confident/FOMO/Anxious/Revenge/Disciplined/Greedy/Patient","notes":"brief note","parsed":true}
If you cannot parse: {"parsed":false}
Respond ONLY with JSON. No explanation.`;

      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:300,
          system: sysPrompt,
          messages:[{role:"user",content:userMsg}]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text?.trim() || "{}";
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);

      if(parsed.parsed !== false && parsed.stock && parsed.entry && parsed.exit) {
        const trade = { ...parsed, id:Date.now(), date:now(), pnl: calcPnL(parsed), segment:"EQ" };
        setLastTrade(trade);
        onTradeLogged(trade);
        const confirmText = lang==="hi"
          ? `✅ ट्रेड लॉग हो गया!\n\nस्टॉक: ${trade.stock}\nदिशा: ${trade.type==="LONG"?"खरीद":"बिक्री"}\nखरीद: ₹${trade.entry} → बिक्री: ₹${trade.exit}\nमात्रा: ${trade.qty}\nP&L: ${fmtFull(trade.pnl||0)}`
          : `✅ Trade logged!\n\n${trade.stock} ${trade.type}\nEntry ₹${trade.entry} → Exit ₹${trade.exit}\nQty: ${trade.qty} · Strategy: ${trade.strategy}\nP&L: ${fmtFull(trade.pnl||0)}`;
        setTimeout(()=>addMsg("ai",confirmText,"trade",trade),400);
      } else {
        setTimeout(()=>addMsg("ai",lang==="hi"?"❌ समझ नहीं आया। कृपया इस तरह लिखें:\n\"100 रिलायंस 2820 पर खरीदा 2847 पर बेचा\"":t("waError")),400);
      }
    } catch {
      setTimeout(()=>addMsg("ai",lang==="hi"?"⚠️ कनेक्शन त्रुटि। दोबारा कोशिश करें।":"⚠️ Connection error. Please try again."),400);
    }
    setParsing(false);
  };

  const MsgBubble = ({msg}) => {
    const isUser = msg.from==="user";
    const isPnlPositive = msg.trade && (msg.trade.pnl||0)>=0;
    return (
      <div style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start",marginBottom:10,animation:"waPop .25s ease"}}>
        {!isUser && <div style={{width:30,height:30,background:`linear-gradient(135deg,${C.waGreen},${C.accent})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginRight:8,marginTop:2}}>🤖</div>}
        <div style={{maxWidth:"72%"}}>
          <div style={{
            background: isUser?`linear-gradient(135deg,${C.accent}DD,${C.purple}CC)`:
              msg.type==="trade"?`${isPnlPositive?C.green:C.red}15`:C.waBubble,
            color: isUser?C.bg:C.text,
            border: msg.type==="trade"?`1px solid ${isPnlPositive?C.green:C.red}40`:`1px solid ${isUser?"transparent":C.border}`,
            borderRadius: isUser?"16px 16px 4px 16px":"16px 16px 16px 4px",
            padding:"10px 14px",
            fontSize:13,
            lineHeight:1.65,
            whiteSpace:"pre-wrap",
            boxShadow:"0 2px 8px rgba(0,0,0,.3)",
            fontFamily: lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit",
          }}>
            {msg.text}
            {msg.type==="trade" && msg.trade && (
              <div style={{marginTop:10,padding:"8px 10px",background:"rgba(0,0,0,.25)",borderRadius:8,display:"flex",gap:16,flexWrap:"wrap"}}>
                <span className="mono" style={{fontSize:12,fontWeight:700,color:isPnlPositive?C.green:C.red}}>{fmtFull(msg.trade.pnl||0)}</span>
                <span style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>→ Journal ✓</span>
              </div>
            )}
          </div>
          <div style={{fontSize:10,color:C.textDim,textAlign:isUser?"right":"left",marginTop:3,paddingRight:4}}>{msg.time} {isUser?"✓✓":""}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 220px)",minHeight:520,background:C.bg,borderRadius:20,border:`1px solid ${C.border}`,overflow:"hidden"}}>
      {/* WA Header */}
      <div style={{background:`linear-gradient(135deg,${C.wa},${C.waDark})`,padding:"14px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid rgba(255,255,255,.08)`}}>
        <div style={{width:42,height:42,background:`linear-gradient(135deg,${C.waGreen},${C.accent})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🤖</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:15,fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit"}}>{t("waTitle")}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginTop:1,fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit"}}>{t("waSubtitle")}</div>
        </div>
        <div style={{display:"flex",gap:4}}>
          <Badge color={C.waGreen}>● LIVE</Badge>
        </div>
      </div>

      {/* Chat area */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px",background:`repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.005) 10px,rgba(255,255,255,.005) 11px)`}}>
        {msgs.map(m=><MsgBubble key={m.id} msg={m}/>)}
        {parsing && (
          <div style={{display:"flex",justifyContent:"flex-start",marginBottom:10}}>
            <div style={{width:30,height:30,background:`linear-gradient(135deg,${C.waGreen},${C.accent})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:8}}>🤖</div>
            <div style={{background:C.waBubble,border:`1px solid ${C.border}`,borderRadius:"16px 16px 16px 4px",padding:"12px 16px",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:7,height:7,background:C.waGreen,borderRadius:"50%",animation:`pulse 1.2s ${i*0.3}s infinite`}}/>)}
              <span style={{fontSize:12,color:C.textMuted,marginLeft:6,fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit"}}>{t("waParsing")}</span>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Quick trade chips */}
      <div style={{padding:"8px 16px",overflowX:"auto",display:"flex",gap:8,background:C.waBubble,borderTop:`1px solid ${C.border}`}}>
        <div style={{display:"flex",gap:8,minWidth:"max-content"}}>
          {WA_QUICK.slice(0,4).map((q,i)=>(
            <button key={i} onClick={()=>parseTrade(q)} style={{background:"rgba(37,211,102,.12)",border:"1px solid rgba(37,211,102,.3)",borderRadius:100,padding:"5px 12px",color:C.waGreen,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600}}>{q.length>30?q.slice(0,30)+"...":q}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{padding:"12px 16px",background:C.surfaceAlt,borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"flex-end"}}>
        <div style={{flex:1,background:C.card,borderRadius:24,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"8px 16px",gap:8}}>
          <span style={{fontSize:16}}>📊</span>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&!parsing&&input.trim()&&parseTrade(input)}
            placeholder={t("waPlaceholder")} disabled={parsing}
            style={{flex:1,background:"transparent",border:"none",color:C.text,fontSize:13,outline:"none",fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"'IBM Plex Mono',monospace"}}/>
        </div>
        <button onClick={()=>!parsing&&input.trim()&&parseTrade(input)} disabled={parsing||!input.trim()}
          style={{width:46,height:46,borderRadius:"50%",background:parsing||!input.trim()?C.textDim:C.waGreen,border:"none",cursor:parsing||!input.trim()?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,transition:"all .2s"}}>
          {parsing?<Spinner size={18} color="#fff"/>:"➤"}
        </button>
      </div>
      <div style={{padding:"6px 16px 10px",textAlign:"center",fontSize:11,color:C.textDim,background:C.surfaceAlt,fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit"}}>{t("waHint")}</div>
    </div>
  );
};

// ─── AI COACH ─────────────────────────────────────────────────────────────────
const AICoach = ({trades,isPro,onUpgrade,lang}) => {
  const {t} = useLang();
  const [resp,setResp] = useState("");
  const [load,setLoad] = useState(false);
  const [q,setQ] = useState("");

  const ask = async (prompt) => {
    if(!isPro && trades.length>3){onUpgrade();return;}
    setLoad(true); setResp("");
    try {
      const ctx = trades.map(t=>`${t.date}|${t.stock}|${t.type}|Entry:${t.entry}|Exit:${t.exit}|Qty:${t.qty}|Strat:${t.strategy}|Emotion:${t.emotion}|PnL:₹${t.pnl}`).join("\n");
      const sys = lang==="hi"
        ? `आप TradeIQ AI हैं — भारत का #1 AI ट्रेडिंग परफॉर्मेंस कोच जो NSE/BSE में विशेषज्ञ है।
ट्रेडर के जर्नल का विश्लेषण करें और हिंदी में तीखी, सटीक, कार्यायोग्य सलाह दें।
₹ का उपयोग करें। असली ट्रेड डेटा का हवाला दें। स्पष्ट और संक्षिप्त रहें। अधिकतम 300 शब्द।
ट्रेड डेटा:\n${ctx}`
        : `You are TradeIQ AI — India's #1 AI trading performance coach for NSE/BSE markets.
Analyze journals, give sharp actionable insights in English. Use ₹, reference actual trade data. Max 300 words.
Trade Data:\n${ctx}`;
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:prompt}]})});
      const d = await res.json();
      setResp(d.content?.[0]?.text||"Error");
    } catch { setResp("Connection error. Please try again."); }
    setLoad(false);
  };

  const fullAnalysis = () => ask(lang==="hi"
    ? "मेरे सभी ट्रेड का विश्लेषण करो: 1) मेरी सबसे बड़ी कमज़ोरी 2) सबसे अच्छी और बुरी रणनीति 3) भावना और P&L का संबंध 4) ट्रेड करने का सबसे अच्छा समय 5) तुरंत 3 सुधार। हिंदी में जवाब दो।"
    : "Complete performance review: 1) Biggest behavioral weakness with examples 2) Best/worst strategies with numbers 3) Emotion patterns causing losses 4) Best time/day patterns 5) Top 3 immediate actions. Be brutally honest and specific.");

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit"}}>{t("aiCoaching")}</h2>
          <p style={{fontSize:12,color:C.textMuted,marginTop:2,fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit"}}>{t("poweredBy")} {trades.length} {lang==="hi"?"ट्रेड":"trades"}</p>
        </div>
        <Btn onClick={fullAnalysis} style={{animation:"glow 2.5s infinite"}}>{t("fullAnalysis")}</Btn>
      </div>

      {!isPro && (
        <div style={{background:`${C.gold}12`,border:`1px solid ${C.gold}35`,borderRadius:12,padding:16,marginBottom:20,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:22}}>⚡</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,color:C.gold,fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit"}}>{lang==="hi"?"असीमित AI कोचिंग के लिए Pro में अपग्रेड करें":"Upgrade to Pro for unlimited AI coaching"}</div>
            <div style={{fontSize:12,color:C.textMuted,fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit"}}>{lang==="hi"?"Free में 3 queries/हफ्ता। Pro में असीमित।":"Free: 3 queries/week. Pro: unlimited, deeper analysis."}</div>
          </div>
          <Btn size="sm" variant="gold" onClick={onUpgrade}>{lang==="hi"?"अभी अपग्रेड करें →":"Upgrade →"}</Btn>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10,marginBottom:20}}>
        {t("quickPrompts").map((prompt,i)=>(
          <button key={i} onClick={()=>ask(prompt)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",color:C.textMuted,fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"'Plus Jakarta Sans',sans-serif",transition:"all .2s",display:"flex",gap:8,alignItems:"flex-start"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.text;e.currentTarget.style.background=`${C.accent}08`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;e.currentTarget.style.background=C.card;}}>
            <span style={{color:C.accent,flexShrink:0}}>→</span>{prompt}
          </button>
        ))}
      </div>

      <Card style={{marginBottom:20}}>
        <div style={{display:"flex",gap:10}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&q.trim()&&(ask(q),setQ(""))}
            placeholder={t("askAnything")}
            style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"'IBM Plex Mono',monospace"}}/>
          <Btn onClick={()=>{if(q.trim()){ask(q);setQ("");}}} disabled={!q.trim()}>{t("askAI")}</Btn>
        </div>
      </Card>

      {(load||resp) && (
        <Card glow>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
            <div style={{width:36,height:36,background:`linear-gradient(135deg,${C.accent},${C.purple})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🤖</div>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>TradeIQ AI Coach {lang==="hi"&&"(हिंदी)"}</div>
              <div style={{fontSize:11,color:C.textMuted}}>Claude Sonnet · {trades.length} {lang==="hi"?"ट्रेड विश्लेषण":"trades analyzed"}</div>
            </div>
            {load && <Spinner/>}
          </div>
          {load
            ? <div style={{display:"flex",gap:6,alignItems:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,background:C.accent,borderRadius:"50%",animation:`pulse 1.2s ${i*.2}s infinite`}}/>)}<span style={{color:C.textMuted,fontSize:13,marginLeft:8,fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit"}}>{t("analyzing")}</span></div>
            : <div style={{color:C.text,fontSize:13,lineHeight:1.9,whiteSpace:"pre-wrap",fontFamily:lang==="hi"?"'Noto Sans Devanagari',sans-serif":"'IBM Plex Mono',monospace"}}>{resp}</div>
          }
        </Card>
      )}
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({trades,lang}) => {
  const {t} = useLang();
  const wins=trades.filter(x=>x.pnl>0), losses=trades.filter(x=>x.pnl<0);
  const totalPnl=trades.reduce((a,x)=>a+(x.pnl||0),0);
  const winRate=trades.length?Math.round(wins.length/trades.length*100):0;
  const avgWin=wins.length?Math.round(wins.reduce((a,x)=>a+x.pnl,0)/wins.length):0;
  const avgLoss=losses.length?Math.round(losses.reduce((a,x)=>a+x.pnl,0)/losses.length):0;
  const pf=losses.length&&avgLoss?Math.abs((avgWin*wins.length)/(avgLoss*losses.length)).toFixed(2):"∞";
  const eqData=trades.slice().reverse().reduce((acc,x,i)=>{acc.push({name:x.stock.slice(0,4),equity:(acc[i-1]?.equity||0)+(x.pnl||0),pnl:x.pnl||0});return acc;},[]);
  const stratData=["Breakout","Pullback","Momentum","Support/Resistance","News Based","Other","Positional","Intraday","Gap Up/Down"].map(s=>({name:s,pnl:trades.filter(x=>x.strategy===s).reduce((a,x)=>a+(x.pnl||0),0),count:trades.filter(x=>x.strategy===s).length})).filter(x=>x.count>0).sort((a,b)=>b.pnl-a.pnl);
  const emoData=["Confident","Disciplined","Patient","FOMO","Anxious","Revenge","Greedy","Bored"].map(e=>({name:e,pnl:trades.filter(x=>x.emotion===e).reduce((a,x)=>a+(x.pnl||0),0),count:trades.filter(x=>x.emotion===e).length})).filter(x=>x.count>0);
  const pieData=[{name:t("wins"),value:wins.length,color:C.green},{name:t("losses"),value:losses.length,color:C.red}];
  const hl = s => lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit";

  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:800,marginBottom:20,fontFamily:hl()}}>{t("dashboard")}</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:20}}>
        {[{l:t("netPnl"),v:`${totalPnl>=0?"+":""}₹${fmt(totalPnl)}`,c:totalPnl>=0?C.green:C.red},{l:t("winRate"),v:`${winRate}%`,c:winRate>=55?C.green:C.gold},{l:t("profitFactor"),v:pf,c:Number(pf)>=1.5?C.green:C.gold},{l:t("totalTradesStat"),v:trades.length},{l:t("avgWin"),v:`+₹${fmt(avgWin)}`,c:C.green},{l:t("avgLoss"),v:`-₹${fmt(Math.abs(avgLoss))}`,c:C.red}].map(s=>(
          <Card key={s.l} style={{textAlign:"center"}}>
            <div className="mono" style={{fontSize:26,fontWeight:700,color:s.c||C.text,letterSpacing:-1}}>{s.v}</div>
            <div style={{fontSize:10,color:C.textMuted,marginTop:5,textTransform:"uppercase",letterSpacing:.8,fontFamily:hl()}}>{s.l}</div>
          </Card>
        ))}
      </div>
      <Card style={{marginBottom:16}}>
        <div style={{fontWeight:700,marginBottom:14,display:"flex",justifyContent:"space-between",fontFamily:hl()}}>
          <span>{t("equityCurve")}</span>
          <span className="mono" style={{fontSize:13,color:totalPnl>=0?C.green:C.red}}>{fmtFull(totalPnl)}</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={eqData}>
            <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={totalPnl>=0?C.green:C.red} stopOpacity={.25}/><stop offset="95%" stopColor={totalPnl>=0?C.green:C.red} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="name" tick={{fill:C.textMuted,fontSize:10}}/>
            <YAxis tick={{fill:C.textMuted,fontSize:10}} tickFormatter={v=>`₹${fmt(v)}`}/>
            <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8}} formatter={v=>[`₹${v.toLocaleString("en-IN")}`,t("netPnl")]}/>
            <Area type="monotone" dataKey="equity" stroke={totalPnl>=0?C.green:C.red} strokeWidth={2.5} fill="url(#eg)" dot={{fill:totalPnl>=0?C.green:C.red,r:3}}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:14,fontFamily:hl()}}>{t("pnlByStrategy")}</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stratData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:C.textMuted,fontSize:10}} tickFormatter={v=>`₹${fmt(v)}`}/>
              <YAxis type="category" dataKey="name" tick={{fill:C.textMuted,fontSize:10}} width={90}/>
              <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8}} formatter={v=>[fmtFull(v),"P&L"]}/>
              <Bar dataKey="pnl" radius={4}>{stratData.map((e,i)=><Cell key={i} fill={e.pnl>=0?C.green:C.red}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card style={{flex:1}}>
            <div style={{fontWeight:700,marginBottom:10,fontFamily:hl()}}>{t("winLossRatio")}</div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <PieChart width={90} height={90}><Pie data={pieData} cx={45} cy={45} innerRadius={24} outerRadius={42} dataKey="value" strokeWidth={0}>{pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></PieChart>
              <div style={{flex:1}}>{pieData.map(p=>(
                <div key={p.name} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,color:p.color,display:"flex",gap:6,alignItems:"center",fontFamily:hl()}}><span style={{width:7,height:7,background:p.color,borderRadius:"50%",display:"inline-block"}}/>{p.name}</span>
                  <span className="mono" style={{fontSize:12,fontWeight:700}}>{p.value}</span>
                </div>
              ))}</div>
            </div>
          </Card>
          <Card style={{flex:1}}>
            <div style={{fontWeight:700,marginBottom:8,fontFamily:hl()}}>{t("emotionImpact")}</div>
            {emoData.slice(0,4).map(x=>{
              const max=Math.max(...emoData.map(e=>Math.abs(e.pnl)));
              return (
                <div key={x.name} style={{display:"flex",gap:8,alignItems:"center",marginBottom:7}}>
                  <span style={{fontSize:11,color:C.textMuted,width:70,fontFamily:hl()}}>{x.name}</span>
                  <div style={{flex:1,background:C.bg,borderRadius:3,height:6}}><div style={{width:`${Math.min(Math.abs(x.pnl)/max*100,100)}%`,height:"100%",background:x.pnl>=0?C.green:C.red,borderRadius:3}}/></div>
                  <span className="mono" style={{fontSize:11,color:x.pnl>=0?C.green:C.red,minWidth:56,textAlign:"right"}}>{x.pnl>=0?"+":""}₹{fmt(x.pnl)}</span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
      <Card>
        <div style={{fontWeight:700,marginBottom:14,fontFamily:hl()}}>{t("tradePnl")}</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={eqData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
            <XAxis dataKey="name" tick={{fill:C.textMuted,fontSize:10}}/>
            <YAxis tick={{fill:C.textMuted,fontSize:10}} tickFormatter={v=>`₹${fmt(v)}`}/>
            <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8}} formatter={v=>[fmtFull(v),"P&L"]}/>
            <Bar dataKey="pnl" radius={4}>{eqData.map((e,i)=><Cell key={i} fill={e.pnl>=0?C.green:C.red}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

// ─── JOURNAL ──────────────────────────────────────────────────────────────────
const Journal = ({trades,setTrades,lang,onUpgrade,isPro}) => {
  const {t} = useLang();
  const [form,setForm] = useState({stock:"",type:"LONG",segment:"EQ",entry:"",exit:"",qty:"",strategy:"Breakout",emotion:"Confident",notes:"",date:now()});
  const [show,setShow] = useState(false);
  const [fs,setFs] = useState("");
  const [ft,setFt] = useState("ALL");
  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const add=()=>{if(!form.stock||!form.entry||!form.exit||!form.qty)return;const pnl=calcPnL(form);setTrades(t=>[{...form,id:Date.now(),pnl,segment:form.segment||"EQ"},...t]);setForm({stock:"",type:"LONG",segment:"EQ",entry:"",exit:"",qty:"",strategy:"Breakout",emotion:"Confident",notes:"",date:now()});setShow(false);};
  const del=id=>setTrades(t=>t.filter(x=>x.id!==id));
  const filtered=trades.filter(x=>{const ms=fs?x.stock.includes(fs.toUpperCase())||x.strategy.toLowerCase().includes(fs.toLowerCase()):true;const mt=ft==="ALL"?true:ft==="WIN"?x.pnl>0:ft==="LOSS"?x.pnl<0:x.type===ft;return ms&&mt;});
  const totalPnl=trades.reduce((a,x)=>a+(x.pnl||0),0);
  const hl=lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit";
  const STRAT=["Breakout","Pullback","Gap Up/Down","Momentum","Support/Resistance","News Based","Positional","Intraday","Other"];
  const EMO=["Confident","Disciplined","Patient","FOMO","Anxious","Revenge","Greedy","Bored"];

  return (
    <div>
      <div style={{display:"flex",gap:12,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",marginBottom:18}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,fontFamily:hl}}>{t("journal")}</h2>
          <p style={{color:C.textMuted,fontSize:12,marginTop:2,fontFamily:hl}}>{trades.length} {t("totalTrades")} · <span className="mono" style={{color:totalPnl>=0?C.green:C.red,fontWeight:700}}>{fmtFull(totalPnl)}</span></p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn size="sm" variant="ghost" onClick={()=>setShow(!show)}>{t("logTrade")}</Btn>
        </div>
      </div>

      {show && (
        <Card style={{marginBottom:18}} glow>
          <div style={{fontSize:14,fontWeight:700,color:C.accent,marginBottom:16,fontFamily:hl}}>{t("logTrade")}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:12}}>
            <Input label={t("stockSymbol")} value={form.stock} onChange={v=>upd("stock",v.toUpperCase())} placeholder="RELIANCE"/>
            <Sel label={t("direction")} value={form.type} onChange={v=>upd("type",v)} options={[{value:"LONG",label:"LONG (Buy)"},{value:"SHORT",label:"SHORT (Sell)"}]}/>
            <Sel label={t("segment")} value={form.segment} onChange={v=>upd("segment",v)} options={[{value:"EQ",label:"Equity"},{value:"F&O",label:"F&O"},{value:"CDS",label:"Currency"}]}/>
            <Input label={t("entryPrice")} type="number" value={form.entry} onChange={v=>upd("entry",v)} placeholder="0.00"/>
            <Input label={t("exitPrice")} type="number" value={form.exit} onChange={v=>upd("exit",v)} placeholder="0.00"/>
            <Input label={t("quantity")} type="number" value={form.qty} onChange={v=>upd("qty",v)} placeholder="100"/>
            <Sel label={t("strategy")} value={form.strategy} onChange={v=>upd("strategy",v)} options={STRAT.map(s=>({value:s,label:s}))}/>
            <Sel label={t("emotion")} value={form.emotion} onChange={v=>upd("emotion",v)} options={EMO.map(e=>({value:e,label:e}))}/>
            <Input label={t("date")} type="date" value={form.date} onChange={v=>upd("date",v)}/>
          </div>
          <div style={{marginTop:12}}><Input label={t("notes")} value={form.notes} onChange={v=>upd("notes",v)} placeholder="Entry trigger, what you learned..." style={{width:"100%"}}/></div>
          {form.entry&&form.exit&&form.qty&&<div className="mono" style={{marginTop:10,padding:"8px 12px",background:C.bg,borderRadius:7,fontSize:12}}>{t("estPnl")} <span style={{color:(calcPnL(form)||0)>=0?C.green:C.red,fontWeight:700}}>{calcPnL(form)!==null?fmtFull(calcPnL(form)):"—"}</span></div>}
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <Btn onClick={add} size="sm">{t("saveTrade")}</Btn>
            <Btn variant="ghost" size="sm" onClick={()=>setShow(false)}>{t("cancel")}</Btn>
          </div>
        </Card>
      )}

      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={fs} onChange={e=>setFs(e.target.value)} placeholder={t("search")} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 12px",color:C.text,fontSize:12,outline:"none",width:200,fontFamily:"'IBM Plex Mono',monospace"}}/>
        {["ALL","WIN","LOSS","LONG","SHORT"].map(f=>(
          <button key={f} onClick={()=>setFt(f)} style={{padding:"6px 12px",border:`1px solid ${ft===f?C.accent:C.border}`,borderRadius:8,background:ft===f?`${C.accent}15`:"transparent",color:ft===f?C.accent:C.textMuted,cursor:"pointer",fontWeight:700,fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{f}</button>
        ))}
        <span style={{fontSize:11,color:C.textMuted}}>{filtered.length} {t("totalTrades")}</span>
      </div>

      {filtered.length===0 && <div style={{textAlign:"center",padding:"40px 20px",color:C.textDim,fontFamily:hl}}>{t("noTrades")}</div>}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(x=>(
          <div key={x.id} style={{background:C.card,border:`1px solid ${(x.pnl||0)>=0?`${C.green}25`:`${C.red}25`}`,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{width:3,height:40,background:(x.pnl||0)>=0?C.green:C.red,borderRadius:2,flexShrink:0}}/>
            <div style={{flex:1,minWidth:180}}>
              <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap",marginBottom:3}}>
                <span style={{fontWeight:800,fontSize:14}}>{x.stock}</span>
                <Badge color={x.type==="LONG"?C.green:C.gold}>{x.type}</Badge>
                <Badge color={C.textDim}>{x.segment||"EQ"}</Badge>
                <Badge color={`${C.accent}AA`}>{x.strategy}</Badge>
                <Badge color={C.purple}>{x.emotion}</Badge>
              </div>
              <div className="mono" style={{fontSize:11,color:C.textMuted}}>{x.date} · ₹{x.entry} → ₹{x.exit} · {x.qty} qty</div>
              {x.notes&&<div style={{fontSize:11,color:C.textDim,marginTop:2}}>{x.notes}</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{textAlign:"right"}}>
                <div className="mono" style={{fontSize:18,fontWeight:700,color:(x.pnl||0)>=0?C.green:C.red}}>{(x.pnl||0)>=0?"+":""}₹{Math.abs(x.pnl||0).toLocaleString("en-IN")}</div>
                <div style={{fontSize:10,color:C.textMuted,fontFamily:hl}}>{(x.pnl||0)>=0?t("profit"):t("loss")}</div>
              </div>
              <button onClick={()=>del(x.id)} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:14,padding:4,borderRadius:6}}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── INIT DATA ────────────────────────────────────────────────────────────────
const INIT = [
  {id:1,stock:"RELIANCE",type:"LONG",segment:"EQ",entry:"2820",exit:"2847",qty:"100",strategy:"Breakout",emotion:"Confident",notes:"Clean breakout above 2810 resistance",date:"2026-05-20",pnl:2700},
  {id:2,stock:"TATA STEEL",type:"LONG",segment:"EQ",entry:"155.4",exit:"152.3",qty:"1000",strategy:"Pullback",emotion:"Anxious",notes:"Should have waited for confirmation",date:"2026-05-21",pnl:-3100},
  {id:3,stock:"INFY",type:"SHORT",segment:"EQ",entry:"1490",exit:"1456",qty:"200",strategy:"Momentum",emotion:"Confident",notes:"Perfect execution, held through noise",date:"2026-05-22",pnl:6800},
  {id:4,stock:"HDFC BANK",type:"LONG",segment:"EQ",entry:"1615",exit:"1628",qty:"150",strategy:"Support/Resistance",emotion:"Patient",notes:"Waited at key level — textbook",date:"2026-05-22",pnl:1950},
  {id:5,stock:"SBIN",type:"LONG",segment:"EQ",entry:"790",exit:"782",qty:"500",strategy:"Breakout",emotion:"FOMO",notes:"Chased breakout, bad entry",date:"2026-05-23",pnl:-4000},
  {id:6,stock:"NIFTY 24700 CE",type:"LONG",segment:"F&O",entry:"185",exit:"260",qty:"75",strategy:"Momentum",emotion:"Disciplined",notes:"Held overnight — rewarded gap up",date:"2026-05-19",pnl:5625},
  {id:7,stock:"COAL INDIA",type:"SHORT",segment:"EQ",entry:"425",exit:"418",qty:"800",strategy:"Support/Resistance",emotion:"Patient",notes:"Resistance at 428 held perfectly",date:"2026-05-18",pnl:5600},
];

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
const PayModal = ({open,onClose,onSuccess,lang}) => {
  const [plan,setPlan]=useState("yearly");
  const [step,setStep]=useState("plan");
  const [form,setForm]=useState({name:"",email:"",phone:""});
  const PLANS=[{id:"monthly",name:"Pro Monthly",price:499,per:"month"},{id:"yearly",name:"Pro Annual",price:3999,per:"year",badge:"Best Value"},{id:"lifetime",name:"Lifetime",price:9999,per:"one-time",badge:"🔥 Popular"}];
  const sel=PLANS.find(p=>p.id===plan);
  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const hl=lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit";

  const pay=()=>{
    setStep("processing");
    const script=document.createElement("script");
    script.src="https://checkout.razorpay.com/v1/checkout.js";
    script.onload=()=>{
      const rzp=new window.Razorpay({
        key:"rzp_test_YourKeyHere", // 🔑 Replace with your key
        amount:sel.price*100,currency:"INR",name:"TradeIQ AI",description:sel.name,
        prefill:{name:form.name,email:form.email,contact:form.phone},
        theme:{color:C.accent},
        handler:()=>{setStep("success");},
        modal:{ondismiss:()=>{setStep("details");}},
      });
      rzp.open();
    };
    script.onerror=()=>setTimeout(()=>{setStep("success");onSuccess(sel);},2000);
    document.head.appendChild(script);
  };

  if(!open)return null;
  return (
    <Modal open={open} onClose={onClose} width={500}>
      {step==="plan"&&(<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:18,fontWeight:800,fontFamily:hl}}>{lang==="hi"?"Pro में अपग्रेड करें":"Upgrade to Pro"}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.textMuted,fontSize:18,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {PLANS.map(p=>(
            <div key={p.id} onClick={()=>setPlan(p.id)} style={{padding:14,border:`2px solid ${plan===p.id?C.accent:C.border}`,borderRadius:12,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:plan===p.id?`${C.accent}08`:"transparent",transition:"all .2s"}}>
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,fontFamily:hl}}>{p.name}</span>{p.badge&&<Badge color={C.gold}>{p.badge}</Badge>}</div>
              </div>
              <div className="mono" style={{fontSize:20,fontWeight:700,color:plan===p.id?C.accent:C.text}}>₹{p.price.toLocaleString()}<span style={{fontSize:12,color:C.textMuted}}>/{p.per}</span></div>
            </div>
          ))}
        </div>
        <Btn full onClick={()=>setStep("details")} style={{animation:"glow 2s infinite"}}>{lang==="hi"?`जारी रखें · ₹${sel?.price.toLocaleString()}`:`Continue · ₹${sel?.price.toLocaleString()}`}</Btn>
      </>)}
      {step==="details"&&(<>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button onClick={()=>setStep("plan")} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:18}}>←</button>
          <div><div style={{fontSize:16,fontWeight:800,fontFamily:hl}}>{lang==="hi"?"आपकी जानकारी":"Your Details"}</div><div style={{fontSize:11,color:C.textMuted}}>{sel?.name} · ₹{sel?.price.toLocaleString()}</div></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
          <Input label={lang==="hi"?"पूरा नाम":"Full Name"} value={form.name} onChange={v=>upd("name",v)} placeholder="Mahesh Kumar"/>
          <Input label={lang==="hi"?"ईमेल":"Email"} type="email" value={form.email} onChange={v=>upd("email",v)} placeholder="mahesh@email.com"/>
          <Input label={lang==="hi"?"फोन नंबर":"Phone"} type="tel" value={form.phone} onChange={v=>upd("phone",v)} placeholder="9876543210"/>
        </div>
        <div style={{fontSize:11,color:C.textMuted,display:"flex",alignItems:"center",gap:6,marginBottom:14}}>🔒 {lang==="hi"?"Razorpay द्वारा सुरक्षित · UPI, कार्ड, नेट बैंकिंग":"Secured by Razorpay · UPI, Cards, Net Banking"}</div>
        <Btn full onClick={pay} disabled={!form.name||!form.email||!form.phone} style={{animation:"glow 2s infinite"}}>🔒 {lang==="hi"?`₹${sel?.price.toLocaleString()} सुरक्षित भुगतान करें`:`Pay Securely ₹${sel?.price.toLocaleString()}`}</Btn>
      </>)}
      {step==="processing"&&<div style={{textAlign:"center",padding:"40px 0"}}><Spinner size={48}/><div style={{fontSize:16,fontWeight:700,marginTop:20,fontFamily:hl}}>{lang==="hi"?"Razorpay खुल रहा है...":"Opening Razorpay..."}</div></div>}
      {step==="success"&&(
        <div style={{textAlign:"center",padding:"32px 0"}}>
          <div style={{fontSize:60,marginBottom:14}}>🎉</div>
          <div style={{fontSize:20,fontWeight:800,color:C.green,fontFamily:hl}}>{lang==="hi"?"भुगतान सफल!":"Payment Successful!"}</div>
          <div style={{fontSize:13,color:C.textMuted,marginTop:8,marginBottom:24,fontFamily:hl}}>{lang==="hi"?"TradeIQ AI Pro में आपका स्वागत है!":"Welcome to TradeIQ AI Pro!"}</div>
          <Btn onClick={()=>{onClose();onSuccess(sel);setStep("plan");}} style={{margin:"0 auto"}}>{lang==="hi"?"ऐप खोलें →":"Start Now →"}</Btn>
        </div>
      )}
    </Modal>
  );
};

// ─── LANDING ──────────────────────────────────────────────────────────────────
const Landing = ({setPage,onUpgrade,lang}) => {
  const {t}=useLang();
  const hl=lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit";
  return (
    <div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"72px 24px 60px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
        <div style={{animation:"fadeUp .7s ease"}}>
          <div style={{display:"inline-flex",gap:8,alignItems:"center",background:`${C.gold}15`,border:`1px solid ${C.gold}40`,borderRadius:100,padding:"6px 14px",marginBottom:24}}>
            <span>🇮🇳</span><span style={{fontSize:12,color:C.gold,fontWeight:700,fontFamily:hl}}>{lang==="hi"?"NSE और BSE के लिए बनाया गया":"Built for NSE & BSE Traders"}</span>
          </div>
          <h1 style={{fontSize:"clamp(34px,5vw,56px)",fontWeight:800,lineHeight:1.1,letterSpacing:-2,marginBottom:18,fontFamily:hl}}>
            {lang==="hi"?"अनुमान लगाना बंद करो।":"Stop guessing."}<br/>
            <span style={{color:C.accent}}>{lang==="hi"?"AI बताएगा":"AI knows exactly"}</span><br/>
            {lang==="hi"?"नुकसान क्यों हो रहा है।":"why you lose."}
          </h1>
          <p style={{fontSize:16,color:C.textMuted,lineHeight:1.8,maxWidth:460,marginBottom:28,fontFamily:hl}}>
            {lang==="hi"?"भारत का पहला AI ट्रेड जर्नल। WhatsApp में ट्रेड लिखो, AI आपकी कमज़ोरियाँ पहचानेगा और हिंदी में समझाएगा।":"India's #1 AI trade journal. Log trades via WhatsApp-style chat, get AI coaching in Hindi or English."}
          </p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:28}}>
            <Btn size="lg" onClick={()=>setPage("app")} style={{animation:"glow 2.5s infinite"}}>{lang==="hi"?"🚀 मुफ़्त शुरू करें":"🚀 Start Free"}</Btn>
            <Btn size="lg" variant="outline" onClick={onUpgrade}>{lang==="hi"?"Pro प्लान देखें →":"View Pro Plans →"}</Btn>
          </div>
          <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
            {(lang==="hi"?["हिंदी में AI कोचिंग","WhatsApp स्टाइल लॉगर","NSE + BSE + F&O","Zerodha, Groww इम्पोर्ट"]:["Hindi AI Coaching","WhatsApp-style Logger","NSE + BSE + F&O","Broker auto-import"]).map(f=>(
              <span key={f} style={{fontSize:12,color:C.textMuted,display:"flex",alignItems:"center",gap:5,fontFamily:hl}}><span style={{color:C.green,fontWeight:700}}>✓</span>{f}</span>
            ))}
          </div>
        </div>
        {/* Hero card */}
        <div style={{animation:"fadeUp .9s ease"}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",boxShadow:`0 40px 100px rgba(0,0,0,.6),0 0 60px ${C.accentGlow}`}}>
            <div style={{background:`linear-gradient(135deg,${C.wa},${C.waDark})`,padding:"12px 18px",display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:34,height:34,background:`linear-gradient(135deg,${C.waGreen},${C.accent})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
              <div><div style={{fontWeight:700,fontSize:13,fontFamily:hl}}>{lang==="hi"?"WhatsApp ट्रेड लॉगर":"WhatsApp Trade Logger"}</div><div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>● online</div></div>
            </div>
            <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
              {[
                {from:"user",text:lang==="hi"?"100 रिलायंस 2820 पर खरीदा, 2847 पर बेचा, ब्रेकआउट था":"Bought 100 Reliance at 2820, sold 2847 breakout"},
                {from:"ai",text:lang==="hi"?"✅ ट्रेड लॉग!\nRELIANCE LONG · ₹2820 → ₹2847\nP&L: +₹2,700 🟢":"✅ Trade logged!\nRELIANCE LONG · ₹2820 → ₹2847\nP&L: +₹2,700 🟢"},
                {from:"user",text:lang==="hi"?"SBIN 500 qty लिया 790 पर, 782 exit, नुकसान हुआ":"SBIN 500 qty long, 790 entry 782 exit, FOMO"},
                {from:"ai",text:lang==="hi"?"⚠️ SBIN SHORT · P&L: -₹4,000\n🤖 FOMO ट्रेड में आपका जीत दर केवल 24% है।":"⚠️ SBIN LONG · P&L: -₹4,000\n🤖 Your FOMO trades have only 24% win rate."},
              ].map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"78%",background:m.from==="user"?`linear-gradient(135deg,${C.accent}DD,${C.purple}CC)`:C.waBubble,color:m.from==="user"?C.bg:C.text,borderRadius:m.from==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",padding:"9px 13px",fontSize:12,lineHeight:1.55,whiteSpace:"pre-wrap",fontFamily:hl}}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div style={{background:C.surfaceAlt,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"60px 24px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:24,textAlign:"center"}}>
          {[
            {icon:"💬",t:lang==="hi"?"WhatsApp लॉगर":"WhatsApp Logger",d:lang==="hi"?"हिंदी/English में ट्रेड लिखो":"Log trades in Hindi or English"},
            {icon:"🧠",t:lang==="hi"?"AI कोच हिंदी में":"Hindi AI Coach",d:lang==="hi"?"हिंदी में सलाह पाओ":"Get coaching in your language"},
            {icon:"📊",t:lang==="hi"?"एडवांस्ड चार्ट":"Advanced Charts",d:lang==="hi"?"इक्विटी कर्व, P&L विश्लेषण":"Equity curve, P&L analytics"},
            {icon:"🔗",t:lang==="hi"?"ब्रोकर इम्पोर्ट":"Broker Import",d:lang==="hi"?"Zerodha, Groww से इम्पोर्ट करो":"Zerodha, Groww auto-import"},
            {icon:"🎯",t:lang==="hi"?"भावना ट्रैकर":"Emotion Tracker",d:lang==="hi"?"FOMO, बदला ट्रेड पहचानो":"Track FOMO & revenge trades"},
          ].map(f=>(
            <div key={f.t} style={{padding:20}}>
              <div style={{fontSize:32,marginBottom:10}}>{f.icon}</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6,fontFamily:hl}}>{f.t}</div>
              <div style={{fontSize:12,color:C.textMuted,fontFamily:hl}}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:"center",padding:"80px 24px"}}>
        <h2 style={{fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:-1.5,fontFamily:hl}}>{lang==="hi"?"आज ही शुरू करें":"Start trading smarter today"} <span style={{color:C.accent}}>{lang==="hi"?"मुफ़्त में":"for free"}</span></h2>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:28,flexWrap:"wrap"}}>
          <Btn size="lg" onClick={()=>setPage("app")} style={{animation:"glow 2s infinite"}}>{lang==="hi"?"🚀 मुफ़्त जर्नल शुरू करें":"🚀 Start Free Journal"}</Btn>
          <Btn size="lg" variant="outline" onClick={onUpgrade}>{lang==="hi"?"⚡ Pro में अपग्रेड करें":"⚡ Upgrade to Pro"}</Btn>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${C.border}`,padding:"18px 24px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <span style={{fontWeight:800,color:C.accent}}>TradeIQ AI</span>
        <span style={{fontSize:11,color:C.textMuted,fontFamily:hl}}>{lang==="hi"?"© 2026 TradeIQ AI · NSE/BSE · बेंगलुरु, भारत · SEBI पंजीकृत नहीं। केवल शिक्षा हेतु।":"© 2026 TradeIQ AI · Bengaluru, India · Not SEBI registered. Educational use only."}</span>
      </div>
    </div>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function TradeIQAI() {
  const [page,setPage]=useState("home");
  const [lang,setLang]=useState("en");
  const [isPro,setIsPro]=useState(false);
  const [payOpen,setPayOpen]=useState(false);
  const [tab,setTab]=useState("Journal");
  const [trades,setTrades]=useState(INIT);

  const t=key=>TRANS[lang][key]||TRANS.en[key]||key;
  const TABS=["Journal","Dashboard","AI Coach","WhatsApp Logger"];
  const hl=lang==="hi"?"'Noto Sans Devanagari',sans-serif":"inherit";

  const handleTradeLogged = (trade) => {
    setTrades(prev=>[trade,...prev]);
  };

  return (
    <LangCtx.Provider value={{lang,t}}>
      <style>{GS}</style>
      <Ticker/>
      <Nav page={page} setPage={setPage} onUpgrade={()=>setPayOpen(true)} isPro={isPro} lang={lang} setLang={setLang}/>

      {page==="home"
        ? <Landing setPage={setPage} onUpgrade={()=>setPayOpen(true)} lang={lang}/>
        : (
          <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 16px 60px"}}>
            {/* App tabs */}
            <div style={{display:"flex",gap:3,background:C.card,borderRadius:12,padding:3,width:"fit-content",marginBottom:24,border:`1px solid ${C.border}`,flexWrap:"wrap"}}>
              {TABS.map(tb=>(
                <button key={tb} onClick={()=>setTab(tb)} style={{padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:lang==="hi"?hl:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:12,transition:"all .2s",background:tab===tb?C.accent:"transparent",color:tab===tb?C.bg:C.textMuted,display:"flex",alignItems:"center",gap:5}}>
                  {tb==="WhatsApp Logger"&&<span style={{fontSize:13}}>💬</span>}
                  {lang==="hi"
                    ?{Journal:"जर्नल",Dashboard:"डैशबोर्ड","AI Coach":"AI कोच","WhatsApp Logger":"WhatsApp लॉगर"}[tb]
                    :tb}
                </button>
              ))}
            </div>
            {tab==="Journal" && <Journal trades={trades} setTrades={setTrades} lang={lang} isPro={isPro} onUpgrade={()=>setPayOpen(true)}/>}
            {tab==="Dashboard" && <Dashboard trades={trades} lang={lang}/>}
            {tab==="AI Coach" && <AICoach trades={trades} isPro={isPro} onUpgrade={()=>setPayOpen(true)} lang={lang}/>}
            {tab==="WhatsApp Logger" && (
              <div>
                <div style={{marginBottom:16}}>
                  <h2 style={{fontSize:20,fontWeight:800,fontFamily:hl,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:22}}>💬</span>
                    {lang==="hi"?"WhatsApp ट्रेड लॉगर":"WhatsApp Trade Logger"}
                    <Badge color={C.waGreen}>EXCLUSIVE</Badge>
                  </h2>
                  <p style={{fontSize:13,color:C.textMuted,marginTop:4,fontFamily:hl}}>{lang==="hi"?"हिंदी या English में ट्रेड लिखें — AI खुद जर्नल में जोड़ेगा। कोई फॉर्म नहीं।":"Type trades naturally in Hindi or English — AI parses & logs automatically. No forms needed."}</p>
                </div>
                <WaLogger onTradeLogged={handleTradeLogged} lang={lang}/>
              </div>
            )}
          </div>
        )
      }
      <PayModal open={payOpen} onClose={()=>setPayOpen(false)} onSuccess={()=>setIsPro(true)} lang={lang}/>
    </LangCtx.Provider>
  );
}

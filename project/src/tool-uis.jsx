/* Individual tool UIs — each self-contained, all local */
const { useState, useEffect, useMemo, useRef, useCallback } = React;

/* ============================================================
   Shared UI primitives for tool surfaces
   ============================================================ */
function ToolTabs({ tabs, active, onChange }) {
  return (
    <div className="tui-tabs" role="tablist">
      {tabs.map(t => (
        <button key={t.id} role="tab" aria-selected={active === t.id}
          className={`tui-tab ${active === t.id ? 'on' : ''}`}
          onClick={() => onChange(t.id)}>
          {t.icon && <ShieldIcon name={t.icon} size={13}/>}
          {t.label}
        </button>
      ))}
    </div>
  );
}

function CopyBtn({ text, label = "Copy", size = 'sm' }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className={`tui-btn tui-btn-${size}`} onClick={async () => {
      if (!text) return;
      try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
    }}>
      <ShieldIcon name={copied ? 'check' : 'copy'} size={12}/> {copied ? 'Copied' : label}
    </button>
  );
}

function Field({ label, hint, children, mono }) {
  return (
    <div className={`tui-field ${mono ? 'mono' : ''}`}>
      <div className="tui-field-label">
        <span>{label}</span>
        {hint && <span className="tui-field-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ============================================================
   Hash Generator
   ============================================================ */
function HashGenerator() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');
  const [algos, setAlgos] = useState(['SHA-256', 'SHA-1', 'SHA-512', 'SHA-384']);
  const [results, setResults] = useState({});
  const [mode, setMode] = useState('text');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [compare, setCompare] = useState('');
  const [busy, setBusy] = useState(false);

  async function hashText() {
    const enc = new TextEncoder().encode(text);
    const out = {};
    for (const algo of algos) {
      const buf = await crypto.subtle.digest(algo, enc);
      out[algo] = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    setResults(out);
  }

  async function hashFile(file) {
    setBusy(true);
    setFileName(file.name);
    setFileSize(file.size);
    const buf = await file.arrayBuffer();
    const out = {};
    for (const algo of algos) {
      const digest = await crypto.subtle.digest(algo, buf);
      out[algo] = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    setResults(out);
    setBusy(false);
  }

  useEffect(() => { if (mode === 'text') hashText(); }, [text, algos, mode]);

  const primary = results[algos[0]] || '';
  const matchStatus = compare && primary
    ? (compare.trim().toLowerCase() === primary.toLowerCase() ? 'match' : 'mismatch')
    : null;

  return (
    <div className="tui">
      <ToolTabs active={mode} onChange={setMode} tabs={[
        { id: 'text', label: 'Text', icon: 'code' },
        { id: 'file', label: 'File', icon: 'upload' },
      ]}/>

      {mode === 'text' ? (
        <Field label="Input">
          <textarea className="tui-textarea" rows={5} value={text} onChange={e => setText(e.target.value)} spellCheck={false}/>
          <div className="tui-meta">
            <span>{text.length} chars</span>
            <span>{new Blob([text]).size} bytes</span>
          </div>
        </Field>
      ) : (
        <Field label="File">
          <label className="tui-drop">
            <input type="file" onChange={e => e.target.files[0] && hashFile(e.target.files[0])} hidden/>
            <ShieldIcon name="upload" size={22}/>
            <div>
              <strong>{fileName || 'Drop a file or click to browse'}</strong>
              <div className="tui-drop-sub">
                {fileName ? `${(fileSize/1024).toFixed(1)} KB${busy ? ' · hashing…' : ''}` : 'Hashed in-memory, never uploaded.'}
              </div>
            </div>
          </label>
        </Field>
      )}

      <Field label="Algorithms">
        <div className="tui-pill-row">
          {['SHA-1','SHA-256','SHA-384','SHA-512'].map(a => (
            <label key={a} className={`tui-pill ${algos.includes(a) ? 'on' : ''}`}
              onClick={() => setAlgos(curr => curr.includes(a) ? curr.filter(x => x !== a) : [...curr, a])}>
              <ShieldIcon name={algos.includes(a) ? 'check' : 'plus'} size={11}/> {a}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Output">
        <div className="tui-hash-out">
          {algos.map(a => (
            <div key={a} className="tui-hash-row">
              <span className="tui-hash-tag">{a}</span>
              <code className="tui-hash-val">{results[a] || '…'}</code>
              <CopyBtn text={results[a]}/>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Verify against expected hash" hint="Compare to the primary algorithm">
        <div className="tui-verify-row">
          <input className="tui-input mono" placeholder="Paste expected hash…" value={compare} onChange={e => setCompare(e.target.value)}/>
          {matchStatus === 'match' && <span className="tui-badge ok"><ShieldIcon name="check" size={12}/> Match</span>}
          {matchStatus === 'mismatch' && <span className="tui-badge bad"><ShieldIcon name="alert" size={12}/> Mismatch</span>}
        </div>
      </Field>
    </div>
  );
}

/* ============================================================
   JWT Decoder
   ============================================================ */
function JWTDecoder() {
  const sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggU2VjdXJpdHkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDUwMDAwMDAsImV4cCI6MTk5OTk5OTk5OX0.kH0vE7gZvF5TtYgzqW8KDmFr4nX9mQPcA2Lw8aYlBCo";
  const [token, setToken] = useState(sample);

  const parsed = useMemo(() => {
    const parts = token.trim().split('.');
    if (parts.length !== 3) return { error: 'Expected three dot-separated segments.' };
    const dec = (s) => {
      try {
        let str = s.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) str += '=';
        const txt = atob(str);
        return JSON.parse(txt);
      } catch { return null; }
    };
    const header = dec(parts[0]);
    const payload = dec(parts[1]);
    if (!header || !payload) return { error: 'Malformed base64url segments.' };
    return { header, payload, signature: parts[2], parts };
  }, [token]);

  const now = Math.floor(Date.now()/1000);
  const exp = parsed.payload?.exp;
  const iat = parsed.payload?.iat;
  const nbf = parsed.payload?.nbf;
  const expired = exp && now > exp;
  const notYet = nbf && now < nbf;

  const fmt = (ts) => ts ? new Date(ts*1000).toLocaleString() : '—';
  const rel = (ts) => {
    if (!ts) return '';
    const d = ts - now;
    const abs = Math.abs(d);
    const unit = abs < 60 ? [abs,'s'] : abs < 3600 ? [abs/60|0,'min'] : abs < 86400 ? [abs/3600|0,'h'] : [abs/86400|0,'d'];
    return `${d < 0 ? '' : 'in '}${unit[0]} ${unit[1]}${d < 0 ? ' ago' : ''}`;
  };

  return (
    <div className="tui">
      <Field label="JWT Token" hint="Paste any JWT — header.payload.signature">
        <textarea className="tui-textarea mono" rows={4} value={token} onChange={e => setToken(e.target.value)} spellCheck={false}/>
      </Field>

      {parsed.error ? (
        <div className="tui-banner bad"><ShieldIcon name="alert" size={14}/> {parsed.error}</div>
      ) : (
        <>
          <div className="tui-jwt-status">
            <span className={`tui-badge ${expired ? 'bad' : notYet ? 'warn' : 'ok'}`}>
              <ShieldIcon name={expired ? 'alert' : 'check'} size={12}/>
              {expired ? 'Expired' : notYet ? 'Not yet valid' : 'Valid window'}
            </span>
            <span className="tui-meta-pill">alg · {parsed.header.alg}</span>
            <span className="tui-meta-pill">typ · {parsed.header.typ || '—'}</span>
            {parsed.header.kid && <span className="tui-meta-pill">kid · {parsed.header.kid}</span>}
          </div>

          <div className="tui-jwt-grid">
            <div className="tui-jwt-card" data-kind="header">
              <div className="tui-jwt-head"><span className="dot"/> Header</div>
              <pre className="tui-code">{JSON.stringify(parsed.header, null, 2)}</pre>
            </div>
            <div className="tui-jwt-card" data-kind="payload">
              <div className="tui-jwt-head"><span className="dot"/> Payload</div>
              <pre className="tui-code">{JSON.stringify(parsed.payload, null, 2)}</pre>
            </div>
            <div className="tui-jwt-card" data-kind="signature">
              <div className="tui-jwt-head"><span className="dot"/> Signature</div>
              <code className="tui-code mono-wrap">{parsed.signature}</code>
              <div className="tui-note">Verification requires the secret or public key — run offline to keep credentials local.</div>
            </div>
          </div>

          <div className="tui-jwt-times">
            <div><span>Issued</span><strong>{fmt(iat)}</strong><em>{rel(iat)}</em></div>
            <div><span>Not before</span><strong>{fmt(nbf)}</strong><em>{rel(nbf)}</em></div>
            <div className={expired ? 'bad' : 'ok'}><span>Expires</span><strong>{fmt(exp)}</strong><em>{rel(exp)}</em></div>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   Base64 / URL / Hex Encoder
   ============================================================ */
function EncoderTool() {
  const [format, setFormat] = useState('base64');
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('Hello, Shield IT 🛡️');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    try {
      if (!input) { setOutput(''); return; }
      if (format === 'base64') {
        if (mode === 'encode') {
          const bytes = new TextEncoder().encode(input);
          let bin = ''; for (const b of bytes) bin += String.fromCharCode(b);
          setOutput(btoa(bin));
        } else {
          const bin = atob(input.trim());
          const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
          setOutput(new TextDecoder().decode(bytes));
        }
      } else if (format === 'url') {
        setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
      } else if (format === 'hex') {
        if (mode === 'encode') {
          setOutput([...new TextEncoder().encode(input)].map(b => b.toString(16).padStart(2,'0')).join(''));
        } else {
          const clean = input.replace(/\s+/g, '');
          if (!/^[0-9a-f]*$/i.test(clean) || clean.length % 2) throw new Error('Invalid hex');
          const bytes = new Uint8Array(clean.length/2);
          for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.substr(i*2,2), 16);
          setOutput(new TextDecoder().decode(bytes));
        }
      }
    } catch (e) { setError(e.message); setOutput(''); }
  }, [input, format, mode]);

  const swap = () => { setMode(m => m === 'encode' ? 'decode' : 'encode'); setInput(output); };

  return (
    <div className="tui">
      <div className="tui-toolbar">
        <ToolTabs active={format} onChange={setFormat} tabs={[
          { id: 'base64', label: 'Base64' },
          { id: 'url', label: 'URL' },
          { id: 'hex', label: 'Hex' },
        ]}/>
        <div className="tui-seg">
          <button className={mode==='encode'?'on':''} onClick={() => setMode('encode')}>Encode</button>
          <button className={mode==='decode'?'on':''} onClick={() => setMode('decode')}>Decode</button>
        </div>
      </div>

      <div className="tui-enc-grid">
        <Field label={mode === 'encode' ? 'Plain text' : `${format.toUpperCase()} input`}>
          <textarea className="tui-textarea mono" rows={8} value={input} onChange={e => setInput(e.target.value)} spellCheck={false}/>
          <div className="tui-meta"><span>{input.length} chars</span></div>
        </Field>

        <div className="tui-enc-mid">
          <button className="tui-swap" onClick={swap} title="Swap input & output">
            <ShieldIcon name="arrowRight" size={14}/>
          </button>
        </div>

        <Field label={mode === 'encode' ? `${format.toUpperCase()} output` : 'Plain text'}>
          <textarea className="tui-textarea mono" rows={8} value={output} readOnly spellCheck={false}/>
          <div className="tui-meta">
            <span>{output.length} chars</span>
            <CopyBtn text={output}/>
          </div>
        </Field>
      </div>

      {error && <div className="tui-banner bad"><ShieldIcon name="alert" size={14}/> {error}</div>}
    </div>
  );
}

/* ============================================================
   Unix Timestamp Converter
   ============================================================ */
function TimestampConverter() {
  const [unix, setUnix] = useState(() => Math.floor(Date.now()/1000));
  const [iso, setIso] = useState('');
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [tick, setTick] = useState(Math.floor(Date.now()/1000));

  useEffect(() => {
    const i = setInterval(() => setTick(Math.floor(Date.now()/1000)), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const d = new Date(unix * 1000);
    if (!isNaN(d)) setIso(d.toISOString());
  }, [unix]);

  const d = new Date(unix * 1000);
  const valid = !isNaN(d);

  const formats = valid ? [
    { label: 'ISO 8601 UTC', value: d.toISOString() },
    { label: 'RFC 2822', value: d.toUTCString() },
    { label: 'Local', value: d.toString() },
    { label: 'In ' + tz, value: d.toLocaleString('en-US', { timeZone: tz, dateStyle: 'full', timeStyle: 'long' }) },
    { label: 'Unix seconds', value: String(unix) },
    { label: 'Unix ms', value: String(unix * 1000) },
    { label: 'Relative', value: relativeTime(unix, tick) },
  ] : [];

  return (
    <div className="tui">
      <div className="tui-clock">
        <div>
          <div className="tui-clock-label">Now</div>
          <div className="tui-clock-val">{tick}</div>
        </div>
        <div>
          <div className="tui-clock-label">Local</div>
          <div className="tui-clock-val">{new Date(tick*1000).toLocaleTimeString()}</div>
        </div>
        <button className="tui-btn" onClick={() => setUnix(tick)}><ShieldIcon name="zap" size={12}/> Use now</button>
      </div>

      <div className="tui-ts-grid">
        <Field label="Unix timestamp" hint="seconds">
          <input className="tui-input mono big" type="number" value={unix} onChange={e => setUnix(+e.target.value || 0)}/>
        </Field>
        <Field label="ISO / any date string">
          <input className="tui-input mono" value={iso} onChange={e => {
            setIso(e.target.value);
            const p = Date.parse(e.target.value);
            if (!isNaN(p)) setUnix(Math.floor(p/1000));
          }}/>
        </Field>
      </div>

      <Field label="Timezone">
        <select className="tui-input" value={tz} onChange={e => setTz(e.target.value)}>
          {['UTC','America/New_York','America/Los_Angeles','America/Chicago','Europe/London','Europe/Paris','Europe/Berlin','Asia/Tokyo','Asia/Singapore','Asia/Dubai','Australia/Sydney',Intl.DateTimeFormat().resolvedOptions().timeZone]
            .filter((v,i,a) => a.indexOf(v) === i).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>

      <Field label="All formats">
        <div className="tui-fmt-list">
          {formats.map(f => (
            <div key={f.label} className="tui-fmt-row">
              <span className="tui-fmt-tag">{f.label}</span>
              <code className="tui-fmt-val">{f.value}</code>
              <CopyBtn text={f.value}/>
            </div>
          ))}
        </div>
      </Field>
    </div>
  );
}

function relativeTime(unix, now) {
  const d = unix - now;
  const abs = Math.abs(d);
  const thresholds = [
    [60, 'second', 1],
    [3600, 'minute', 60],
    [86400, 'hour', 3600],
    [86400*7, 'day', 86400],
    [86400*30, 'week', 86400*7],
    [86400*365, 'month', 86400*30],
    [Infinity, 'year', 86400*365],
  ];
  for (const [lim, unit, div] of thresholds) {
    if (abs < lim) {
      const n = Math.floor(abs/div);
      return d > 0 ? `in ${n} ${unit}${n!==1?'s':''}` : `${n} ${unit}${n!==1?'s':''} ago`;
    }
  }
}

/* ============================================================
   UUID Generator
   ============================================================ */
function UUIDGenerator() {
  const [version, setVersion] = useState('v4');
  const [count, setCount] = useState(8);
  const [uppercase, setUppercase] = useState(false);
  const [braces, setBraces] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [list, setList] = useState([]);

  const gen = useCallback(() => {
    const out = [];
    for (let i = 0; i < count; i++) {
      if (version === 'v4') {
        out.push(uuidv4());
      } else if (version === 'v7') {
        out.push(uuidv7());
      } else {
        out.push(nilUuid());
      }
    }
    setList(out);
  }, [version, count]);

  useEffect(() => { gen(); }, [gen]);

  const fmt = (u) => {
    let s = hyphens ? u : u.replace(/-/g, '');
    if (uppercase) s = s.toUpperCase();
    if (braces) s = `{${s}}`;
    return s;
  };

  const joined = list.map(fmt).join('\n');

  return (
    <div className="tui">
      <div className="tui-toolbar">
        <ToolTabs active={version} onChange={setVersion} tabs={[
          { id: 'v4', label: 'UUID v4 (random)' },
          { id: 'v7', label: 'UUID v7 (time-ordered)' },
          { id: 'nil', label: 'Nil' },
        ]}/>
        <button className="tui-btn primary" onClick={gen}>
          <ShieldIcon name="sparkles" size={13}/> Regenerate
        </button>
      </div>

      <div className="tui-uuid-opts">
        <label><span>Count</span>
          <input type="range" min="1" max="64" value={count} onChange={e => setCount(+e.target.value)}/>
          <span className="val">{count}</span>
        </label>
        <label className={`tui-chk ${uppercase?'on':''}`} onClick={() => setUppercase(v => !v)}>
          <ShieldIcon name={uppercase?'check':'plus'} size={11}/> Uppercase
        </label>
        <label className={`tui-chk ${hyphens?'on':''}`} onClick={() => setHyphens(v => !v)}>
          <ShieldIcon name={hyphens?'check':'plus'} size={11}/> Hyphens
        </label>
        <label className={`tui-chk ${braces?'on':''}`} onClick={() => setBraces(v => !v)}>
          <ShieldIcon name={braces?'check':'plus'} size={11}/> Braces
        </label>
      </div>

      <div className="tui-uuid-list">
        {list.map((u, i) => (
          <div key={i} className="tui-uuid-row">
            <span className="tui-uuid-idx">{String(i+1).padStart(2,'0')}</span>
            <code>{fmt(u)}</code>
            <CopyBtn text={fmt(u)} label=""/>
          </div>
        ))}
      </div>

      <div className="tui-uuid-footer">
        <CopyBtn text={joined} label={`Copy all ${list.length}`} size="md"/>
        <button className="tui-btn" onClick={() => {
          const blob = new Blob([joined], { type: 'text/plain' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `uuids-${Date.now()}.txt`;
          a.click();
        }}><ShieldIcon name="download" size={12}/> Download .txt</button>
      </div>
    </div>
  );
}

function uuidv4() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map(x => x.toString(16).padStart(2,'0')).join('');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
function uuidv7() {
  const ts = BigInt(Date.now());
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[0] = Number((ts >> 40n) & 0xffn);
  b[1] = Number((ts >> 32n) & 0xffn);
  b[2] = Number((ts >> 24n) & 0xffn);
  b[3] = Number((ts >> 16n) & 0xffn);
  b[4] = Number((ts >> 8n) & 0xffn);
  b[5] = Number(ts & 0xffn);
  b[6] = (b[6] & 0x0f) | 0x70;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map(x => x.toString(16).padStart(2,'0')).join('');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
function nilUuid() { return '00000000-0000-0000-0000-000000000000'; }

/* ============================================================
   Password Strength Tester (password-quest)
   ============================================================ */
function PasswordStrengthTester() {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);

  const analysis = useMemo(() => analyzePassword(pw), [pw]);

  return (
    <div className="tui">
      <Field label="Password to test" hint="Never transmitted — analysis runs in this tab">
        <div className="tui-pw-input">
          <input type={show ? 'text' : 'password'} className="tui-input mono big" value={pw} onChange={e => setPw(e.target.value)} placeholder="Type or paste a password…"/>
          <button className="tui-btn" onClick={() => setShow(s => !s)}>
            <ShieldIcon name={show ? 'eyeOff' : 'eye'} size={13}/> {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </Field>

      <div className="tui-strength-panel">
        <div className="tui-strength-meter">
          <div className="tui-strength-bars">
            {[0,1,2,3,4].map(i => (
              <div key={i} className={`bar ${i < analysis.score+1 ? `on l${analysis.score}` : ''}`}/>
            ))}
          </div>
          <div className="tui-strength-label">
            <strong>{['Critical','Weak','Fair','Strong','Excellent'][analysis.score]}</strong>
            <span>{analysis.entropy.toFixed(1)} bits of entropy</span>
          </div>
        </div>

        <div className="tui-strength-stats">
          <div><span>Length</span><strong>{pw.length}</strong></div>
          <div><span>Character pool</span><strong>{analysis.pool}</strong></div>
          <div><span>Possible combinations</span><strong>{analysis.combinations}</strong></div>
          <div><span>Time to crack</span><strong>{analysis.crackTime}</strong></div>
        </div>
      </div>

      <Field label="Checks">
        <div className="tui-checklist">
          {analysis.checks.map(c => (
            <div key={c.id} className={`tui-check-row ${c.pass ? 'ok' : 'bad'}`}>
              <ShieldIcon name={c.pass ? 'check' : 'x'} size={12}/>
              <span>{c.label}</span>
              {c.detail && <em>{c.detail}</em>}
            </div>
          ))}
        </div>
      </Field>

      {analysis.tips.length > 0 && (
        <Field label="Improve it">
          <ul className="tui-tips">
            {analysis.tips.map((t,i) => <li key={i}><ShieldIcon name="zap" size={11}/> {t}</li>)}
          </ul>
        </Field>
      )}
    </div>
  );
}

function analyzePassword(pw) {
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSym = /[^a-zA-Z0-9]/.test(pw);
  const pool = (hasLower?26:0)+(hasUpper?26:0)+(hasNum?10:0)+(hasSym?32:0);
  const entropy = pw.length ? pw.length * Math.log2(Math.max(pool,1)) : 0;

  const common = ['password','123456','qwerty','letmein','admin','welcome','monkey','dragon','iloveyou'];
  const isCommon = common.some(c => pw.toLowerCase().includes(c));
  const hasRepeat = /(.)\1{2,}/.test(pw);
  const hasSequence = /(abc|bcd|cde|123|234|345|456|qwe|wer|asd)/i.test(pw);

  let score = 0;
  if (entropy >= 30) score = 1;
  if (entropy >= 50) score = 2;
  if (entropy >= 70) score = 3;
  if (entropy >= 90) score = 4;
  if (isCommon) score = Math.min(score, 1);
  if (pw.length < 8) score = 0;
  if (!pw) score = 0;

  const combos = Math.pow(pool, pw.length);
  const guesses = combos / 2;
  const gpu = 1e11; // 100B guesses/sec
  const secs = guesses / gpu;
  const crackTime = formatTime(secs);

  return {
    score, entropy, pool,
    combinations: formatBig(combos),
    crackTime: pw ? crackTime : '—',
    checks: [
      { id: 'len', label: 'At least 12 characters', pass: pw.length >= 12, detail: pw.length < 12 ? `${pw.length}/12` : null },
      { id: 'up', label: 'Contains uppercase', pass: hasUpper },
      { id: 'low', label: 'Contains lowercase', pass: hasLower },
      { id: 'num', label: 'Contains numbers', pass: hasNum },
      { id: 'sym', label: 'Contains symbols', pass: hasSym },
      { id: 'nocommon', label: 'Not a common password', pass: !isCommon },
      { id: 'norepeat', label: 'No repeated characters (xxx)', pass: !hasRepeat },
      { id: 'noseq', label: 'No obvious sequences (abc, 123)', pass: !hasSequence },
    ],
    tips: [
      pw.length < 16 && 'Add more length — length beats complexity.',
      !hasSym && 'Mix in symbols for a larger character pool.',
      isCommon && 'Avoid dictionary words and leaked passwords.',
      hasRepeat && 'Break up runs of the same character.',
    ].filter(Boolean),
  };
}

function formatBig(n) {
  if (!isFinite(n) || n > 1e21) return n.toExponential(2);
  if (n >= 1e12) return (n/1e12).toFixed(1) + 'T';
  if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
  return n.toLocaleString();
}
function formatTime(s) {
  if (!isFinite(s) || s > 1e15) return 'longer than the universe';
  if (s < 1) return 'instant';
  if (s < 60) return `${s.toFixed(0)} sec`;
  if (s < 3600) return `${(s/60).toFixed(0)} min`;
  if (s < 86400) return `${(s/3600).toFixed(0)} hours`;
  if (s < 86400*365) return `${(s/86400).toFixed(0)} days`;
  if (s < 86400*365*1000) return `${(s/86400/365).toFixed(0)} years`;
  return `${(s/86400/365/1e6).toFixed(1)} million years`;
}

/* ============================================================
   QR Code Generator
   ============================================================ */
function QRGenerator() {
  const [type, setType] = useState('url');
  const [text, setText] = useState('https://theshieldit.com');
  const [wifi, setWifi] = useState({ ssid: 'HomeNet', pass: '', enc: 'WPA' });
  const [size, setSize] = useState(240);
  const [ec, setEc] = useState('M');
  const [fg, setFg] = useState('#0f172a');
  const [bg, setBg] = useState('#ffffff');
  const canvasRef = useRef(null);

  const payload = useMemo(() => {
    if (type === 'url') return text;
    if (type === 'text') return text;
    if (type === 'wifi') return `WIFI:T:${wifi.enc};S:${wifi.ssid};P:${wifi.pass};;`;
    if (type === 'email') return `mailto:${text}`;
    return text;
  }, [type, text, wifi]);

  useEffect(() => {
    if (!canvasRef.current || !payload) return;
    drawQR(canvasRef.current, payload, { size, ec, fg, bg });
  }, [payload, size, ec, fg, bg]);

  const download = (format) => {
    const c = canvasRef.current;
    const link = document.createElement('a');
    link.download = `qr-${Date.now()}.${format}`;
    if (format === 'svg') {
      const svg = canvasToSvg(c, fg, bg);
      link.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    } else {
      link.href = c.toDataURL('image/png');
    }
    link.click();
  };

  return (
    <div className="tui">
      <ToolTabs active={type} onChange={setType} tabs={[
        { id: 'url', label: 'URL', icon: 'link' },
        { id: 'text', label: 'Text', icon: 'code' },
        { id: 'wifi', label: 'Wi-Fi', icon: 'zap' },
        { id: 'email', label: 'Email', icon: 'mail' },
      ]}/>

      <div className="tui-qr-grid">
        <div className="tui-qr-preview" style={{ background: bg }}>
          <canvas ref={canvasRef} width={size*2} height={size*2} style={{ width: size, height: size, imageRendering: 'pixelated' }}/>
        </div>

        <div className="tui-qr-form">
          {type === 'wifi' ? (
            <>
              <Field label="Network name (SSID)">
                <input className="tui-input" value={wifi.ssid} onChange={e => setWifi(w => ({...w, ssid: e.target.value}))}/>
              </Field>
              <Field label="Password">
                <input className="tui-input" value={wifi.pass} onChange={e => setWifi(w => ({...w, pass: e.target.value}))}/>
              </Field>
              <Field label="Encryption">
                <div className="tui-seg">
                  {['WPA','WEP','nopass'].map(e => (
                    <button key={e} className={wifi.enc===e?'on':''} onClick={() => setWifi(w => ({...w, enc: e}))}>{e}</button>
                  ))}
                </div>
              </Field>
            </>
          ) : (
            <Field label={type === 'email' ? 'Email address' : type === 'url' ? 'URL' : 'Text'}>
              <textarea className="tui-textarea" rows={3} value={text} onChange={e => setText(e.target.value)}/>
            </Field>
          )}

          <div className="tui-qr-opts">
            <Field label="Size">
              <input type="range" min="120" max="400" step="20" value={size} onChange={e => setSize(+e.target.value)}/>
              <div className="tui-meta"><span>{size}×{size} px</span></div>
            </Field>
            <Field label="Error correction" hint="Higher tolerates more damage">
              <div className="tui-seg">
                {['L','M','Q','H'].map(v => (
                  <button key={v} className={ec===v?'on':''} onClick={() => setEc(v)}>{v}</button>
                ))}
              </div>
            </Field>
          </div>

          <div className="tui-qr-colors">
            <label><span>Foreground</span><input type="color" value={fg} onChange={e => setFg(e.target.value)}/></label>
            <label><span>Background</span><input type="color" value={bg} onChange={e => setBg(e.target.value)}/></label>
          </div>

          <div className="tui-qr-actions">
            <button className="tui-btn primary" onClick={() => download('png')}><ShieldIcon name="download" size={12}/> PNG</button>
            <button className="tui-btn" onClick={() => download('svg')}><ShieldIcon name="download" size={12}/> SVG</button>
            <CopyBtn text={payload} label="Copy payload"/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* QR encoder — uses window.qrcode from the qrcode-generator library loaded via CDN */
function drawQR(canvas, text, { size, ec, fg, bg }) {
  if (!window.qrcode) return;
  let typeNumber = 0;
  let qr;
  try {
    qr = window.qrcode(typeNumber, ec);
    qr.addData(text);
    qr.make();
  } catch {
    // Retry with higher version
    qr = window.qrcode(10, ec);
    qr.addData(text);
    qr.make();
  }
  const mod = qr.getModuleCount();
  const scale = Math.floor(size*2 / (mod + 2));
  const pad = Math.floor((size*2 - mod*scale)/2);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = fg;
  for (let y = 0; y < mod; y++) {
    for (let x = 0; x < mod; x++) {
      if (qr.isDark(y, x)) ctx.fillRect(pad + x*scale, pad + y*scale, scale, scale);
    }
  }
}
function canvasToSvg(canvas, fg, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width/2}" height="${canvas.height/2}"><image href="${canvas.toDataURL()}" width="${canvas.width/2}" height="${canvas.height/2}"/></svg>`;
}

Object.assign(window, {
  HashGenerator, JWTDecoder, EncoderTool, TimestampConverter, UUIDGenerator,
  PasswordStrengthTester, QRGenerator,
});

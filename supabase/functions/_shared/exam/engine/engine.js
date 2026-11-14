// @ts-nocheck
// DISALIN OTOMATIS oleh scripts/sync-exam.mjs dari src/. Jangan diedit di sini.
/* Jagoan Excel — mesin rumus: parser, evaluator, array dinamis (spill), ±150 fungsi */

const EPOCH=Date.UTC(1899,11,30);
class XErr{constructor(code,msg){this.code=code;this.msg=msg||''}}
const isErr=v=>v instanceof XErr;
const isArr=v=>!!(v&&v.range);
const arr=rows=>({range:true,rows});
function colName(i){let s='';i++;while(i>0){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26)}return s}
function colIndex(s){let n=0;for(const ch of s)n=n*26+(ch.charCodeAt(0)-64);return n-1}
function splitRef(r){const m=/^\$?([A-Z]+)\$?(\d+)$/.exec(String(r).toUpperCase());return m?{c:colIndex(m[1]),r:+m[2]}:null}
/* Batas ukuran supaya rumus iseng (misalnya A1:Z200000 atau SEQUENCE(1e7)) tidak membuat browser macet */
const MAX_CELLS=100000;
function sizeOk(r,c,fn){if(r*c>MAX_CELLS)throw new XErr('#NUM!',(fn?fn+': ':'')+'hasilnya terlalu besar (maksimal '+MAX_CELLS.toLocaleString('id-ID')+' sel)')}
function expandRange(a,b){const p=splitRef(a),q=splitRef(b),out=[];const c1=Math.min(p.c,q.c),c2=Math.max(p.c,q.c),r1=Math.min(p.r,q.r),r2=Math.max(p.r,q.r);sizeOk(r2-r1+1,c2-c1+1,'Rentang');
  for(let r=r1;r<=r2;r++){const row=[];for(let c=c1;c<=c2;c++)row.push(colName(c)+r);out.push(row)}return out}
const toSerial=(y,m,d)=>Math.round((Date.UTC(y,m-1,d)-EPOCH)/864e5);
const fromSerial=s=>{const t=new Date(EPOCH+Math.floor(s)*864e5);return{y:t.getUTCFullYear(),m:t.getUTCMonth()+1,d:t.getUTCDate(),w:t.getUTCDay()}};
const D=toSerial;
const BULAN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const HARI=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

/* ---------- tokenizer & parser ---------- */
function tokenize(src){
  const t=[];let i=0;
  // Gaya regional Indonesia: argumen dipisah titik koma dan desimal memakai koma, misalnya =ROUND(2,5;0).
  // Koma desimal hanya dikenali kalau rumus memakai titik koma dan tidak berisi konstanta array {…}.
  const bare=src.replace(/"(?:[^"]|"")*"/g,'');const decComma=bare.includes(';')&&!bare.includes('{');
  while(i<src.length){
    const c=src[i];
    if(/\s/.test(c)){i++;continue}
    if(c==='"'){let j=i+1,s='';
      while(j<src.length){if(src[j]==='"'){if(src[j+1]==='"'){s+='"';j+=2;continue}break}s+=src[j++]}
      if(j>=src.length)throw new XErr('#ERROR!','Tanda kutip ganda belum ditutup');
      t.push({type:'str',v:s});i=j+1;continue}
    const rest=src.slice(i);let m;
    // rentang satu kolom penuh, misalnya F:F atau $A:$C
    if((m=/^\$?[A-Za-z]{1,3}:\$?[A-Za-z]{1,3}(?![A-Za-z0-9_(.!])/.exec(rest))){t.push({type:'ref',v:m[0].toUpperCase().replace(/\$/g,'')});i+=m[0].length;continue}
    if((m=/^\$?[A-Za-z]{1,3}\$?\d+(:\$?[A-Za-z]{1,3}\$?\d+)?(?![A-Za-z0-9_(.])/.exec(rest))){t.push({type:'ref',v:m[0].toUpperCase().replace(/\$/g,'')});i+=m[0].length;continue}
    if(decComma&&(m=/^\d+,\d+/.exec(rest))){t.push({type:'num',v:parseFloat(m[0].replace(',','.'))});i+=m[0].length;continue}
    if((m=/^\d+(\.\d+)?([eE][+-]?\d+)?/.exec(rest))||(m=/^\.\d+/.exec(rest))){t.push({type:'num',v:parseFloat(m[0])});i+=m[0].length;continue}
    if((m=/^[A-Za-z_][A-Za-z0-9_.]*/.exec(rest))){t.push({type:'id',v:m[0].toUpperCase()});i+=m[0].length;continue}
    if((m=/^(<=|>=|<>)/.exec(rest))){t.push({type:'op',v:m[0]});i+=2;continue}
    if(c===','||c===';'){t.push({type:'sep',v:c});i++;continue}
    if(c==='{'||c==='}'){t.push({type:'op',v:c});i++;continue}
    if('+-*/^&=<>%()'.includes(c)){t.push({type:'op',v:c});i++;continue}
    throw new XErr('#ERROR!','Karakter "'+c+'" tidak dikenali');
  }
  return t;
}
function parse(src){
  const toks=tokenize(src);let p=0;
  const peek=()=>toks[p];
  const isOp=v=>toks[p]&&toks[p].type==='op'&&toks[p].v===v;
  const opIn=list=>toks[p]&&toks[p].type==='op'&&list.includes(toks[p].v);
  const bin=(next,list)=>()=>{let l=next();while(opIn(list)){const o=toks[p++].v;l={t:'bin',o,l,r:next()}}return l};
  let unary;
  const pow=()=>{let l=unary();while(isOp('^')){p++;l={t:'bin',o:'^',l,r:unary()}}return l};
  const mul=bin(pow,['*','/']),add=bin(mul,['+','-']),cat=bin(add,['&']),cmp=bin(cat,['=','<>','<','>','<=','>=']);
  unary=()=>{if(isOp('-')){p++;return{t:'neg',x:unary()}}if(isOp('+')){p++;return unary()}let x=primary();while(isOp('%')){p++;x={t:'pct',x}}return x};
  function parseArgs(){const args=[];
    if(isOp(')')){p++;return args}
    while(true){
      if(!peek())throw new XErr('#ERROR!','Kurung tutup ")" belum ada');
      if(peek().type==='sep'||isOp(')')){args.push({t:'blank'})}else args.push(cmp());
      if(peek()&&peek().type==='sep'){p++;if(isOp(')')){args.push({t:'blank'});p++;break}continue}
      if(isOp(')')){p++;break}
      throw new XErr('#ERROR!',peek()?'Argumen perlu dipisah dengan koma atau titik koma':'Kurung tutup ")" belum ada');
    }
    return args}
  function primary(){
    const k=toks[p++];
    if(!k)throw new XErr('#ERROR!','Rumus belum lengkap');
    if(k.type==='num'||k.type==='str')return{t:'val',v:k.v};
    if(k.type==='ref'){if(k.v.includes(':')){const[a,b]=k.v.split(':');return{t:'range',a,b}}return{t:'ref',k:k.v}}
    if(k.type==='id'){
      if(isOp('(')){p++;let node={t:'fn',n:k.v,args:parseArgs()};
        while(isOp('(')){p++;node={t:'call',f:node,args:parseArgs()}}
        return node}
      if(k.v==='TRUE'||k.v==='FALSE')return{t:'val',v:k.v==='TRUE'};
      return{t:'name',n:k.v};
    }
    if(k.type==='op'&&k.v==='{'){const rows=[[]];
      while(true){const t=toks[p++];if(!t)throw new XErr('#ERROR!','Kurung kurawal "}" belum ada');
        let v;if(t.type==='num'||t.type==='str')v=t.v;else if(t.type==='id'&&(t.v==='TRUE'||t.v==='FALSE'))v=t.v==='TRUE';else if(t.type==='op'&&t.v==='-'&&toks[p]&&toks[p].type==='num')v=-toks[p++].v;else throw new XErr('#ERROR!','Isi konstanta array hanya boleh angka, teks, atau TRUE/FALSE');
        rows[rows.length-1].push(v);const n=toks[p++];
        if(n&&n.type==='op'&&n.v==='}')break;
        if(n&&n.type==='sep'){if(n.v===';')rows.push([]);continue}
        throw new XErr('#ERROR!','Kurung kurawal "}" belum ada')}
      if(rows.some(r=>r.length!==rows[0].length))throw new XErr('#VALUE!','Setiap baris konstanta array harus sama panjang');
      return{t:'arr',v:rows}}
    if(k.type==='op'&&k.v==='('){const e=cmp();if(!isOp(')'))throw new XErr('#ERROR!','Kurung tutup ")" belum ada');p++;return e}
    if(k.type==='sep')throw new XErr('#ERROR!','Ada pemisah argumen di luar fungsi');
    throw new XErr('#ERROR!','"'+k.v+'" tidak berada di tempat yang tepat');
  }
  const ast=cmp();
  if(p<toks.length){const k=toks[p];throw new XErr('#ERROR!',k.type==='op'&&k.v===')'?'Ada kurung tutup yang berlebih':'Ada bagian rumus yang tidak tersambung, mungkin kurang operator')}
  return ast;
}

/* ---------- coercion ---------- */
function one(v){if(isArr(v)){if(v.rows.length===1&&v.rows[0].length===1)return v.rows[0][0];throw new XErr('#VALUE!','Bagian ini butuh satu nilai, bukan rentang. Bungkus rentang dengan fungsi seperti SUM(…)')}return v}
function num(v){
  v=one(v);
  if(isErr(v))throw v;
  if(v==null)return 0;
  if(typeof v==='boolean')return v?1:0;
  if(typeof v==='number')return v;
  const s=String(v).trim();if(s!==''&&!isNaN(Number(s)))return Number(s);
  const tm=/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s);if(tm)return(+tm[1]*3600+ +tm[2]*60+ +(tm[3]||0))/86400;
  throw new XErr('#VALUE!','"'+v+'" adalah teks, jadi tidak bisa dihitung sebagai angka');
}
function text(v){v=one(v);if(isErr(v))throw v;if(v==null)return'';if(typeof v==='boolean')return v?'TRUE':'FALSE';if(typeof v==='number')return String(+v.toPrecision(15));return String(v)}
const rank=v=>typeof v==='number'?0:typeof v==='string'?1:2;
function cmpVals(a,b){
  if(a==null)a=typeof b==='string'?'':typeof b==='boolean'?false:0;
  if(b==null)b=typeof a==='string'?'':typeof a==='boolean'?false:0;
  if(rank(a)!==rank(b))return rank(a)-rank(b);
  if(typeof a==='string'){a=a.toLowerCase();b=b.toLowerCase()}
  return a<b?-1:a>b?1:0;
}
function truthy(v){v=one(v);if(isErr(v))throw v;if(typeof v==='string'){const u=v.toUpperCase();if(u==='TRUE')return true;if(u==='FALSE')return false;throw new XErr('#VALUE!','Kondisi harus menghasilkan TRUE atau FALSE')}return num(v)!==0}
function roundTo(x,n,mode){const f=Math.pow(10,Math.trunc(n));const y=Math.abs(x)*f;const r=mode==='up'?Math.ceil(y-1e-9):mode==='down'?Math.floor(y+1e-9):Math.round(y+1e-9);return Math.sign(x)*r/f}
function wild(s){return new RegExp('^'+s.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$','i')}
function makeCrit(c){
  if(isArr(c))c=c.rows[0][0];
  if(isErr(c))throw c;
  if(typeof c==='number')return v=>typeof v==='number'&&v===c;
  if(typeof c==='boolean')return v=>v===c;
  const m=/^(<=|>=|<>|<|>|=)?([\s\S]*)$/.exec(String(c??''));const op=m[1]||'=',rhs=m[2];
  const n=rhs.trim()!==''&&!isNaN(Number(rhs))?Number(rhs):null;const re=wild(rhs);
  return v=>{
    if(n!==null){if(typeof v!=='number')return op==='<>';return{'=':v===n,'<>':v!==n,'<':v<n,'>':v>n,'<=':v<=n,'>=':v>=n}[op]}
    const t=v==null?'':typeof v==='string'?v:null;
    if(op==='=')return rhs===''?t==='':t!==null&&re.test(t);
    if(op==='<>')return rhs===''?t!=='':!(t!==null&&re.test(t));
    if(!t)return false;const a=t.toLowerCase(),b=rhs.toLowerCase();return{'<':a<b,'>':a>b,'<=':a<=b,'>=':a>=b}[op];
  };
}
function needRange(a,fn){if(!isArr(a)){if(isErr(a))throw a;if(a&&typeof a==='object')throw new XErr('#VALUE!',fn+' membutuhkan rentang sel, misalnya A2:A7');return arr([[a]])}return a}
function nums(args){const out=[];for(const a of args){if(a===undefined)continue;if(isArr(a)){for(const v of a.rows.flat()){if(isErr(v))throw v;if(typeof v==='number')out.push(v)}}else out.push(num(a))}return out}
function flat(args){const out=[];for(const a of args){if(a===undefined)continue;if(isArr(a))out.push(...a.rows.flat());else out.push(a)}return out}
function argc(args,min,max,fn){if(args.length<min||args.length>max)throw new XErr('#ERROR!',fn+' perlu '+(min===max?min:max>=99?'minimal '+min:min+' sampai '+max)+' argumen, sedangkan rumusmu berisi '+args.length)}
const opt=(a,i,d)=>a[i]===undefined?d:a[i];
function multiCond(args,start,fn){
  const pairs=[];for(let i=start;i<args.length;i+=2){const r=needRange(args[i],fn);pairs.push([r,makeCrit(args[i+1])])}
  const h=pairs[0][0].rows.length,w=pairs[0][0].rows[0].length;
  for(const[r]of pairs)if(r.rows.length!==h||r.rows[0].length!==w)throw new XErr('#VALUE!','Semua rentang di '+fn+' harus berukuran sama');
  return(i,j)=>pairs.every(([r,t])=>t(r.rows[i][j]));
}
function collect(sumR,ok){const out=[];sumR.rows.forEach((row,i)=>row.forEach((x,j)=>{if(ok(i,j)){if(isErr(x))throw x;if(typeof x==='number')out.push(x)}}));return out}
const sumOf=a=>a.reduce((s,x)=>s+x,0);
function aligned(r,s){return arr(r.rows.map((row,i)=>row.map((_,j)=>s.rows[i]?s.rows[i][j]:null)))}
function lookupList(r){return r.rows.length===1?r.rows[0]:r.rows.map(x=>x[0])}
function findExact(list,v){return list.findIndex(x=>x!=null&&rank(x)===rank(v)&&(typeof v==='string'?wild(v).test(x):cmpVals(x,v)===0))}
/** XLOOKUP/XMATCH: mm 0 persis, -1 persis atau lebih kecil terdekat, 1 persis atau lebih besar terdekat, 2 wildcard; sm 1 dari atas, -1 dari bawah */
function xfind(list,v,mm,sm){mm=Math.trunc(num(mm??0));sm=Math.trunc(num(sm??1));
  const idx=list.map((_,i)=>i);if(sm<0)idx.reverse();
  if(mm===0||mm===2){for(const i of idx){const x=list[i];if(x!=null&&rank(x)===rank(v)&&(typeof v==='string'?wild(v).test(x):cmpVals(x,v)===0))return i}return -1}
  let best=-1;for(const i of idx){const x=list[i];if(x==null||rank(x)!==rank(v))continue;const c=cmpVals(x,v);if(c===0)return i;
    if(mm<0?c<0:c>0){if(best<0||(mm<0?cmpVals(x,list[best])>0:cmpVals(x,list[best])<0))best=i}}
  return best}
const ymd=s=>fromSerial(num(s));
function isWorkday(s,hol){const w=fromSerial(s).w;return w!==0&&w!==6&&!hol.has(s)}
function holidays(a){const h=new Set();if(a!==undefined)for(const v of flat([a])){if(typeof v==='number')h.add(Math.floor(v));else if(typeof v==='string'&&v.trim()){try{h.add(Math.floor(FN.DATEVALUE([v])))}catch(e){}}}return h}
function eomonth(s,m){const p=fromSerial(s);return toSerial(p.y,p.m+m+1,0)}
function edate(s,m){const p=fromSerial(s);const last=new Date(Date.UTC(p.y,p.m-1+m+1,0)).getUTCDate();return toSerial(p.y,p.m+m,Math.min(p.d,last))}
function fmtNumber(x,fmt){
  // supports 0, 0.00, #,##0, #,##0.00, 0%, 0.0% with Indonesian separators in output
  const pct=/%/.test(fmt);if(pct)x=x*100;
  const dec=(fmt.split('.')[1]||'').replace(/[^0#]/g,'').length;
  const group=/,/.test(fmt.split('.')[0]);
  const s=Math.abs(x).toFixed(dec);let[i,d]=s.split('.');
  if(group)i=i.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  return(x<0?'-':'')+i+(d?','+d:'')+(pct?'%':'');
}
// Kode format angka gaya Excel: bagian positif;negatif;nol;teks, [Warna], "literal", \x, _x, *x,
// 0 # ? . , % serta koma di akhir untuk membagi ribuan (#,##0,, = juta). Keluaran memakai pemisah Indonesia.
function splitSections(f){const out=[];let cur='',q=false,b=false;for(let i=0;i<f.length;i++){const c=f[i];
  if(c==='"'&&!b)q=!q;else if(c==='['&&!q)b=true;else if(c===']'&&!q)b=false;else if(c==='\\'&&!q){cur+=c+(f[i+1]||'');i++;continue}
  if(c===';'&&!q&&!b){out.push(cur);cur='';continue}cur+=c}out.push(cur);return out}
function litText(t){let o='';for(let i=0;i<t.length;i++){const c=t[i];if(c==='"'){const j=t.indexOf('"',i+1);o+=t.slice(i+1,j<0?t.length:j);i=j<0?t.length:j}
  else if(c==='\\'){o+=t[i+1]||'';i++}else if(c==='_'){o+=' ';i++}else if(c==='*'){i++}else o+=c}return o}
function fmtCode(v,f){
  f=String(f);const secs=splitSections(f);const isText=typeof v==='string'&&(v===''||isNaN(Number(v)));
  let sec,x=typeof v==='number'?v:Number(v),neg=false;
  if(isText){sec=secs.length>=4?secs[3]:secs.find(t=>t.includes('@'));if(sec===undefined)return{t:String(v),color:null}}
  else if(secs.length===1||x>0||(x===0&&secs.length<3))sec=secs[0];
  else if(x<0){sec=secs[1]===undefined||secs[1]===''?secs[0]:secs[1];neg=sec===secs[0];x=sec===secs[0]?x:Math.abs(x)}
  else sec=secs[2];
  let color=null;sec=sec.replace(/\[([^\]]*)\]/g,(m,c)=>{if(/^(red|blue|green|black|white|yellow|magenta|cyan|merah|biru|hijau)$/i.test(c))color=c.toLowerCase();return''});
  if(isText)return{t:litText(sec.replace(/@/g,'\u0000')).replace(/\u0000/g,String(v)),color};
  const plain=sec.replace(/"[^"]*"|\\./g,'');
  if(!/[0#?]/.test(plain)&&/[dmyhs]/i.test(plain)){
    const p=fromSerial(x);
    const t=sec.replace(/"[^"]*"|yyyy|yy|mmmm|mmm|mm|m|dddd|ddd|dd|d/gi,k=>{if(k[0]==='"')return k;const t=k.toLowerCase();
      return String({yyyy:p.y,yy:String(p.y).slice(2),mmmm:BULAN[p.m-1],mmm:BULAN[p.m-1].slice(0,3),mm:String(p.m).padStart(2,'0'),m:p.m,dddd:HARI[p.w],ddd:HARI[p.w].slice(0,3),dd:String(p.d).padStart(2,'0'),d:p.d}[t])});
    return{t:litText(t),color};
  }
  if(!/[0#?]/.test(plain))return{t:litText(sec)+(neg&&x<0?'':''),color};
  // cari inti angka (di luar tanda kutip)
  let a=-1,bEnd=-1,q=false;for(let i=0;i<sec.length;i++){const c=sec[i];if(c==='"'){q=!q;continue}if(q)continue;if(c==='\\'){i++;continue}if('0#?'.includes(c)){if(a<0)a=i;bEnd=i}}
  let core=sec.slice(a,bEnd+1),pre=sec.slice(0,a),suf=sec.slice(bEnd+1);
  let scale=0;while(suf[0]===','){scale++;suf=suf.slice(1)}
  if(/%/.test(plain))x*=100;x/=Math.pow(1000,scale);
  const [ip,dp='']=core.split('.');const grp=ip.includes(',');const minInt=(ip.match(/0/g)||[]).length;
  const dAll=(dp.match(/[0#?]/g)||[]).length,dMin=(dp.match(/0/g)||[]).length;
  let str=Math.abs(x).toFixed(dAll);let [I,D='']=str.split('.');
  while(D.length>dMin&&D.endsWith('0'))D=D.slice(0,-1);
  if(I==='0'&&minInt===0)I='';
  if(/[^0#?,]/.test(ip)){ // literal di tengah pola, mis. 00-00: isi digit dari kanan
    const ph=(ip.match(/[0#?]/g)||[]).length;let dg=I.padStart(minInt,'0'),out='',k=dg.length;
    for(let i=ip.length-1;i>=0;i--){const c=ip[i];if('0#?'.includes(c)){out=(k>0?dg[--k]:(c==='0'?'0':''))+out}else if(c!==',')out=c+out}
    I=(k>0?dg.slice(0,k):'')+out;void ph;
  }else{I=I.padStart(minInt,'0');if(grp)I=I.replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
  const body=I+(D||(dp.includes('0')&&dMin)?','+D:'');
  const sign=x<0&&(neg||secs.length===1)&&Number(body.replace(/\./g,'').replace(',','.'))!==0?'-':'';
  return{t:sign+litText(pre)+body+litText(suf),color};
}
function TEXTfmt(v,f){if(typeof v!=='string'||v.trim()===''||isNaN(Number(v)))return fmtCode(typeof v==='boolean'?(v?1:0):v,f).t;return fmtCode(num(v),f).t}
function npv(r,flows){return flows.reduce((s,c,i)=>s+c/Math.pow(1+r,i+1),0)}
function irr(flows,guess){
  let r=guess??0.1;
  for(let k=0;k<100;k++){let f=0,d=0;flows.forEach((c,i)=>{f+=c/Math.pow(1+r,i);d+=-i*c/Math.pow(1+r,i+1)});
    if(Math.abs(d)<1e-12)break;const nr=r-f/d;if(Math.abs(nr-r)<1e-12){r=nr;return r}r=nr}
  if(!isFinite(r))throw new XErr('#NUM!','IRR tidak menemukan jawaban');return r;
}
function sortRows(rows,idx,order){return rows.slice().sort((a,b)=>{const c=cmpVals(a[idx],b[idx]);return order<0?-c:c})}


const fracSec=v=>Math.round((v-Math.floor(v))*86400)%86400;
function asArr(v){return isArr(v)?v:arr([[v]])}
const NESTED_Q=/\((?:[^()\\]|\\.)*[+*}](?:[^()\\]|\\.)*\)\s*[+*{]/;
function rx(p,cs,g){const pat=text(p);if(pat.length>200)throw new XErr('#VALUE!','Pola regex terlalu panjang (maksimal 200 karakter)');
  if(NESTED_Q.test(pat))throw new XErr('#VALUE!','Pola regex dengan pengulangan bersarang seperti (a+)+ tidak didukung karena bisa sangat lambat');const ci=cs!==undefined&&num(cs)===1;try{return new RegExp(pat,(g||'')+(ci?'i':''))}catch(e){throw new XErr('#VALUE!','Pola regex tidak valid: '+pat)}}
function ipmt(r,per,n,pv,fv,t){const pmt=FN.PMT([r,n,pv,fv,t]);if(per<1||per>n)throw new XErr('#NUM!','Periode di luar tenor');if(t===1&&per===1)return 0;
  const k=t===1?per-2:per-1;const bal=r===0?-(pv+pmt*k):-(pv*Math.pow(1+r,k)+pmt*(1+r*t)*(Math.pow(1+r,k)-1)/r);return bal*r}
/* ---------- functions ---------- */
const FN={
  SUM:a=>sumOf(nums(a)),
  PRODUCT:a=>nums(a).reduce((s,x)=>s*x,1),
  SUMPRODUCT:a=>{const rs=a.map(x=>isArr(x)?x:arr([[x]]));const h=rs[0].rows.length,w=rs[0].rows[0].length;
    for(const r of rs)if(r.rows.length!==h||r.rows[0].length!==w)throw new XErr('#VALUE!','Semua rentang di SUMPRODUCT harus berukuran sama');
    let s=0;for(let i=0;i<h;i++)for(let j=0;j<w;j++){let p=1;for(const r of rs){const v=r.rows[i][j];if(isErr(v))throw v;p*=typeof v==='number'?v:typeof v==='boolean'?(v?1:0):0}s+=p}return s},
  AVERAGE:a=>{const n=nums(a);if(!n.length)throw new XErr('#DIV/0!','Tidak ada angka untuk dirata-rata');return sumOf(n)/n.length},
  MIN:a=>{const n=nums(a);return n.length?Math.min(...n):0},
  MAX:a=>{const n=nums(a);return n.length?Math.max(...n):0},
  MEDIAN:a=>{const n=nums(a).sort((x,y)=>x-y);if(!n.length)throw new XErr('#NUM!','Tidak ada angka');const h=n.length>>1;return n.length%2?n[h]:(n[h-1]+n[h])/2},
  MODE:a=>{const n=nums(a),c=new Map();let best=null,bc=1;for(const x of n){const k=(c.get(x)||0)+1;c.set(x,k);if(k>bc){bc=k;best=x}}if(best===null)throw new XErr('#N/A','Tidak ada angka yang muncul lebih dari sekali');return best},
  'MODE.SNGL':a=>FN.MODE(a),
  LARGE:a=>{argc(a,2,2,'LARGE');const n=nums([a[0]]).sort((x,y)=>y-x),k=Math.trunc(num(a[1]));if(k<1||k>n.length)throw new XErr('#NUM!','Urutan ke-'+k+' di luar jumlah data ('+n.length+')');return n[k-1]},
  SMALL:a=>{argc(a,2,2,'SMALL');const n=nums([a[0]]).sort((x,y)=>x-y),k=Math.trunc(num(a[1]));if(k<1||k>n.length)throw new XErr('#NUM!','Urutan ke-'+k+' di luar jumlah data ('+n.length+')');return n[k-1]},
  STDEV:a=>{const n=nums(a);if(n.length<2)throw new XErr('#DIV/0!','Butuh minimal dua angka');const m=sumOf(n)/n.length;return Math.sqrt(sumOf(n.map(x=>(x-m)**2))/(n.length-1))},
  'STDEV.S':a=>FN.STDEV(a),
  COUNT:a=>flat(a).filter(v=>typeof v==='number').length,
  COUNTA:a=>flat(a).filter(v=>v!=null&&v!=='').length,
  COUNTBLANK:a=>flat(a).filter(v=>v==null||v==='').length,
  COUNTIF:a=>{argc(a,2,2,'COUNTIF');const r=needRange(a[0],'COUNTIF'),t=makeCrit(a[1]);return r.rows.flat().filter(t).length},
  SUMIF:a=>{argc(a,2,3,'SUMIF');const r=needRange(a[0],'SUMIF'),t=makeCrit(a[1]),s=a[2]!==undefined?needRange(a[2],'SUMIF'):r;return sumOf(collect(aligned(r,s),(i,j)=>t(r.rows[i][j])))},
  AVERAGEIF:a=>{argc(a,2,3,'AVERAGEIF');const r=needRange(a[0],'AVERAGEIF'),t=makeCrit(a[1]),s=a[2]!==undefined?needRange(a[2],'AVERAGEIF'):r;const n=collect(aligned(r,s),(i,j)=>t(r.rows[i][j]));if(!n.length)throw new XErr('#DIV/0!','Tidak ada baris yang cocok dengan kriteria');return sumOf(n)/n.length},
  SUMIFS:a=>{if(a.length<3||a.length%2===0)throw new XErr('#ERROR!','SUMIFS perlu rentang jumlah, lalu pasangan rentang dan kriteria');return sumOf(collect(needRange(a[0],'SUMIFS'),multiCond(a,1,'SUMIFS')))},
  AVERAGEIFS:a=>{if(a.length<3||a.length%2===0)throw new XErr('#ERROR!','AVERAGEIFS perlu rentang rata-rata, lalu pasangan rentang dan kriteria');const n=collect(needRange(a[0],'AVERAGEIFS'),multiCond(a,1,'AVERAGEIFS'));if(!n.length)throw new XErr('#DIV/0!','Tidak ada baris yang cocok');return sumOf(n)/n.length},
  MAXIFS:a=>{if(a.length<3||a.length%2===0)throw new XErr('#ERROR!','MAXIFS perlu rentang nilai, lalu pasangan rentang dan kriteria');const n=collect(needRange(a[0],'MAXIFS'),multiCond(a,1,'MAXIFS'));return n.length?Math.max(...n):0},
  MINIFS:a=>{if(a.length<3||a.length%2===0)throw new XErr('#ERROR!','MINIFS perlu rentang nilai, lalu pasangan rentang dan kriteria');const n=collect(needRange(a[0],'MINIFS'),multiCond(a,1,'MINIFS'));return n.length?Math.min(...n):0},
  COUNTIFS:a=>{if(a.length<2||a.length%2)throw new XErr('#ERROR!','COUNTIFS perlu pasangan rentang dan kriteria');const ok=multiCond(a,0,'COUNTIFS');let n=0;a[0].rows.forEach((row,i)=>row.forEach((_,j)=>{if(ok(i,j))n++}));return n},
  RANK:a=>{argc(a,2,3,'RANK');const x=num(a[0]),list=nums([needRange(a[1],'RANK')]),asc=a[2]!==undefined&&num(a[2])!==0;
    if(!list.includes(x))throw new XErr('#N/A','Angka '+text(x)+' tidak ada di rentang pembanding');return 1+list.filter(v=>asc?v<x:v>x).length},
  'RANK.EQ':a=>FN.RANK(a),
  SUBTOTAL:a=>{argc(a,2,99,'SUBTOTAL');const f=num(a[0])%100,map={1:'AVERAGE',2:'COUNT',3:'COUNTA',4:'MAX',5:'MIN',6:'PRODUCT',9:'SUM'};if(!map[f])throw new XErr('#VALUE!','Kode fungsi SUBTOTAL yang didukung: 1–6 dan 9');return FN[map[f]](a.slice(1))},
  AND:a=>{if(!a.length)throw new XErr('#ERROR!','AND perlu minimal satu kondisi');return flat(a).filter(v=>v!=null).every(truthy)},
  OR:a=>{if(!a.length)throw new XErr('#ERROR!','OR perlu minimal satu kondisi');return flat(a).filter(v=>v!=null).some(truthy)},
  NOT:a=>{argc(a,1,1,'NOT');return!truthy(a[0])},
  ROUND:a=>{argc(a,1,2,'ROUND');return roundTo(num(a[0]),num(opt(a,1,0)))},
  ROUNDUP:a=>{argc(a,1,2,'ROUNDUP');return roundTo(num(a[0]),num(opt(a,1,0)),'up')},
  ROUNDDOWN:a=>{argc(a,1,2,'ROUNDDOWN');return roundTo(num(a[0]),num(opt(a,1,0)),'down')},
  MROUND:a=>{argc(a,2,2,'MROUND');const m=num(a[1]);if(m===0)return 0;return roundTo(num(a[0])/m,0)*m},
  CEILING:a=>{argc(a,1,2,'CEILING');const m=num(opt(a,1,1));return m===0?0:Math.ceil(num(a[0])/m-1e-9)*m},
  'CEILING.MATH':a=>FN.CEILING(a),
  FLOOR:a=>{argc(a,1,2,'FLOOR');const m=num(opt(a,1,1));return m===0?0:Math.floor(num(a[0])/m+1e-9)*m},
  'FLOOR.MATH':a=>FN.FLOOR(a),
  INT:a=>{argc(a,1,1,'INT');return Math.floor(num(a[0]))},
  ABS:a=>{argc(a,1,1,'ABS');return Math.abs(num(a[0]))},
  SQRT:a=>{argc(a,1,1,'SQRT');const x=num(a[0]);if(x<0)throw new XErr('#NUM!','Akar dari angka negatif');return Math.sqrt(x)},
  POWER:a=>{argc(a,2,2,'POWER');return Math.pow(num(a[0]),num(a[1]))},
  MOD:a=>{argc(a,2,2,'MOD');const d=num(a[1]);if(d===0)throw new XErr('#DIV/0!','Pembagian dengan nol');const x=num(a[0]);return x-d*Math.floor(x/d)},
  CONCAT:a=>flat(a).map(text).join(''),
  CONCATENATE:a=>flat(a).map(text).join(''),
  TEXTJOIN:a=>{argc(a,3,99,'TEXTJOIN');const d=text(a[0]),skip=truthy(a[1]);return flat(a.slice(2)).map(text).filter(s=>!skip||s!=='').join(d)},
  UPPER:a=>{argc(a,1,1,'UPPER');return text(a[0]).toUpperCase()},
  LOWER:a=>{argc(a,1,1,'LOWER');return text(a[0]).toLowerCase()},
  PROPER:a=>{argc(a,1,1,'PROPER');return text(a[0]).toLowerCase().replace(/(^|[^a-zà-ÿ])([a-zà-ÿ])/g,(m,x,y)=>x+y.toUpperCase())},
  LEN:a=>{argc(a,1,1,'LEN');return text(a[0]).length},
  TRIM:a=>{argc(a,1,1,'TRIM');return text(a[0]).trim().replace(/ +/g,' ')},
  LEFT:a=>{argc(a,1,2,'LEFT');return text(a[0]).slice(0,num(opt(a,1,1)))},
  RIGHT:a=>{argc(a,1,2,'RIGHT');const s=text(a[0]),n=num(opt(a,1,1));return n<=0?'':s.slice(-n)},
  MID:a=>{argc(a,3,3,'MID');const st=num(a[1]);if(st<1)throw new XErr('#VALUE!','Posisi mulai minimal 1');return text(a[0]).substr(st-1,Math.max(0,num(a[2])))},
  FIND:a=>{argc(a,2,3,'FIND');const i=text(a[1]).indexOf(text(a[0]),num(opt(a,2,1))-1);if(i<0)throw new XErr('#VALUE!','Teks "'+text(a[0])+'" tidak ditemukan');return i+1},
  SEARCH:a=>{argc(a,2,3,'SEARCH');const i=text(a[1]).toLowerCase().indexOf(text(a[0]).toLowerCase(),num(opt(a,2,1))-1);if(i<0)throw new XErr('#VALUE!','Teks "'+text(a[0])+'" tidak ditemukan');return i+1},
  SUBSTITUTE:a=>{argc(a,3,3,'SUBSTITUTE');const o=text(a[1]);return o===''?text(a[0]):text(a[0]).split(o).join(text(a[2]))},
  REPLACE:a=>{argc(a,4,4,'REPLACE');const s=text(a[0]),st=num(a[1])-1;return s.slice(0,st)+text(a[3])+s.slice(st+num(a[2]))},
  REPT:a=>{argc(a,2,2,'REPT');const t=text(a[0]),n=Math.max(0,Math.trunc(num(a[1])));if(t.length*n>32767)throw new XErr('#VALUE!','Hasil REPT lebih dari 32.767 karakter');return t.repeat(n)},
  EXACT:a=>{argc(a,2,2,'EXACT');return text(a[0])===text(a[1])},
  TEXTBEFORE:a=>{argc(a,2,6,'TEXTBEFORE');const r=_textCut(a,'TEXTBEFORE');return r.miss?r.v:r.s.slice(0,r.i)},
  TEXTAFTER:a=>{argc(a,2,6,'TEXTAFTER');const r=_textCut(a,'TEXTAFTER');return r.miss?r.v:r.s.slice(r.i+r.len)},
  VALUE:a=>{argc(a,1,1,'VALUE');return num(a[0])},
  TEXT:a=>{argc(a,2,2,'TEXT');return TEXTfmt(a[0],text(a[1]))},
  TODAY:a=>{argc(a,0,0,'TODAY');const n=new Date();return toSerial(n.getFullYear(),n.getMonth()+1,n.getDate())},
  DATE:a=>{argc(a,3,3,'DATE');return toSerial(num(a[0]),num(a[1]),num(a[2]))},
  YEAR:a=>{argc(a,1,1,'YEAR');return ymd(a[0]).y},
  MONTH:a=>{argc(a,1,1,'MONTH');return ymd(a[0]).m},
  DAY:a=>{argc(a,1,1,'DAY');return ymd(a[0]).d},
  WEEKDAY:a=>{argc(a,1,2,'WEEKDAY');const w=ymd(a[0]).w,t=num(opt(a,1,1));if(t===2)return w===0?7:w;if(t===3)return w===0?6:w-1;return w+1},
  DAYS:a=>{argc(a,2,2,'DAYS');return Math.floor(num(a[0]))-Math.floor(num(a[1]))},
  EDATE:a=>{argc(a,2,2,'EDATE');return edate(num(a[0]),Math.trunc(num(a[1])))},
  EOMONTH:a=>{argc(a,2,2,'EOMONTH');return eomonth(num(a[0]),Math.trunc(num(a[1])))},
  NETWORKDAYS:a=>{argc(a,2,3,'NETWORKDAYS');let s=Math.floor(num(a[0])),e=Math.floor(num(a[1]));const sign=s<=e?1:-1;if(sign<0)[s,e]=[e,s];if(e-s>1e6)throw new XErr('#NUM!','Rentang tanggal terlalu panjang');const h=holidays(a[2]);let n=0;for(let d=s;d<=e;d++)if(isWorkday(d,h))n++;return n*sign},
  WORKDAY:a=>{argc(a,2,3,'WORKDAY');let d=Math.floor(num(a[0])),k=Math.trunc(num(a[1]));if(Math.abs(k)>1e5)throw new XErr('#NUM!','Jumlah hari terlalu besar');const h=holidays(a[2]),step=k<0?-1:1;while(k!==0){d+=step;if(isWorkday(d,h))k-=step}return d},
  DATEDIF:a=>{
    argc(a,3,3,'DATEDIF');const s=num(a[0]),e=num(a[1]),u=text(a[2]).toUpperCase();
    if(s>e)throw new XErr('#NUM!','Tanggal mulai lebih besar dari tanggal akhir');
    const p=fromSerial(s),q=fromSerial(e);
    const months=(q.y-p.y)*12+(q.m-p.m)-(q.d<p.d?1:0);
    if(u==='D')return Math.floor(e)-Math.floor(s);
    if(u==='M')return months;
    if(u==='Y')return Math.floor(months/12);
    if(u==='YM')return months%12;
    if(u==='MD'){if(q.d>=p.d)return q.d-p.d;const last=new Date(Date.UTC(q.y,q.m-1,0)).getUTCDate();return last-p.d+q.d}
    throw new XErr('#NUM!','Satuan DATEDIF harus "Y", "M", "D", "YM", atau "MD"');
  },
  PMT:a=>{argc(a,3,5,'PMT');const r=num(a[0]),n=num(a[1]),pv=num(a[2]),fv=num(opt(a,3,0)),t=num(opt(a,4,0));if(n===0)throw new XErr('#NUM!','Jumlah periode tidak boleh 0');
    if(r===0)return-(pv+fv)/n;const f=Math.pow(1+r,n);return-(r*(pv*f+fv))/((1+r*t)*(f-1))},
  FV:a=>{argc(a,3,5,'FV');const r=num(a[0]),n=num(a[1]),p=num(a[2]),pv=num(opt(a,3,0)),t=num(opt(a,4,0));if(r===0)return-(pv+p*n);const f=Math.pow(1+r,n);return-(pv*f+p*(1+r*t)*(f-1)/r)},
  PV:a=>{argc(a,3,5,'PV');const r=num(a[0]),n=num(a[1]),p=num(a[2]),fv=num(opt(a,3,0)),t=num(opt(a,4,0));if(r===0)return-(fv+p*n);const f=Math.pow(1+r,n);return-(fv+p*(1+r*t)*(f-1)/r)/f},
  NPV:a=>{argc(a,2,99,'NPV');return npv(num(a[0]),nums(a.slice(1)))},
  IRR:a=>{argc(a,1,2,'IRR');return irr(nums([a[0]]),a[1]!==undefined?num(a[1]):undefined)},
  SLN:a=>{argc(a,3,3,'SLN');const n=num(a[2]);if(n===0)throw new XErr('#DIV/0!','Umur manfaat tidak boleh 0');return(num(a[0])-num(a[1]))/n},
  ISBLANK:a=>{argc(a,1,1,'ISBLANK');const v=one(a[0]);return v==null},
  ISNUMBER:a=>{argc(a,1,1,'ISNUMBER');return typeof one(a[0])==='number'},
  ISTEXT:a=>{argc(a,1,1,'ISTEXT');return typeof one(a[0])==='string'},
  VLOOKUP:a=>lookupTable(a,'VLOOKUP',false),
  HLOOKUP:a=>lookupTable(a,'HLOOKUP',true),
  INDEX:a=>{argc(a,2,3,'INDEX');const r=needRange(a[0],'INDEX');let row=Math.trunc(num(a[1])),col=a[2]!==undefined?Math.trunc(num(a[2])):1;
    if(a[2]===undefined&&r.rows.length===1){col=row;row=1}
    if(row<1||col<1||row>r.rows.length||col>r.rows[0].length)throw new XErr('#REF!','Posisi '+row+(a[2]!==undefined?','+col:'')+' berada di luar rentang');
    const v=r.rows[row-1][col-1];if(isErr(v))throw v;return v},
  MATCH:a=>{argc(a,2,3,'MATCH');const v=one(a[0]);if(isErr(v))throw v;const list=lookupList(needRange(a[1],'MATCH'));const type=num(opt(a,2,1));
    let hit=-1;
    if(type===0)hit=findExact(list,v);
    else for(let i=0;i<list.length;i++){const x=list[i];if(x==null||rank(x)!==rank(v))continue;const c=cmpVals(x,v);if(type>0?c<=0:c>=0)hit=i;else break}
    if(hit<0)throw new XErr('#N/A','"'+text(v)+'" tidak ditemukan');return hit+1},
  XMATCH:a=>{argc(a,2,4,'XMATCH');const v=one(a[0]);if(isErr(v))throw v;const i=xfind(lookupList(needRange(a[1],'XMATCH')),v,opt(a,2,0),opt(a,3,1));if(i<0)throw new XErr('#N/A','"'+text(v)+'" tidak ditemukan');return i+1},
  XLOOKUP:a=>{argc(a,3,6,'XLOOKUP');const v=one(a[0]);if(isErr(v))throw v;const lr=needRange(a[1],'XLOOKUP'),rr=needRange(a[2],'XLOOKUP');
    const list=lookupList(lr);const i=xfind(list,v,opt(a,4,0),opt(a,5,1));
    if(i<0){if(a[3]!==undefined)return a[3];throw new XErr('#N/A','"'+text(v)+'" tidak ditemukan di kolom pencarian')}
    if(lr.rows.length>1){const row=rr.rows[i];if(!row)throw new XErr('#VALUE!','Kolom hasil harus sama panjang dengan kolom pencarian');return row.length===1?(row[0]??0):arr([row])}
    const out=rr.rows.map(r=>r[i]);return out.length===1?(out[0]??0):arr(out.map(x=>[x]))},
  CHOOSE:a=>{argc(a,2,99,'CHOOSE');if(isArr(a[0]))return lift(x=>{const i=Math.trunc(num(x[0]));if(i<1||i>=x.length)throw new XErr('#VALUE!','Nomor pilihan di luar daftar');return x[i]},a);const i=Math.trunc(num(a[0]));if(i<1||i>=a.length)throw new XErr('#VALUE!','Nomor pilihan di luar daftar');return a[i]},
  FILTER:a=>{argc(a,2,3,'FILTER');const r=needRange(a[0],'FILTER'),inc=a[1];
    const keep=isArr(inc)?inc.rows.map(x=>x[0]):[inc];
    if(keep.length!==r.rows.length)throw new XErr('#VALUE!','Kondisi FILTER harus sepanjang jumlah baris data');
    const rows=r.rows.filter((_,i)=>{const k=keep[i];if(isErr(k))throw k;return truthy(k)});
    if(!rows.length){if(a[2]!==undefined)return a[2];throw new XErr('#CALC!','Tidak ada baris yang cocok. Tambahkan argumen ketiga untuk teks pengganti')}
    return arr(rows)},
  SORT:a=>{argc(a,1,3,'SORT');const r=isArr(a[0])?a[0]:arr([[a[0]]]);return arr(sortRows(r.rows,Math.trunc(num(opt(a,1,1)))-1,num(opt(a,2,1))))},
  SORTBY:a=>{argc(a,2,3,'SORTBY');const r=needRange(a[0],'SORTBY'),by=lookupList(needRange(a[1],'SORTBY')),o=num(opt(a,2,1));
    const idx=r.rows.map((_,i)=>i).sort((x,y)=>{const c=cmpVals(by[x],by[y]);return o<0?-c:c});return arr(idx.map(i=>r.rows[i]))},
  UNIQUE:a=>{argc(a,1,1,'UNIQUE');const r=needRange(a[0],'UNIQUE');const seen=new Set(),out=[];
    for(const row of r.rows){const k=row.map(v=>typeof v==='string'?v.toLowerCase():String(v)).join('\u0001');if(!seen.has(k)){seen.add(k);out.push(row)}}return arr(out)},
  SEQUENCE:a=>{argc(a,1,4,'SEQUENCE');const r=Math.trunc(num(a[0])),c=Math.trunc(num(opt(a,1,1))),s=num(opt(a,2,1)),st=num(opt(a,3,1));
    if(r<1||c<1)throw new XErr('#VALUE!','Jumlah baris dan kolom minimal 1');sizeOk(r,c,'SEQUENCE');const rows=[];let v=s;for(let i=0;i<r;i++){const row=[];for(let j=0;j<c;j++){row.push(v);v+=st}rows.push(row)}return arr(rows)},
  QUOTIENT:a=>{argc(a,2,2,'QUOTIENT');const d=num(a[1]);if(d===0)throw new XErr('#DIV/0!','Pembagian dengan nol');return Math.trunc(num(a[0])/d)},
  RAND:a=>{argc(a,0,0,'RAND');return Math.random()},
  RANDBETWEEN:a=>{argc(a,2,2,'RANDBETWEEN');const lo=Math.ceil(num(a[0])),hi=Math.floor(num(a[1]));return lo+Math.floor(Math.random()*(hi-lo+1))},
  CHAR:a=>{argc(a,1,1,'CHAR');return String.fromCharCode(Math.trunc(num(a[0])))},
  CODE:a=>{argc(a,1,1,'CODE');const t=text(a[0]);if(!t)throw new XErr('#VALUE!','Teks kosong');return t.charCodeAt(0)},
  CLEAN:a=>{argc(a,1,1,'CLEAN');return text(a[0]).replace(/[\x00-\x1f]/g,'')},
  XOR:a=>{if(!a.length)throw new XErr('#ERROR!','XOR perlu minimal satu kondisi');return flat(a).filter(v=>v!=null).filter(truthy).length%2===1},
  TRUE:a=>{argc(a,0,0,'TRUE');return true},
  FALSE:a=>{argc(a,0,0,'FALSE');return false},
  LOOKUP:a=>{argc(a,2,3,'LOOKUP');const v=one(a[0]);const lv=lookupList(needRange(a[1],'LOOKUP'));const rv=a[2]!==undefined?lookupList(needRange(a[2],'LOOKUP')):lv;
    let hit=-1;for(let i=0;i<lv.length;i++){const x=lv[i];if(x==null||rank(x)!==rank(v))continue;if(cmpVals(x,v)<=0)hit=i;else break}
    if(hit<0)throw new XErr('#N/A','Tidak ada nilai yang lebih kecil atau sama dengan "'+text(v)+'"');return rv[hit]??0},
  ADDRESS:a=>{argc(a,2,3,'ADDRESS');const r=Math.trunc(num(a[0])),c=Math.trunc(num(a[1])),t=num(opt(a,2,1));if(r<1||c<1)throw new XErr('#VALUE!','Baris dan kolom minimal 1');
    const cn=colName(c-1);return t===4?cn+r:t===2?cn+'$'+r:t===3?'$'+cn+r:'$'+cn+'$'+r},
  NOW:a=>{argc(a,0,0,'NOW');const n=new Date();return toSerial(n.getFullYear(),n.getMonth()+1,n.getDate())+(n.getHours()*3600+n.getMinutes()*60+n.getSeconds())/86400},
  TIME:a=>{argc(a,3,3,'TIME');const t=(num(a[0])*3600+num(a[1])*60+num(a[2]))/86400;return t-Math.floor(t)},
  HOUR:a=>{argc(a,1,1,'HOUR');return Math.floor(fracSec(num(a[0]))/3600)},
  MINUTE:a=>{argc(a,1,1,'MINUTE');return Math.floor(fracSec(num(a[0]))%3600/60)},
  SECOND:a=>{argc(a,1,1,'SECOND');return fracSec(num(a[0]))%60},
  WEEKNUM:a=>{argc(a,1,2,'WEEKNUM');const s=Math.floor(num(a[0])),p=fromSerial(s),j1=toSerial(p.y,1,1),t=num(opt(a,1,1));const w=fromSerial(j1).w;const off=t===2?(w+6)%7:w;return Math.floor((s-j1+off)/7)+1},
  DATEVALUE:a=>{argc(a,1,1,'DATEVALUE');const t=text(a[0]).trim();let m=/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/.exec(t);if(m)return toSerial(+m[3],+m[2],+m[1]);m=/^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);if(m)return toSerial(+m[1],+m[2],+m[3]);throw new XErr('#VALUE!','"'+t+'" tidak dikenali sebagai tanggal. Gunakan format dd/mm/yyyy')},
  AVERAGEA:a=>{const v=flat(a).filter(x=>x!=null&&x!=='');if(!v.length)throw new XErr('#DIV/0!','Tidak ada nilai');return sumOf(v.map(x=>typeof x==='number'?x:x===true?1:0))/v.length},
  VAR:a=>{const n=nums(a);if(n.length<2)throw new XErr('#DIV/0!','Butuh minimal dua angka');const m=sumOf(n)/n.length;return sumOf(n.map(x=>(x-m)**2))/(n.length-1)},
  'VAR.S':a=>FN.VAR(a),
  PERCENTILE:a=>{argc(a,2,2,'PERCENTILE');const n=nums([a[0]]).sort((x,y)=>x-y),k=num(a[1]);if(!n.length||k<0||k>1)throw new XErr('#NUM!','Persentil harus antara 0 dan 1');const r=k*(n.length-1),lo=Math.floor(r);return n[lo]+(n[Math.min(lo+1,n.length-1)]-n[lo])*(r-lo)},
  'PERCENTILE.INC':a=>FN.PERCENTILE(a),
  QUARTILE:a=>{argc(a,2,2,'QUARTILE');const q=Math.trunc(num(a[1]));if(q<0||q>4)throw new XErr('#NUM!','Kuartil harus 0 sampai 4');return FN.PERCENTILE([a[0],q/4])},
  'QUARTILE.INC':a=>FN.QUARTILE(a),
  IPMT:a=>{argc(a,4,6,'IPMT');return ipmt(num(a[0]),num(a[1]),num(a[2]),num(a[3]),num(opt(a,4,0)),num(opt(a,5,0)))},
  PPMT:a=>{argc(a,4,6,'PPMT');const r=num(a[0]),per=num(a[1]),n=num(a[2]),pv=num(a[3]),fv=num(opt(a,4,0)),t=num(opt(a,5,0));return FN.PMT([r,n,pv,fv,t])-ipmt(r,per,n,pv,fv,t)},
  CUMIPMT:a=>{argc(a,6,6,'CUMIPMT');let s=0;for(let k=num(a[3]);k<=num(a[4]);k++)s+=ipmt(num(a[0]),k,num(a[1]),num(a[2]),0,num(a[5]));return s},
  CUMPRINC:a=>{argc(a,6,6,'CUMPRINC');let s=0;for(let k=num(a[3]);k<=num(a[4]);k++)s+=FN.PPMT([a[0],k,a[1],a[2],0,a[5]]);return s},
  RATE:a=>{argc(a,3,6,'RATE');const n=num(a[0]),pmt=num(a[1]),pv=num(a[2]),fv=num(opt(a,3,0)),t=num(opt(a,4,0));let r=a[5]!==undefined?num(a[5]):0.01;
    const f=r=>Math.abs(r)<1e-12?pv+pmt*n+fv:pv*Math.pow(1+r,n)+pmt*(1+r*t)*(Math.pow(1+r,n)-1)/r+fv;
    for(let i=0;i<200;i++){const y=f(r),d=(f(r+1e-7)-y)/1e-7;if(!d)break;const nr=r-y/d;if(Math.abs(nr-r)<1e-12)return nr;r=nr}
    if(!isFinite(r)||Math.abs(f(r))>1e-6)throw new XErr('#NUM!','RATE tidak menemukan jawaban');return r},
  TEXTSPLIT:a=>{argc(a,2,3,'TEXTSPLIT');const s=text(a[0]),cd=text(a[1]),rd=a[2]!==undefined?text(a[2]):null;
    const rows=(rd?s.split(rd):[s]).map(r=>r.split(cd));const w=Math.max(...rows.map(r=>r.length));return arr(rows.map(r=>r.concat(Array(w-r.length).fill(new XErr('#N/A','Baris lebih pendek')))))},
  TAKE:a=>{argc(a,2,3,'TAKE');const r=asArr(a[0]).rows;let n=Math.trunc(num(a[1]));let rows=n>=0?r.slice(0,n):r.slice(n);
    if(a[2]!==undefined){const c=Math.trunc(num(a[2]));rows=rows.map(x=>c>=0?x.slice(0,c):x.slice(c))}if(!rows.length||!rows[0].length)throw new XErr('#CALC!','Hasilnya kosong');return arr(rows)},
  DROP:a=>{argc(a,2,3,'DROP');const r=asArr(a[0]).rows;let n=Math.trunc(num(a[1]));let rows=n>=0?r.slice(n):r.slice(0,n);
    if(a[2]!==undefined){const c=Math.trunc(num(a[2]));rows=rows.map(x=>c>=0?x.slice(c):x.slice(0,c))}if(!rows.length||!rows[0].length)throw new XErr('#CALC!','Hasilnya kosong');return arr(rows)},
  CHOOSECOLS:a=>{argc(a,2,99,'CHOOSECOLS');const r=asArr(a[0]).rows,w=r[0].length;const idx=a.slice(1).map(x=>{let i=Math.trunc(num(x));if(i<0)i=w+i+1;if(i<1||i>w)throw new XErr('#VALUE!','Kolom '+i+' di luar data');return i-1});return arr(r.map(row=>idx.map(i=>row[i])))},
  CHOOSEROWS:a=>{argc(a,2,99,'CHOOSEROWS');const r=asArr(a[0]).rows,h=r.length;return arr(a.slice(1).map(x=>{let i=Math.trunc(num(x));if(i<0)i=h+i+1;if(i<1||i>h)throw new XErr('#VALUE!','Baris '+i+' di luar data');return r[i-1]}))},
  TOCOL:a=>{argc(a,1,3,'TOCOL');const ig=num(opt(a,1,0));const v=_flat(asArr(a[0]),num(opt(a,2,0))).filter(x=>!(ig&1&&x==null)&&!(ig&2&&isErr(x)));return arr(v.map(x=>[x??0]))},
  TOROW:a=>{argc(a,1,3,'TOROW');const ig=num(opt(a,1,0));const v=_flat(asArr(a[0]),num(opt(a,2,0))).filter(x=>!(ig&1&&x==null)&&!(ig&2&&isErr(x)));return arr([v.map(x=>x??0)])},
  VSTACK:a=>{const parts=a.filter(x=>x!==undefined).map(x=>asArr(x).rows);const w=Math.max(...parts.map(p=>p[0].length));return arr(parts.flatMap(p=>p.map(r=>r.concat(Array(w-r.length).fill(new XErr('#N/A','Kolom tidak sama lebar'))))))},
  HSTACK:a=>{const parts=a.filter(x=>x!==undefined).map(x=>asArr(x).rows);const h=Math.max(...parts.map(p=>p.length));return arr(Array.from({length:h},(_,i)=>parts.flatMap(p=>p[i]||Array(p[0].length).fill(new XErr('#N/A','Baris tidak sama tinggi')))))},
  WRAPROWS:a=>{argc(a,2,3,'WRAPROWS');const v=asArr(a[0]).rows.flat(),n=Math.trunc(num(a[1]));if(n<1)throw new XErr('#VALUE!','Lebar minimal 1');const pad=a[2]!==undefined?a[2]:new XErr('#N/A','Sisa sel');const rows=[];for(let i=0;i<v.length;i+=n){const r=v.slice(i,i+n);while(r.length<n)r.push(pad);rows.push(r)}return arr(rows)},
  WRAPCOLS:a=>{argc(a,2,3,'WRAPCOLS');const t=FN.WRAPROWS(a).rows;return arr(t[0].map((_,j)=>t.map(r=>r[j])))},
  TRIMRANGE:a=>{argc(a,1,1,'TRIMRANGE');let r=asArr(a[0]).rows;const empty=v=>v==null||v==='';
    while(r.length&&r[0].every(empty))r=r.slice(1);while(r.length&&r[r.length-1].every(empty))r=r.slice(0,-1);
    if(!r.length)throw new XErr('#REF!','Rentang kosong');let c0=0,c1=r[0].length;while(c0<c1&&r.every(x=>empty(x[c0])))c0++;while(c1>c0&&r.every(x=>empty(x[c1-1])))c1--;return arr(r.map(x=>x.slice(c0,c1)))},
  REGEXTEST:a=>{argc(a,2,3,'REGEXTEST');if(text(a[0]).length>10000)throw new XErr('#VALUE!','Teks terlalu panjang untuk regex');return rx(a[1],a[2]).test(text(a[0]))},
  REGEXEXTRACT:a=>{argc(a,2,4,'REGEXEXTRACT');if(text(a[0]).length>10000)throw new XErr('#VALUE!','Teks terlalu panjang untuk regex');const s=text(a[0]),mode=num(opt(a,2,0));
    if(mode===1){const re=rx(a[1],a[3],'g');const m=s.match(re);if(!m)throw new XErr('#N/A','Pola tidak ditemukan');return arr(m.map(x=>[x]))}
    const m=rx(a[1],a[3]).exec(s);if(!m)throw new XErr('#N/A','Pola tidak ditemukan');if(mode===2){if(m.length<2)throw new XErr('#VALUE!','Pola tidak punya grup ( )');return arr([m.slice(1)])}return m[0]},
  REGEXREPLACE:a=>{argc(a,3,5,'REGEXREPLACE');if(text(a[0]).length>10000)throw new XErr('#VALUE!','Teks terlalu panjang untuk regex');return text(a[0]).replace(rx(a[1],a[4],'g'),text(a[2]))},
  PY:a=>{throw new XErr('#NAME?','Python in Excel hanya berjalan di Excel Microsoft 365, tidak bisa dicoba di sini')},
  IMPORTCSV:a=>{throw new XErr('#NAME?','IMPORTCSV membaca file di komputermu, jadi tidak bisa dicoba di sini')},
  IMPORTTEXT:a=>{throw new XErr('#NAME?','IMPORTTEXT membaca file di komputermu, jadi tidak bisa dicoba di sini')},
  TRANSPOSE:a=>{argc(a,1,1,'TRANSPOSE');const r=needRange(a[0],'TRANSPOSE');return arr(r.rows[0].map((_,j)=>r.rows.map(x=>x[j])))},
};
function lookupTable(a,fn,horiz){
  argc(a,3,4,fn);const v=one(a[0]);if(isErr(v))throw v;let t=needRange(a[1],fn).rows;
  if(horiz)t=t[0].map((_,j)=>t.map(r=>r[j]));
  const col=Math.trunc(num(a[2]));const approx=a[3]===undefined?true:truthy(a[3]);
  if(col<1)throw new XErr('#VALUE!','Nomor '+(horiz?'baris':'kolom')+' minimal 1');
  if(col>t[0].length)throw new XErr('#REF!','Tabel hanya punya '+t[0].length+(horiz?' baris':' kolom')+', tapi rumus meminta nomor '+col);
  let hit=-1;
  if(!approx)hit=findExact(t.map(r=>r[0]),v);
  else for(let i=0;i<t.length;i++){const k=t[i][0];if(k==null||rank(k)!==rank(v))continue;if(cmpVals(k,v)<=0)hit=i;else break}
  if(hit<0)throw new XErr('#N/A','"'+text(v)+'" tidak ditemukan di '+(horiz?'baris':'kolom')+' pertama tabel');
  const out=t[hit][col-1];if(isErr(out))throw out;return out;
}
const SPECIAL=['IF','IFS','IFERROR','IFNA','SWITCH','LET','LAMBDA','ISERROR','ISNA','ISERR','ERROR.TYPE','TYPE','ISREF','ISFORMULA','FORMULATEXT','ISOMITTED','CELL','ROW','COLUMN','ROWS','COLUMNS','OFFSET','INDIRECT','GROUPBY','PIVOTBY','BYROW','BYCOL','MAP','REDUCE','SCAN','MAKEARRAY'];

/* ---------- elementwise ops ---------- */
function opScalar(o,a,b){
  try{
    if(isErr(a))return a;if(isErr(b))return b;
    switch(o){
      case '+':return num(a)+num(b);
      case '-':return num(a)-num(b);
      case '*':return num(a)*num(b);
      case '/':{const d=num(b);if(d===0)throw new XErr('#DIV/0!','Pembagian dengan nol');return num(a)/d}
      case '^':return Math.pow(num(a),num(b));
      case '&':return text(a)+text(b);
      default:{const c=cmpVals(a,b);return{'=':c===0,'<>':c!==0,'<':c<0,'>':c>0,'<=':c<=0,'>=':c>=0}[o]}
    }
  }catch(e){if(isErr(e))return e;throw e}
}
/* Fungsi yang menerima satu nilai otomatis dijalankan per sel kalau diberi rentang, seperti di Excel 365. */
const LIFT=new Set(['ABS','INT','ROUND','ROUNDUP','ROUNDDOWN','MROUND','CEILING','FLOOR','CEILING.MATH','FLOOR.MATH','MOD','QUOTIENT','POWER','SQRT',
  'VALUE','TEXT','LEFT','RIGHT','MID','LEN','UPPER','LOWER','PROPER','TRIM','CLEAN','REPT','SUBSTITUTE','REPLACE','FIND','SEARCH','EXACT','CHAR','CODE',
  'TEXTAFTER','TEXTBEFORE','REGEXTEST','REGEXEXTRACT','REGEXREPLACE','ISNUMBER','ISTEXT','ISBLANK','NOT',
  'YEAR','MONTH','DAY','HOUR','MINUTE','SECOND','WEEKDAY','WEEKNUM','DATE','EDATE','EOMONTH','DATEDIF','DAYS','TIME',
  'PMT','IPMT','PPMT','PV','FV']);
/* posisi argumen kriteria: kalau berisi rentang, hasilnya jadi array (satu hasil per kriteria) */
const CRIT_AT={SUMIF:i=>i===1,COUNTIF:i=>i===1,AVERAGEIF:i=>i===1,COUNTIFS:i=>i%2===1,
  SUMIFS:i=>i>=2&&i%2===0,AVERAGEIFS:i=>i>=2&&i%2===0,MAXIFS:i=>i>=2&&i%2===0,MINIFS:i=>i>=2&&i%2===0};

/* ---------- fungsi tambahan: statistik, matematika, database, keuangan, rekayasa, info ---------- */
const N1=(a,i,fn,min,max)=>{if(fn)argc(a,min,max,fn);return num(a[i])};
const mean=xs=>sumOf(xs)/xs.length;
const ss=xs=>{const m=mean(xs);return sumOf(xs.map(x=>(x-m)**2))};
const needN=(xs,k,fn)=>{if(xs.length<k)throw new XErr('#DIV/0!',fn+' butuh minimal '+k+' angka');return xs};
const numsA=a=>{const out=[];for(const v of flat(a)){if(isErr(v))throw v;if(typeof v==='number')out.push(v);else if(typeof v==='boolean')out.push(v?1:0);else if(typeof v==='string')out.push(0)}return out};
const pairs=(a,b,fn)=>{const x=flat([a]),y=flat([b]);if(x.length!==y.length)throw new XErr('#N/A',fn+': kedua rentang harus sama panjang');const X=[],Y=[];x.forEach((v,i)=>{if(typeof v==='number'&&typeof y[i]==='number'){X.push(v);Y.push(y[i])}});return[X,Y]};
const lin=(Y,X)=>{const mx=mean(X),my=mean(Y);let sxy=0,sxx=0;X.forEach((x,i)=>{sxy+=(x-mx)*(Y[i]-my);sxx+=(x-mx)**2});if(sxx===0)throw new XErr('#DIV/0!','Nilai x semuanya sama');const b=sxy/sxx;return{b,a:my-b*mx,mx,my,sxx,sxy}};
const corr=(X,Y)=>{const mx=mean(X),my=mean(Y);let sxy=0,sxx=0,syy=0;X.forEach((x,i)=>{sxy+=(x-mx)*(Y[i]-my);sxx+=(x-mx)**2;syy+=(Y[i]-my)**2});if(!sxx||!syy)throw new XErr('#DIV/0!','Data tidak bervariasi');return sxy/Math.sqrt(sxx*syy)};
const fact=n=>{n=Math.trunc(n);if(n<0)throw new XErr('#NUM!','Faktorial bilangan negatif');let r=1;for(let i=2;i<=n;i++)r*=i;return r};
const gcd2=(a,b)=>{a=Math.abs(Math.trunc(a));b=Math.abs(Math.trunc(b));while(b){[a,b]=[b,a%b]}return a};
const combin=(n,k)=>{n=Math.trunc(n);k=Math.trunc(k);if(k<0||n<k)throw new XErr('#NUM!','Argumen COMBIN tidak valid');let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r)};
/* fungsi khusus untuk distribusi */
function gammaln(x){const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];let y=x,t=x+5.5;t-=(x+0.5)*Math.log(t);let s=1.000000000190015;for(const k of c)s+=k/++y;return-t+Math.log(2.5066282746310005*s/x)}
function betacf(a,b,x){let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<1e-30)d=1e-30;d=1/d;let h=d;
  for(let m=1;m<=300;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+aa/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+aa/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<3e-12)break}return h}
function ibeta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(gammaln(a+b)-gammaln(a)-gammaln(b)+a*Math.log(x)+b*Math.log(1-x));return x<(a+1)/(a+b+2)?bt*betacf(a,b,x)/a:1-bt*betacf(b,a,1-x)/b}
function igamma(a,x){if(x<=0)return 0;if(x<a+1){let ap=a,s=1/a,del=s;for(let n=0;n<500;n++){ap++;del*=x/ap;s+=del;if(Math.abs(del)<Math.abs(s)*1e-14)break}return s*Math.exp(-x+a*Math.log(x)-gammaln(a))}
  let b=x+1-a,c=1e30,d=1/b,h=d;for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-30)d=1e-30;c=b+an/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-14)break}return 1-Math.exp(-x+a*Math.log(x)-gammaln(a))*h}
const erf=x=>{const t=1/(1+0.5*Math.abs(x));const y=1-t*Math.exp(-x*x-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277)))))))));return x>=0?y:-y};
const ncdf=z=>{if(z<-38)return 0;if(z>38)return 1;return igamma(0.5,z*z/2)/2*(z<0?-1:1)+0.5};
const npdf=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
function ninv(p){if(p<=0||p>=1)throw new XErr('#NUM!','Probabilitas harus di antara 0 dan 1');
  const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239],b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],c=[-0.007784894002430293,-0.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],d=[0.007784695709041462,0.3224671290700398,2.445134137142996,3.754408661907416];
  let q,r,x;if(p<0.02425){q=Math.sqrt(-2*Math.log(p));x=(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)}
  else if(p>1-0.02425){q=Math.sqrt(-2*Math.log(1-p));x=-(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)}
  else{q=p-0.5;r=q*q;x=(((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)}
  for(let i=0;i<2;i++){const e=ncdf(x)-p;x-=e/npdf(x)}return x}
const tcdf=(t,df)=>{const x=df/(df+t*t);const p=0.5*ibeta(x,df/2,0.5);return t>0?1-p:p};
const tpdf=(t,df)=>Math.exp(gammaln((df+1)/2)-gammaln(df/2))/Math.sqrt(df*Math.PI)*Math.pow(1+t*t/df,-(df+1)/2);
const chicdf=(x,k)=>igamma(k/2,x/2);
const fcdf=(x,d1,d2)=>x<=0?0:ibeta(d1*x/(d1*x+d2),d1/2,d2/2);
function invert(f,p,lo,hi){if(p<=0||p>=1)throw new XErr('#NUM!','Probabilitas harus di antara 0 dan 1');while(f(hi)<p)hi*=2;for(let i=0;i<200;i++){const m=(lo+hi)/2;if(f(m)<p)lo=m;else hi=m}return(lo+hi)/2}
const pctInc=(xs,k)=>{const n=xs.slice().sort((x,y)=>x-y);if(!n.length||k<0||k>1)throw new XErr('#NUM!','Persentil harus antara 0 dan 1');const r=k*(n.length-1),l=Math.floor(r);return n[l]+(r-l)*((n[l+1]??n[l])-n[l])};
const pctExc=(xs,k)=>{const n=xs.slice().sort((x,y)=>x-y),N=n.length,r=k*(N+1);if(r<1||r>N)throw new XErr('#NUM!','Persentil di luar jangkauan data (.EXC)');const l=Math.floor(r);return n[l-1]+(r-l)*((n[l]??n[l-1])-n[l-1])};
/* tanggal: pola akhir pekan untuk .INTL */
function weekendMask(w){if(w===undefined)return[0,0,0,0,0,1,1];if(typeof w==='string'){if(!/^[01]{7}$/.test(w))throw new XErr('#VALUE!','Pola akhir pekan harus 7 karakter 0/1, mulai Senin');return w.split('').map(Number)}
  const k=Math.trunc(num(w));const two={1:[5,6],2:[6,0],3:[0,1],4:[1,2],5:[2,3],6:[3,4],7:[4,5]}[k];const m=[0,0,0,0,0,0,0];if(two){two.forEach(i=>m[i]=1);return m}if(k>=11&&k<=17){m[(k-11+6)%7]=1;return m}throw new XErr('#NUM!','Kode akhir pekan tidak dikenal')}
const isWorkdayM=(s,mask,hol)=>{const w=(fromSerial(s).w+6)%7;return !mask[w]&&!hol.has(s)};
/* database: DSUM dkk */
function dbRows(db,field,crit,fn){db=needRange(db,fn);crit=needRange(crit,fn);const head=db.rows[0].map(h=>String(h??'').toLowerCase());
  let fi=-1;if(field!==undefined){if(typeof field==='number')fi=Math.trunc(field)-1;else fi=head.indexOf(String(field).toLowerCase());if(fi<0||fi>=head.length)throw new XErr('#VALUE!','Field "'+field+'" tidak ada di judul database')}
  const ch=crit.rows[0].map(h=>String(h??'').toLowerCase());const conds=crit.rows.slice(1).map(r=>r.map((c,j)=>c==null||c===''?null:[head.indexOf(ch[j]),makeCrit(c)]).filter(Boolean));
  for(const c of conds)for(const[k]of c)if(k<0)throw new XErr('#VALUE!','Judul kriteria tidak cocok dengan judul database');
  const rows=db.rows.slice(1).filter(r=>!conds.length||conds.some(c=>c.every(([k,t])=>t(r[k]))));return{rows,fi}}
const dvals=(a,fn)=>{argc(a,3,3,fn);const{rows,fi}=dbRows(a[0],a[1],a[2],fn);return rows.map(r=>r[fi])};
const dnums=(a,fn)=>dvals(a,fn).filter(v=>typeof v==='number');
/* bilangan basis */
function toBase(n,base,places,fn){n=Math.trunc(num(n));const lim={2:512,8:536870912,16:549755813888}[base];if(n<-lim||n>=lim)throw new XErr('#NUM!',fn+': angka di luar jangkauan');
  let s=(n<0?(base===2?1024:base===8?1073741824:1099511627776)+n:n).toString(base).toUpperCase();if(places!==undefined){const p=Math.trunc(num(places));if(s.length>p)throw new XErr('#NUM!',fn+': jumlah digit kurang');s=s.padStart(p,'0')}return s}
function fromBase(s,base,fn){s=text(s).trim().toUpperCase();if(!s)return 0;if(s.length>10||![...s].every(c=>parseInt(c,base)<base))throw new XErr('#NUM!',fn+': "'+s+'" bukan bilangan basis '+base);
  const v=parseInt(s,base),bits={2:10,8:30,16:40}[base];return s.length===10&&v>=Math.pow(2,bits-1)?v-Math.pow(2,bits):v}
const UNITS={m:['len',1],km:['len',1000],cm:['len',.01],mm:['len',.001],mi:['len',1609.344],in:['len',.0254],ft:['len',.3048],yd:['len',.9144],Nmi:['len',1852],
  g:['mass',1],kg:['mass',1000],mg:['mass',.001],lbm:['mass',453.59237],ozm:['mass',28.349523125],ton:['mass',907184.74],
  sec:['time',1],s:['time',1],mn:['time',60],min:['time',60],hr:['time',3600],day:['time',86400],d:['time',86400],wk:['time',604800],yr:['time',31557600],
  l:['vol',1],L:['vol',1],ml:['vol',.001],gal:['vol',3.785411784],qt:['vol',.946352946],cup:['vol',.2365882365],m3:['vol',1000],
  m2:['area',1],km2:['area',1e6],ha:['area',1e4],ft2:['area',.09290304],in2:['area',.00064516],ac:['area',4046.8564224],
  'km/h':['spd',1/3.6],'m/s':['spd',1],mph:['spd',.44704],kn:['spd',.514444444],
  J:['en',1],kJ:['en',1000],cal:['en',4.1868],kcal:['en',4186.8],Wh:['en',3600],kWh:['en',3.6e6],
  W:['pow',1],kW:['pow',1000],HP:['pow',745.69987158227],h:['pow',745.69987158227],
  Pa:['pr',1],kPa:['pr',1000],atm:['pr',101325],bar:['pr',1e5],mmHg:['pr',133.322],psi:['pr',6894.757293168],
  byte:['inf',1],bit:['inf',.125],kbyte:['inf',1000],Mbyte:['inf',1e6],Gbyte:['inf',1e9]};
function convertU(x,f,t){const T={C:1,F:1,K:1,cel:1,fah:1,kel:1};if(T[f]&&T[t]){const k=f==='C'||f==='cel'?x+273.15:f==='F'||f==='fah'?(x-32)*5/9+273.15:x;return t==='C'||t==='cel'?k-273.15:t==='F'||t==='fah'?(k-273.15)*9/5+32:k}
  const a=UNITS[f],b=UNITS[t];if(!a||!b||a[0]!==b[0])throw new XErr('#N/A','Satuan "'+f+'" dan "'+t+'" tidak bisa dikonversi');return x*a[1]/b[1]}
const roman=n=>{n=Math.trunc(n);if(n<0||n>3999)throw new XErr('#VALUE!','ROMAN hanya untuk 0 sampai 3999');const m=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let s='';for(const[v,r]of m)while(n>=v){s+=r;n-=v}return s};
const arabic=s=>{s=text(s).trim().toUpperCase();const v={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};let t=0;for(let i=0;i<s.length;i++){const a=v[s[i]],b=v[s[i+1]]||0;if(!a)throw new XErr('#VALUE!','"'+s+'" bukan angka Romawi');t+=a<b?-a:a}return t};
function mmul(A,B){if(A[0].length!==B.length)throw new XErr('#VALUE!','MMULT: jumlah kolom matriks pertama harus sama dengan jumlah baris matriks kedua');return A.map(r=>B[0].map((_,j)=>r.reduce((s,x,k)=>s+x*B[k][j],0)))}
const matrix=(a,fn)=>{const m=asArr(a).rows.map(r=>r.map(v=>{if(typeof v!=='number')throw new XErr('#VALUE!',fn+' hanya menerima angka');return v}));return m};
function det(M){const n=M.length;if(M.some(r=>r.length!==n))throw new XErr('#VALUE!','Matriks harus persegi');const A=M.map(r=>r.slice());let d=1;for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;if(!A[p][i])return 0;if(p!==i){[A[p],A[i]]=[A[i],A[p]];d=-d}d*=A[i][i];for(let r=i+1;r<n;r++){const f=A[r][i]/A[i][i];for(let c=i;c<n;c++)A[r][c]-=f*A[i][c]}}return d}
function inv(M){const n=M.length;if(M.some(r=>r.length!==n))throw new XErr('#VALUE!','Matriks harus persegi');const A=M.map((r,i)=>[...r,...r.map((_,j)=>i===j?1:0)]);
  for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;if(Math.abs(A[p][i])<1e-12)throw new XErr('#NUM!','Matriks tidak punya invers');[A[p],A[i]]=[A[i],A[p]];const d=A[i][i];for(let c=0;c<2*n;c++)A[i][c]/=d;for(let r=0;r<n;r++)if(r!==i){const f=A[r][i];for(let c=0;c<2*n;c++)A[r][c]-=f*A[i][c]}}return A.map(r=>r.slice(n))}
function xnpv(r,v,d){const d0=d[0];return v.reduce((s,x,i)=>s+x/Math.pow(1+r,(d[i]-d0)/365),0)}
function ddb(c,s,l,p,f){let bv=c,dep=0;for(let i=1;i<=p;i++){dep=Math.min(bv*f/l,Math.max(0,bv-s));bv-=dep}return dep}
function yearfrac(s,e,b){if(s>e)[s,e]=[e,s];const p=fromSerial(s),q=fromSerial(e);
  if(b===0||b===4){let d1=p.d,d2=q.d;if(b===0){if(d1===31)d1=30;if(d2===31&&d1>=30)d2=30}else{if(d1===31)d1=30;if(d2===31)d2=30}return((q.y-p.y)*360+(q.m-p.m)*30+(d2-d1))/360}
  if(b===2)return(e-s)/360;if(b===3)return(e-s)/365;
  if(p.y===q.y){const leap=(q.y%4===0&&q.y%100!==0)||q.y%400===0;return(e-s)/(leap?366:365)}
  let days=0;for(let y=p.y;y<=q.y;y++)days+=((y%4===0&&y%100!==0)||y%400===0)?366:365;return(e-s)/(days/(q.y-p.y+1))}

Object.assign(FN,{
  /* matematika & trigonometri */
  SIGN:a=>{const x=N1(a,0,'SIGN',1,1);return x>0?1:x<0?-1:0},
  EXP:a=>Math.exp(N1(a,0,'EXP',1,1)),
  LN:a=>{const x=N1(a,0,'LN',1,1);if(x<=0)throw new XErr('#NUM!','LN hanya untuk angka positif');return Math.log(x)},
  LOG:a=>{argc(a,1,2,'LOG');const x=num(a[0]),b=num(opt(a,1,10));if(x<=0||b<=0||b===1)throw new XErr('#NUM!','Argumen LOG tidak valid');return Math.log(x)/Math.log(b)},
  LOG10:a=>{const x=N1(a,0,'LOG10',1,1);if(x<=0)throw new XErr('#NUM!','LOG10 hanya untuk angka positif');return Math.log10(x)},
  PI:a=>{argc(a,0,0,'PI');return Math.PI},
  SQRTPI:a=>Math.sqrt(N1(a,0,'SQRTPI',1,1)*Math.PI),
  RADIANS:a=>N1(a,0,'RADIANS',1,1)*Math.PI/180, DEGREES:a=>N1(a,0,'DEGREES',1,1)*180/Math.PI,
  SIN:a=>Math.sin(N1(a,0,'SIN',1,1)), COS:a=>Math.cos(N1(a,0,'COS',1,1)), TAN:a=>Math.tan(N1(a,0,'TAN',1,1)),
  ASIN:a=>Math.asin(N1(a,0,'ASIN',1,1)), ACOS:a=>Math.acos(N1(a,0,'ACOS',1,1)), ATAN:a=>Math.atan(N1(a,0,'ATAN',1,1)),
  ATAN2:a=>{argc(a,2,2,'ATAN2');return Math.atan2(num(a[1]),num(a[0]))},
  SINH:a=>Math.sinh(N1(a,0,'SINH',1,1)), COSH:a=>Math.cosh(N1(a,0,'COSH',1,1)), TANH:a=>Math.tanh(N1(a,0,'TANH',1,1)),
  SEC:a=>1/Math.cos(N1(a,0,'SEC',1,1)), CSC:a=>1/Math.sin(N1(a,0,'CSC',1,1)), COT:a=>1/Math.tan(N1(a,0,'COT',1,1)),
  FACT:a=>fact(N1(a,0,'FACT',1,1)),
  FACTDOUBLE:a=>{let n=Math.trunc(N1(a,0,'FACTDOUBLE',1,1)),r=1;for(;n>1;n-=2)r*=n;return r},
  COMBIN:a=>{argc(a,2,2,'COMBIN');return combin(num(a[0]),num(a[1]))},
  COMBINA:a=>{argc(a,2,2,'COMBINA');const n=num(a[0]),k=num(a[1]);return combin(n+k-1,k)},
  PERMUT:a=>{argc(a,2,2,'PERMUT');const n=Math.trunc(num(a[0])),k=Math.trunc(num(a[1]));if(k<0||n<k)throw new XErr('#NUM!','Argumen PERMUT tidak valid');let r=1;for(let i=0;i<k;i++)r*=n-i;return r},
  PERMUTATIONA:a=>{argc(a,2,2,'PERMUTATIONA');return Math.pow(Math.trunc(num(a[0])),Math.trunc(num(a[1])))},
  MULTINOMIAL:a=>{const n=nums(a);return fact(sumOf(n))/n.reduce((p,x)=>p*fact(x),1)},
  GCD:a=>nums(a).reduce((g,x)=>gcd2(g,x),0),
  LCM:a=>nums(a).reduce((l,x)=>{x=Math.trunc(x);return x===0||l===0?0:Math.abs(l*x)/gcd2(l,x)},1),
  EVEN:a=>{const x=N1(a,0,'EVEN',1,1),s=x<0?-1:1;let v=Math.ceil(Math.abs(x));if(v%2)v++;return s*v},
  ODD:a=>{const x=N1(a,0,'ODD',1,1),s=x<0?-1:1;let v=Math.ceil(Math.abs(x));if(v%2===0)v++;return s*v},
  TRUNC:a=>{argc(a,1,2,'TRUNC');const x=num(a[0]),d=Math.trunc(num(opt(a,1,0))),f=Math.pow(10,d);return Math.trunc(x*f+(x>=0?1e-9:-1e-9))/f},
  'CEILING.PRECISE':a=>{argc(a,1,2,'CEILING.PRECISE');const x=num(a[0]),s=Math.abs(num(opt(a,1,1)));return s?Math.ceil(x/s-1e-12)*s:0},
  'ISO.CEILING':a=>FN['CEILING.PRECISE'](a),
  'FLOOR.PRECISE':a=>{argc(a,1,2,'FLOOR.PRECISE');const x=num(a[0]),s=Math.abs(num(opt(a,1,1)));return s?Math.floor(x/s+1e-12)*s:0},
  SUMSQ:a=>sumOf(nums(a).map(x=>x*x)),
  SUMX2MY2:a=>{argc(a,2,2,'SUMX2MY2');const[X,Y]=pairs(a[0],a[1],'SUMX2MY2');return sumOf(X.map((x,i)=>x*x-Y[i]*Y[i]))},
  SUMX2PY2:a=>{argc(a,2,2,'SUMX2PY2');const[X,Y]=pairs(a[0],a[1],'SUMX2PY2');return sumOf(X.map((x,i)=>x*x+Y[i]*Y[i]))},
  SUMXMY2:a=>{argc(a,2,2,'SUMXMY2');const[X,Y]=pairs(a[0],a[1],'SUMXMY2');return sumOf(X.map((x,i)=>(x-Y[i])**2))},
  MMULT:a=>{argc(a,2,2,'MMULT');return arr(mmul(matrix(a[0],'MMULT'),matrix(a[1],'MMULT')))},
  MDETERM:a=>{argc(a,1,1,'MDETERM');return det(matrix(a[0],'MDETERM'))},
  MINVERSE:a=>{argc(a,1,1,'MINVERSE');return arr(inv(matrix(a[0],'MINVERSE')))},
  MUNIT:a=>{const n=Math.trunc(N1(a,0,'MUNIT',1,1));if(n<1)throw new XErr('#VALUE!','Ukuran minimal 1');sizeOk(n,n,'MUNIT');return arr(Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?1:0)))},
  RANDARRAY:a=>{argc(a,0,5,'RANDARRAY');const r=Math.trunc(num(opt(a,0,1))),c=Math.trunc(num(opt(a,1,1))),lo=num(opt(a,2,0)),hi=num(opt(a,3,1)),whole=a[4]!==undefined&&truthy(a[4]);sizeOk(r,c,'RANDARRAY');
    return arr(Array.from({length:r},()=>Array.from({length:c},()=>whole?lo+Math.floor(Math.random()*(hi-lo+1)):lo+Math.random()*(hi-lo))))},
  ROMAN:a=>{argc(a,1,2,'ROMAN');return roman(num(a[0]))}, ARABIC:a=>{argc(a,1,1,'ARABIC');return arabic(a[0])},
  BASE:a=>{argc(a,2,3,'BASE');const n=Math.trunc(num(a[0])),b=Math.trunc(num(a[1]));if(n<0||b<2||b>36)throw new XErr('#NUM!','Argumen BASE tidak valid');let s=n.toString(b).toUpperCase();if(a[2]!==undefined)s=s.padStart(Math.trunc(num(a[2])),'0');return s},
  DECIMAL:a=>{argc(a,2,2,'DECIMAL');const b=Math.trunc(num(a[1])),s=text(a[0]).trim();const v=parseInt(s,b);if(isNaN(v)||[...s.toUpperCase()].some(c=>parseInt(c,b)>=b||isNaN(parseInt(c,b))))throw new XErr('#NUM!','"'+s+'" bukan bilangan basis '+b);return v},
  AGGREGATE:a=>{argc(a,3,99,'AGGREGATE');const f=Math.trunc(num(a[0])),opt2=Math.trunc(num(a[1]));const ign=[2,3,6,7].includes(opt2);
    const vals=flat(a.slice(2,f>=14?3:undefined)).filter(v=>{if(isErr(v)){if(ign)return false;throw v}return typeof v==='number'});
    const k=f>=14?num(a[3]):undefined;
    const m={1:'AVERAGE',2:'COUNT',3:'COUNTA',4:'MAX',5:'MIN',6:'PRODUCT',7:'STDEV.S',8:'STDEV.P',9:'SUM',10:'VAR.S',11:'VAR.P',12:'MEDIAN',13:'MODE.SNGL',14:'LARGE',15:'SMALL',16:'PERCENTILE.INC',17:'QUARTILE.INC',18:'PERCENTILE.EXC',19:'QUARTILE.EXC'}[f];
    if(!m)throw new XErr('#VALUE!','Nomor fungsi AGGREGATE harus 1–19');const A=arr(vals.map(v=>[v]));return f>=14?FN[m]([A,k]):FN[m]([A])},
  /* statistik */
  'STDEV.P':a=>{const n=needN(nums(a),1,'STDEV.P');return Math.sqrt(ss(n)/n.length)}, STDEVP:a=>FN['STDEV.P'](a),
  STDEVA:a=>{const n=needN(numsA(a),2,'STDEVA');return Math.sqrt(ss(n)/(n.length-1))}, STDEVPA:a=>{const n=needN(numsA(a),1,'STDEVPA');return Math.sqrt(ss(n)/n.length)},
  'VAR.P':a=>{const n=needN(nums(a),1,'VAR.P');return ss(n)/n.length}, VARP:a=>FN['VAR.P'](a),
  VARA:a=>{const n=needN(numsA(a),2,'VARA');return ss(n)/(n.length-1)}, VARPA:a=>{const n=needN(numsA(a),1,'VARPA');return ss(n)/n.length},
  MAXA:a=>{const n=numsA(a);return n.length?Math.max(...n):0}, MINA:a=>{const n=numsA(a);return n.length?Math.min(...n):0},
  'MODE.MULT':a=>{const n=nums(a),c=new Map();for(const x of n)c.set(x,(c.get(x)||0)+1);const mx=Math.max(...c.values());if(mx<2)throw new XErr('#N/A','Tidak ada angka yang muncul lebih dari sekali');return arr([...c].filter(([,k])=>k===mx).map(([x])=>[x]))},
  'PERCENTILE.EXC':a=>{argc(a,2,2,'PERCENTILE.EXC');return pctExc(nums([a[0]]),num(a[1]))},
  'QUARTILE.EXC':a=>{argc(a,2,2,'QUARTILE.EXC');const q=Math.trunc(num(a[1]));if(q<1||q>3)throw new XErr('#NUM!','Kuartil .EXC harus 1 sampai 3');return pctExc(nums([a[0]]),q/4)},
  'PERCENTRANK.INC':a=>{argc(a,2,3,'PERCENTRANK.INC');const n=nums([a[0]]).sort((x,y)=>x-y),x=num(a[1]),sig=Math.trunc(num(opt(a,2,3)));if(x<n[0]||x>n[n.length-1])throw new XErr('#N/A','Nilai di luar jangkauan data');
    let i=n.findIndex(v=>v>=x);let r;if(n[i]===x)r=n.indexOf(x)/(n.length-1);else{const lo=i-1;r=(lo+(x-n[lo])/(n[i]-n[lo]))/(n.length-1)}const f=Math.pow(10,sig);return Math.floor(r*f+1e-9)/f},
  PERCENTRANK:a=>FN['PERCENTRANK.INC'](a),
  'PERCENTRANK.EXC':a=>{argc(a,2,3,'PERCENTRANK.EXC');const n=nums([a[0]]).sort((x,y)=>x-y),x=num(a[1]),sig=Math.trunc(num(opt(a,2,3)));if(x<n[0]||x>n[n.length-1])throw new XErr('#N/A','Nilai di luar jangkauan data');
    let i=n.findIndex(v=>v>=x);let pos=n[i]===x?n.indexOf(x)+1:i+(x-n[i-1])/(n[i]-n[i-1]);const f=Math.pow(10,sig);return Math.floor(pos/(n.length+1)*f+1e-9)/f},
  'RANK.AVG':a=>{argc(a,2,3,'RANK.AVG');const x=num(a[0]),list=nums([needRange(a[1],'RANK.AVG')]),asc=a[2]!==undefined&&num(a[2])!==0;if(!list.includes(x))throw new XErr('#N/A','Nilai tidak ada di daftar');
    const better=list.filter(v=>asc?v<x:v>x).length,same=list.filter(v=>v===x).length;return better+(same+1)/2},
  CORREL:a=>{argc(a,2,2,'CORREL');const[X,Y]=pairs(a[0],a[1],'CORREL');return corr(X,Y)}, PEARSON:a=>FN.CORREL(a),
  RSQ:a=>{argc(a,2,2,'RSQ');const[Y,X]=pairs(a[0],a[1],'RSQ');return corr(X,Y)**2},
  SLOPE:a=>{argc(a,2,2,'SLOPE');const[Y,X]=pairs(a[0],a[1],'SLOPE');return lin(Y,X).b},
  INTERCEPT:a=>{argc(a,2,2,'INTERCEPT');const[Y,X]=pairs(a[0],a[1],'INTERCEPT');return lin(Y,X).a},
  STEYX:a=>{argc(a,2,2,'STEYX');const[Y,X]=pairs(a[0],a[1],'STEYX');if(X.length<3)throw new XErr('#DIV/0!','Butuh minimal tiga pasang data');const l=lin(Y,X);return Math.sqrt(sumOf(Y.map((y,i)=>(y-(l.a+l.b*X[i]))**2))/(X.length-2))},
  'FORECAST.LINEAR':a=>{argc(a,3,3,'FORECAST.LINEAR');const[Y,X]=pairs(a[1],a[2],'FORECAST');const l=lin(Y,X);return l.a+l.b*num(a[0])}, FORECAST:a=>FN['FORECAST.LINEAR'](a),
  TREND:a=>{argc(a,1,4,'TREND');const ys=flat([a[0]]).filter(v=>typeof v==='number');const xs=a[1]!==undefined?flat([a[1]]).filter(v=>typeof v==='number'):ys.map((_,i)=>i+1);const l=lin(ys,xs);
    const nx=a[2]!==undefined?asArr(a[2]):arr(xs.map(x=>[x]));return arr(nx.rows.map(r=>r.map(x=>l.a+l.b*num(x))))},
  GROWTH:a=>{argc(a,1,4,'GROWTH');const ys=flat([a[0]]).filter(v=>typeof v==='number');if(ys.some(y=>y<=0))throw new XErr('#NUM!','GROWTH butuh nilai y positif');const xs=a[1]!==undefined?flat([a[1]]).filter(v=>typeof v==='number'):ys.map((_,i)=>i+1);const l=lin(ys.map(Math.log),xs);
    const nx=a[2]!==undefined?asArr(a[2]):arr(xs.map(x=>[x]));return arr(nx.rows.map(r=>r.map(x=>Math.exp(l.a+l.b*num(x)))))},
  LINEST:a=>{argc(a,1,2,'LINEST');const ys=flat([a[0]]).filter(v=>typeof v==='number');const xs=a[1]!==undefined?flat([a[1]]).filter(v=>typeof v==='number'):ys.map((_,i)=>i+1);const l=lin(ys,xs);return arr([[l.b,l.a]])},
  'COVARIANCE.P':a=>{argc(a,2,2,'COVARIANCE.P');const[X,Y]=pairs(a[0],a[1],'COVARIANCE.P');const mx=mean(X),my=mean(Y);return sumOf(X.map((x,i)=>(x-mx)*(Y[i]-my)))/X.length}, COVAR:a=>FN['COVARIANCE.P'](a),
  'COVARIANCE.S':a=>{argc(a,2,2,'COVARIANCE.S');const[X,Y]=pairs(a[0],a[1],'COVARIANCE.S');const mx=mean(X),my=mean(Y);return sumOf(X.map((x,i)=>(x-mx)*(Y[i]-my)))/(X.length-1)},
  GEOMEAN:a=>{const n=needN(nums(a),1,'GEOMEAN');if(n.some(x=>x<=0))throw new XErr('#NUM!','GEOMEAN hanya untuk angka positif');return Math.exp(mean(n.map(Math.log)))},
  HARMEAN:a=>{const n=needN(nums(a),1,'HARMEAN');if(n.some(x=>x<=0))throw new XErr('#NUM!','HARMEAN hanya untuk angka positif');return n.length/sumOf(n.map(x=>1/x))},
  TRIMMEAN:a=>{argc(a,2,2,'TRIMMEAN');const n=nums([a[0]]).sort((x,y)=>x-y),p=num(a[1]);if(p<0||p>=1)throw new XErr('#NUM!','Persentase harus 0 sampai kurang dari 1');let k=Math.floor(n.length*p/2);return mean(n.slice(k,n.length-k))},
  AVEDEV:a=>{const n=needN(nums(a),1,'AVEDEV'),m=mean(n);return mean(n.map(x=>Math.abs(x-m)))},
  DEVSQ:a=>ss(needN(nums(a),1,'DEVSQ')),
  KURT:a=>{const n=needN(nums(a),4,'KURT'),N=n.length,m=mean(n),s=Math.sqrt(ss(n)/(N-1));return N*(N+1)/((N-1)*(N-2)*(N-3))*sumOf(n.map(x=>((x-m)/s)**4))-3*(N-1)**2/((N-2)*(N-3))},
  SKEW:a=>{const n=needN(nums(a),3,'SKEW'),N=n.length,m=mean(n),s=Math.sqrt(ss(n)/(N-1));return N/((N-1)*(N-2))*sumOf(n.map(x=>((x-m)/s)**3))},
  'SKEW.P':a=>{const n=needN(nums(a),3,'SKEW.P'),N=n.length,m=mean(n),s=Math.sqrt(ss(n)/N);return sumOf(n.map(x=>((x-m)/s)**3))/N},
  STANDARDIZE:a=>{argc(a,3,3,'STANDARDIZE');const sd=num(a[2]);if(sd<=0)throw new XErr('#NUM!','Simpangan baku harus positif');return(num(a[0])-num(a[1]))/sd},
  FREQUENCY:a=>{argc(a,2,2,'FREQUENCY');const d=nums([a[0]]),b=nums([a[1]]);const bins=b.slice().sort((x,y)=>x-y);const cnt=bins.map(()=>0).concat([0]);for(const x of d){const i=bins.findIndex(v=>x<=v);cnt[i<0?bins.length:i]++}
    const out=b.map(v=>cnt[bins.indexOf(v)]);out.push(cnt[bins.length]);return arr(out.map(x=>[x]))},
  'NORM.DIST':a=>{argc(a,4,4,'NORM.DIST');const x=num(a[0]),m=num(a[1]),s=num(a[2]);if(s<=0)throw new XErr('#NUM!','Simpangan baku harus positif');const z=(x-m)/s;return truthy(a[3])?ncdf(z):npdf(z)/s},
  NORMDIST:a=>FN['NORM.DIST'](a),
  'NORM.INV':a=>{argc(a,3,3,'NORM.INV');const s=num(a[2]);if(s<=0)throw new XErr('#NUM!','Simpangan baku harus positif');return num(a[1])+s*ninv(num(a[0]))}, NORMINV:a=>FN['NORM.INV'](a),
  'NORM.S.DIST':a=>{argc(a,1,2,'NORM.S.DIST');const z=num(a[0]);return a[1]===undefined||truthy(a[1])?ncdf(z):npdf(z)}, NORMSDIST:a=>ncdf(N1(a,0,'NORMSDIST',1,1)),
  'NORM.S.INV':a=>ninv(N1(a,0,'NORM.S.INV',1,1)), NORMSINV:a=>ninv(N1(a,0,'NORMSINV',1,1)),
  'LOGNORM.DIST':a=>{argc(a,4,4,'LOGNORM.DIST');const x=num(a[0]),m=num(a[1]),s=num(a[2]);if(x<=0||s<=0)throw new XErr('#NUM!','Argumen tidak valid');const z=(Math.log(x)-m)/s;return truthy(a[3])?ncdf(z):npdf(z)/(x*s)},
  'BINOM.DIST':a=>{argc(a,4,4,'BINOM.DIST');const k=Math.trunc(num(a[0])),n=Math.trunc(num(a[1])),p=num(a[2]);if(k<0||k>n||p<0||p>1)throw new XErr('#NUM!','Argumen BINOM.DIST tidak valid');const f=i=>combin(n,i)*Math.pow(p,i)*Math.pow(1-p,n-i);if(!truthy(a[3]))return f(k);let s=0;for(let i=0;i<=k;i++)s+=f(i);return s},
  BINOMDIST:a=>FN['BINOM.DIST'](a),
  'POISSON.DIST':a=>{argc(a,3,3,'POISSON.DIST');const k=Math.trunc(num(a[0])),l=num(a[1]);if(k<0||l<0)throw new XErr('#NUM!','Argumen tidak valid');const f=i=>Math.exp(-l+i*Math.log(l||1e-300)-gammaln(i+1));if(!truthy(a[2]))return l===0?(k===0?1:0):f(k);let s=0;for(let i=0;i<=k;i++)s+=l===0?(i===0?1:0):f(i);return s},
  POISSON:a=>FN['POISSON.DIST'](a),
  'EXPON.DIST':a=>{argc(a,3,3,'EXPON.DIST');const x=num(a[0]),l=num(a[1]);if(x<0||l<=0)throw new XErr('#NUM!','Argumen tidak valid');return truthy(a[2])?1-Math.exp(-l*x):l*Math.exp(-l*x)}, EXPONDIST:a=>FN['EXPON.DIST'](a),
  'WEIBULL.DIST':a=>{argc(a,4,4,'WEIBULL.DIST');const x=num(a[0]),k=num(a[1]),l=num(a[2]);if(x<0||k<=0||l<=0)throw new XErr('#NUM!','Argumen tidak valid');return truthy(a[3])?1-Math.exp(-Math.pow(x/l,k)):k/l*Math.pow(x/l,k-1)*Math.exp(-Math.pow(x/l,k))},
  GAMMA:a=>{const x=N1(a,0,'GAMMA',1,1);if(x<=0&&Number.isInteger(x))throw new XErr('#NUM!','GAMMA tidak terdefinisi untuk 0 dan bilangan bulat negatif');return x>0?Math.exp(gammaln(x)):Math.PI/(Math.sin(Math.PI*x)*Math.exp(gammaln(1-x)))},
  GAMMALN:a=>{const x=N1(a,0,'GAMMALN',1,1);if(x<=0)throw new XErr('#NUM!','GAMMALN butuh angka positif');return gammaln(x)}, 'GAMMALN.PRECISE':a=>FN.GAMMALN(a),
  'GAMMA.DIST':a=>{argc(a,4,4,'GAMMA.DIST');const x=num(a[0]),k=num(a[1]),t=num(a[2]);if(x<0||k<=0||t<=0)throw new XErr('#NUM!','Argumen tidak valid');return truthy(a[3])?igamma(k,x/t):Math.exp((k-1)*Math.log(x||1e-300)-x/t-gammaln(k)-k*Math.log(t))},
  'BETA.DIST':a=>{argc(a,4,6,'BETA.DIST');const lo=num(opt(a,4,0)),hi=num(opt(a,5,1)),x=(num(a[0])-lo)/(hi-lo),al=num(a[1]),be=num(a[2]);if(x<0||x>1||al<=0||be<=0)throw new XErr('#NUM!','Argumen tidak valid');
    return truthy(a[3])?ibeta(x,al,be):Math.exp((al-1)*Math.log(x)+(be-1)*Math.log(1-x)+gammaln(al+be)-gammaln(al)-gammaln(be))/(hi-lo)},
  'T.DIST':a=>{argc(a,3,3,'T.DIST');const t=num(a[0]),df=num(a[1]);if(df<1)throw new XErr('#NUM!','Derajat bebas minimal 1');return truthy(a[2])?tcdf(t,df):tpdf(t,df)},
  'T.DIST.2T':a=>{argc(a,2,2,'T.DIST.2T');const t=num(a[0]),df=num(a[1]);if(t<0||df<1)throw new XErr('#NUM!','Argumen tidak valid');return 2*(1-tcdf(t,df))},
  'T.DIST.RT':a=>{argc(a,2,2,'T.DIST.RT');return 1-tcdf(num(a[0]),num(a[1]))},
  TDIST:a=>{argc(a,3,3,'TDIST');const t=num(a[0]),df=num(a[1]),tails=num(a[2]);return tails*(1-tcdf(t,df))},
  'T.INV':a=>{argc(a,2,2,'T.INV');const p=num(a[0]),df=num(a[1]);return p<0.5?-invert(x=>tcdf(x,df),1-p,0,10):invert(x=>tcdf(x,df),p,0,10)},
  'T.INV.2T':a=>{argc(a,2,2,'T.INV.2T');const p=num(a[0]),df=num(a[1]);return invert(x=>tcdf(x,df),1-p/2,0,10)}, TINV:a=>FN['T.INV.2T'](a),
  'CHISQ.DIST':a=>{argc(a,3,3,'CHISQ.DIST');const x=num(a[0]),k=num(a[1]);if(x<0||k<1)throw new XErr('#NUM!','Argumen tidak valid');return truthy(a[2])?chicdf(x,k):Math.exp((k/2-1)*Math.log(x||1e-300)-x/2-k/2*Math.log(2)-gammaln(k/2))},
  'CHISQ.DIST.RT':a=>{argc(a,2,2,'CHISQ.DIST.RT');return 1-chicdf(num(a[0]),num(a[1]))}, CHIDIST:a=>FN['CHISQ.DIST.RT'](a),
  'CHISQ.INV':a=>{argc(a,2,2,'CHISQ.INV');const k=num(a[1]);return invert(x=>chicdf(x,k),num(a[0]),0,k+10)},
  'CHISQ.INV.RT':a=>{argc(a,2,2,'CHISQ.INV.RT');const k=num(a[1]);return invert(x=>chicdf(x,k),1-num(a[0]),0,k+10)}, CHIINV:a=>FN['CHISQ.INV.RT'](a),
  'CHISQ.TEST':a=>{argc(a,2,2,'CHISQ.TEST');const O=asArr(a[0]).rows,E=asArr(a[1]).rows;let x=0;O.forEach((r,i)=>r.forEach((o,j)=>{const e=num(E[i]?.[j]);x+=(num(o)-e)**2/e}));const R=O.length,C=O[0].length;const df=R>1&&C>1?(R-1)*(C-1):R*C-1;return 1-chicdf(x,df)}, CHITEST:a=>FN['CHISQ.TEST'](a),
  'F.DIST':a=>{argc(a,4,4,'F.DIST');const x=num(a[0]),d1=num(a[1]),d2=num(a[2]);if(!truthy(a[3]))return Math.exp(0.5*(d1*Math.log(d1*x)+d2*Math.log(d2)-(d1+d2)*Math.log(d1*x+d2))-Math.log(x)-(gammaln(d1/2)+gammaln(d2/2)-gammaln((d1+d2)/2)));return fcdf(x,d1,d2)},
  'F.DIST.RT':a=>{argc(a,3,3,'F.DIST.RT');return 1-fcdf(num(a[0]),num(a[1]),num(a[2]))}, FDIST:a=>FN['F.DIST.RT'](a),
  'F.INV':a=>{argc(a,3,3,'F.INV');const d1=num(a[1]),d2=num(a[2]);return invert(x=>fcdf(x,d1,d2),num(a[0]),0,10)},
  'F.INV.RT':a=>{argc(a,3,3,'F.INV.RT');const d1=num(a[1]),d2=num(a[2]);return invert(x=>fcdf(x,d1,d2),1-num(a[0]),0,10)}, FINV:a=>FN['F.INV.RT'](a),
  'CONFIDENCE.NORM':a=>{argc(a,3,3,'CONFIDENCE.NORM');return -ninv(num(a[0])/2)*num(a[1])/Math.sqrt(num(a[2]))}, CONFIDENCE:a=>FN['CONFIDENCE.NORM'](a),
  'CONFIDENCE.T':a=>{argc(a,3,3,'CONFIDENCE.T');const n=num(a[2]);return FN['T.INV.2T']([num(a[0]),n-1])*num(a[1])/Math.sqrt(n)},
  'Z.TEST':a=>{argc(a,2,3,'Z.TEST');const n=nums([a[0]]),x=num(a[1]),s=a[2]!==undefined?num(a[2]):Math.sqrt(ss(n)/(n.length-1));return 1-ncdf((mean(n)-x)/(s/Math.sqrt(n.length)))}, ZTEST:a=>FN['Z.TEST'](a),
  'T.TEST':a=>{argc(a,4,4,'T.TEST');const tails=Math.trunc(num(a[2])),type=Math.trunc(num(a[3]));let t,df;
    if(type===1){const[X,Y]=pairs(a[0],a[1],'T.TEST');const d=X.map((x,i)=>x-Y[i]);df=d.length-1;t=mean(d)/Math.sqrt(ss(d)/df/d.length)}
    else{const X=nums([a[0]]),Y=nums([a[1]]),n1=X.length,n2=Y.length,v1=ss(X)/(n1-1),v2=ss(Y)/(n2-1);
      if(type===2){df=n1+n2-2;const sp=((n1-1)*v1+(n2-1)*v2)/df;t=(mean(X)-mean(Y))/Math.sqrt(sp*(1/n1+1/n2))}
      else{const q=v1/n1+v2/n2;t=(mean(X)-mean(Y))/Math.sqrt(q);df=q*q/((v1/n1)**2/(n1-1)+(v2/n2)**2/(n2-1))}}
    return tails*(1-tcdf(Math.abs(t),df))}, TTEST:a=>FN['T.TEST'](a),
  'F.TEST':a=>{argc(a,2,2,'F.TEST');const X=nums([a[0]]),Y=nums([a[1]]),v1=ss(X)/(X.length-1),v2=ss(Y)/(Y.length-1);const f=v1/v2,p=fcdf(f,X.length-1,Y.length-1);return 2*Math.min(p,1-p)}, FTEST:a=>FN['F.TEST'](a),
  FISHER:a=>{const x=N1(a,0,'FISHER',1,1);return 0.5*Math.log((1+x)/(1-x))}, FISHERINV:a=>{const y=N1(a,0,'FISHERINV',1,1);return(Math.exp(2*y)-1)/(Math.exp(2*y)+1)},
  ERF:a=>{argc(a,1,2,'ERF');return a[1]===undefined?erf(num(a[0])):erf(num(a[1]))-erf(num(a[0]))}, 'ERF.PRECISE':a=>erf(N1(a,0,'ERF.PRECISE',1,1)),
  ERFC:a=>1-erf(N1(a,0,'ERFC',1,1)), 'ERFC.PRECISE':a=>1-erf(N1(a,0,'ERFC.PRECISE',1,1)),
  PHI:a=>npdf(N1(a,0,'PHI',1,1)), GAUSS:a=>ncdf(N1(a,0,'GAUSS',1,1))-0.5,
  PROB:a=>{argc(a,3,4,'PROB');const[X,P]=pairs(a[0],a[1],'PROB');const lo=num(a[2]),hi=a[3]!==undefined?num(a[3]):lo;return sumOf(P.filter((_,i)=>X[i]>=lo&&X[i]<=hi))},
  /* tanggal */
  ISOWEEKNUM:a=>{const s=Math.floor(N1(a,0,'ISOWEEKNUM',1,1));const w=(fromSerial(s).w+6)%7;const th=s-w+3;const p=fromSerial(th);return Math.floor((th-toSerial(p.y,1,1))/7)+1},
  YEARFRAC:a=>{argc(a,2,3,'YEARFRAC');return yearfrac(Math.floor(num(a[0])),Math.floor(num(a[1])),Math.trunc(num(opt(a,2,0))))},
  DAYS360:a=>{argc(a,2,3,'DAYS360');const p=fromSerial(Math.floor(num(a[0]))),q=fromSerial(Math.floor(num(a[1])));const eu=a[2]!==undefined&&truthy(a[2]);let d1=p.d,d2=q.d;
    if(eu){if(d1===31)d1=30;if(d2===31)d2=30}else{const lastFeb=x=>x.m===2&&fromSerial(toSerial(x.y,x.m,x.d)+1).m===3;if(lastFeb(p))d1=30;if(d1===31)d1=30;if(d2===31&&d1>=30)d2=30}
    return(q.y-p.y)*360+(q.m-p.m)*30+(d2-d1)},
  'NETWORKDAYS.INTL':a=>{argc(a,2,4,'NETWORKDAYS.INTL');let s=Math.floor(num(a[0])),e=Math.floor(num(a[1]));const sign=s<=e?1:-1;if(sign<0)[s,e]=[e,s];if(e-s>1e6)throw new XErr('#NUM!','Rentang tanggal terlalu panjang');const m=weekendMask(a[2]),h=holidays(a[3]);let n=0;for(let d=s;d<=e;d++)if(isWorkdayM(d,m,h))n++;return n*sign},
  'WORKDAY.INTL':a=>{argc(a,2,4,'WORKDAY.INTL');let d=Math.floor(num(a[0])),k=Math.trunc(num(a[1]));if(Math.abs(k)>1e5)throw new XErr('#NUM!','Jumlah hari terlalu besar');const m=weekendMask(a[2]);if(m.every(x=>x))throw new XErr('#VALUE!','Semua hari tidak boleh akhir pekan');const h=holidays(a[3]),st=k<0?-1:1;while(k!==0){d+=st;if(isWorkdayM(d,m,h))k-=st}return d},
  TIMEVALUE:a=>{argc(a,1,1,'TIMEVALUE');const s=text(a[0]).trim();const m=/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i.exec(s);if(!m)throw new XErr('#VALUE!','"'+s+'" bukan teks waktu');let h=+m[1];if(m[4]){const pm=m[4].toUpperCase()==='PM';if(h===12)h=pm?12:0;else if(pm)h+=12}return(h*3600+ +m[2]*60+ +(m[3]||0))/86400%1},
  /* teks */
  UNICHAR:a=>String.fromCodePoint(Math.trunc(N1(a,0,'UNICHAR',1,1))), UNICODE:a=>{const s=text(a[0]);if(!s)throw new XErr('#VALUE!','Teks kosong');return s.codePointAt(0)},
  FIXED:a=>{argc(a,1,3,'FIXED');const d=Math.trunc(num(opt(a,1,2))),nc=a[2]!==undefined&&truthy(a[2]);const x=roundTo(num(a[0]),d);return x.toLocaleString('id-ID',{minimumFractionDigits:Math.max(0,d),maximumFractionDigits:Math.max(0,d),useGrouping:!nc})},
  DOLLAR:a=>{argc(a,1,2,'DOLLAR');const d=Math.trunc(num(opt(a,1,2))),x=roundTo(num(a[0]),d);const s='Rp'+Math.abs(x).toLocaleString('id-ID',{minimumFractionDigits:Math.max(0,d),maximumFractionDigits:Math.max(0,d)});return x<0?'('+s+')':s},
  NUMBERVALUE:a=>{argc(a,1,3,'NUMBERVALUE');let s=text(a[0]).replace(/\s/g,'');const dec=a[1]!==undefined?text(a[1]):',',grp=a[2]!==undefined?text(a[2]):'.';let pct=0;while(s.endsWith('%')){pct++;s=s.slice(0,-1)}
    s=s.split(grp).join('').replace(dec,'.');const v=Number(s);if(s===''||isNaN(v))throw new XErr('#VALUE!','"'+text(a[0])+'" tidak bisa diubah jadi angka');return v/Math.pow(100,pct)},
  T:a=>{argc(a,1,1,'T');const v=one(a[0]);return typeof v==='string'?v:''},
  N:a=>{argc(a,1,1,'N');const v=one(a[0]);return typeof v==='number'?v:typeof v==='boolean'?(v?1:0):0},
  VALUETOTEXT:a=>{argc(a,1,2,'VALUETOTEXT');const v=one(a[0]);return typeof v==='string'&&a[1]!==undefined&&num(a[1])===1?'"'+v+'"':text(v)},
  ARRAYTOTEXT:a=>{argc(a,1,2,'ARRAYTOTEXT');const r=asArr(a[0]).rows,strict=a[1]!==undefined&&num(a[1])===1;const t=v=>strict&&typeof v==='string'?'"'+v+'"':text(v);return strict?'{'+r.map(x=>x.map(t).join(',')).join(';')+'}':r.flat().map(t).join(', ')},
  HYPERLINK:a=>{argc(a,1,2,'HYPERLINK');return text(a[1]!==undefined?a[1]:a[0])},
  /* info */
  ISLOGICAL:a=>typeof one(a[0])==='boolean', ISNONTEXT:a=>typeof one(a[0])!=='string',
  ISEVEN:a=>Math.trunc(N1(a,0,'ISEVEN',1,1))%2===0, ISODD:a=>Math.abs(Math.trunc(N1(a,0,'ISODD',1,1))%2)===1,
  NA:a=>{argc(a,0,0,'NA');throw new XErr('#N/A','Nilai sengaja dibuat #N/A')},
  /* keuangan */
  NPER:a=>{argc(a,3,5,'NPER');const r=num(a[0]),p=num(a[1]),pv=num(a[2]),fv=num(opt(a,3,0)),t=num(opt(a,4,0));if(r===0){if(!p)throw new XErr('#NUM!','Cicilan tidak boleh 0');return-(pv+fv)/p}
    const z=p*(1+r*t)/r,v=(z-fv)/(z+pv);if(v<=0)throw new XErr('#NUM!','Cicilan terlalu kecil untuk melunasi pinjaman');return Math.log(v)/Math.log(1+r)},
  XNPV:a=>{argc(a,3,3,'XNPV');const v=nums([a[1]]),d=nums([a[2]]);if(v.length!==d.length)throw new XErr('#NUM!','Jumlah arus kas dan tanggal harus sama');return xnpv(num(a[0]),v,d)},
  XIRR:a=>{argc(a,2,3,'XIRR');const v=nums([a[0]]),d=nums([a[1]]);if(v.length!==d.length)throw new XErr('#NUM!','Jumlah arus kas dan tanggal harus sama');let r=a[2]!==undefined?num(a[2]):0.1;
    for(let k=0;k<200;k++){const f=xnpv(r,v,d);const df=v.reduce((s,x,i)=>s-(d[i]-d[0])/365*x/Math.pow(1+r,(d[i]-d[0])/365+1),0);if(!df)break;const nr=r-f/df;if(Math.abs(nr-r)<1e-10)return nr;r=nr<=-0.99?-0.99:nr}throw new XErr('#NUM!','XIRR tidak menemukan jawaban')},
  MIRR:a=>{argc(a,3,3,'MIRR');const v=nums([a[0]]),fr=num(a[1]),rr=num(a[2]),n=v.length;const pos=v.reduce((s,x,i)=>s+(x>0?x*Math.pow(1+rr,n-1-i):0),0),neg=v.reduce((s,x,i)=>s+(x<0?x/Math.pow(1+fr,i):0),0);if(!neg||!pos)throw new XErr('#DIV/0!','Butuh arus kas positif dan negatif');return Math.pow(-pos/neg,1/(n-1))-1},
  EFFECT:a=>{argc(a,2,2,'EFFECT');const r=num(a[0]),n=Math.trunc(num(a[1]));if(r<=0||n<1)throw new XErr('#NUM!','Argumen tidak valid');return Math.pow(1+r/n,n)-1},
  NOMINAL:a=>{argc(a,2,2,'NOMINAL');const r=num(a[0]),n=Math.trunc(num(a[1]));if(r<=0||n<1)throw new XErr('#NUM!','Argumen tidak valid');return n*(Math.pow(1+r,1/n)-1)},
  DDB:a=>{argc(a,4,5,'DDB');const c=num(a[0]),s=num(a[1]),l=num(a[2]),p=num(a[3]),f=num(opt(a,4,2));if(p<1||p>l)throw new XErr('#NUM!','Periode di luar umur manfaat');return ddb(c,s,l,p,f)},
  DB:a=>{argc(a,4,5,'DB');const c=num(a[0]),s=num(a[1]),l=num(a[2]),p=Math.trunc(num(a[3])),m=num(opt(a,4,12));const rate=Math.round((1-Math.pow(s/c,1/l))*1000)/1000;let tot=0,dep=0;
    for(let i=1;i<=p;i++){dep=i===1?c*rate*m/12:i===Math.ceil(l)+1?(c-tot)*rate*(12-m)/12:(c-tot)*rate;tot+=dep}return dep},
  SYD:a=>{argc(a,4,4,'SYD');const c=num(a[0]),s=num(a[1]),l=num(a[2]),p=num(a[3]);return(c-s)*(l-p+1)*2/(l*(l+1))},
  VDB:a=>{argc(a,5,7,'VDB');const c=num(a[0]),s=num(a[1]),l=num(a[2]),st=num(a[3]),en=num(a[4]),f=num(opt(a,5,2));let bv=c,tot=0;for(let i=1;i<=Math.ceil(en);i++){const d=Math.max(0,Math.min(bv*f/l,bv-s,Math.max((bv-s)/(l-i+1),0)>bv*f/l&&!(a[6]!==undefined&&truthy(a[6]))?(bv-s)/(l-i+1):bv*f/l));const w=Math.max(0,Math.min(i,en)-Math.max(i-1,st));tot+=d*w;bv-=d}return tot},
  PDURATION:a=>{argc(a,3,3,'PDURATION');const r=num(a[0]),pv=num(a[1]),fv=num(a[2]);if(r<=0||pv<=0||fv<=0)throw new XErr('#NUM!','Argumen harus positif');return(Math.log(fv)-Math.log(pv))/Math.log(1+r)},
  RRI:a=>{argc(a,3,3,'RRI');const n=num(a[0]),pv=num(a[1]),fv=num(a[2]);if(n<=0||pv===0)throw new XErr('#NUM!','Argumen tidak valid');return Math.pow(fv/pv,1/n)-1},
  FVSCHEDULE:a=>{argc(a,2,2,'FVSCHEDULE');return nums([a[1]]).reduce((p,r)=>p*(1+r),num(a[0]))},
  ISPMT:a=>{argc(a,4,4,'ISPMT');const r=num(a[0]),per=num(a[1]),n=num(a[2]),pv=num(a[3]);return-pv*r*(1-per/n)},
  DOLLARDE:a=>{argc(a,2,2,'DOLLARDE');const x=num(a[0]),f=Math.trunc(num(a[1]));const i=Math.trunc(x),d=x-i,digits=Math.ceil(Math.log10(f));return i+d*Math.pow(10,digits)/f},
  DOLLARFR:a=>{argc(a,2,2,'DOLLARFR');const x=num(a[0]),f=Math.trunc(num(a[1]));const i=Math.trunc(x),d=x-i,digits=Math.ceil(Math.log10(f));return i+d*f/Math.pow(10,digits)},
  /* database */
  DSUM:a=>sumOf(dnums(a,'DSUM')), DAVERAGE:a=>{const n=dnums(a,'DAVERAGE');if(!n.length)throw new XErr('#DIV/0!','Tidak ada baris yang cocok');return mean(n)},
  DCOUNT:a=>{argc(a,2,3,'DCOUNT');if(a.length===2){const{rows}=dbRows(a[0],undefined,a[1],'DCOUNT');return rows.length}return dnums(a,'DCOUNT').length},
  DCOUNTA:a=>{argc(a,2,3,'DCOUNTA');if(a.length===2){const{rows}=dbRows(a[0],undefined,a[1],'DCOUNTA');return rows.length}return dvals(a,'DCOUNTA').filter(v=>v!=null&&v!=='').length},
  DMAX:a=>{const n=dnums(a,'DMAX');return n.length?Math.max(...n):0}, DMIN:a=>{const n=dnums(a,'DMIN');return n.length?Math.min(...n):0},
  DPRODUCT:a=>dnums(a,'DPRODUCT').reduce((p,x)=>p*x,1),
  DGET:a=>{const v=dvals(a,'DGET');if(!v.length)throw new XErr('#VALUE!','Tidak ada baris yang cocok');if(v.length>1)throw new XErr('#NUM!','Lebih dari satu baris cocok');return v[0]},
  DSTDEV:a=>{const n=needN(dnums(a,'DSTDEV'),2,'DSTDEV');return Math.sqrt(ss(n)/(n.length-1))}, DSTDEVP:a=>{const n=needN(dnums(a,'DSTDEVP'),1,'DSTDEVP');return Math.sqrt(ss(n)/n.length)},
  DVAR:a=>{const n=needN(dnums(a,'DVAR'),2,'DVAR');return ss(n)/(n.length-1)}, DVARP:a=>{const n=needN(dnums(a,'DVARP'),1,'DVARP');return ss(n)/n.length},
  /* rekayasa: basis bilangan, konversi, bit */
  DEC2BIN:a=>{argc(a,1,2,'DEC2BIN');return toBase(a[0],2,a[1],'DEC2BIN')}, DEC2OCT:a=>{argc(a,1,2,'DEC2OCT');return toBase(a[0],8,a[1],'DEC2OCT')}, DEC2HEX:a=>{argc(a,1,2,'DEC2HEX');return toBase(a[0],16,a[1],'DEC2HEX')},
  BIN2DEC:a=>{argc(a,1,1,'BIN2DEC');return fromBase(a[0],2,'BIN2DEC')}, OCT2DEC:a=>{argc(a,1,1,'OCT2DEC');return fromBase(a[0],8,'OCT2DEC')}, HEX2DEC:a=>{argc(a,1,1,'HEX2DEC');return fromBase(a[0],16,'HEX2DEC')},
  BIN2HEX:a=>{argc(a,1,2,'BIN2HEX');return toBase(fromBase(a[0],2,'BIN2HEX'),16,a[1],'BIN2HEX')}, BIN2OCT:a=>{argc(a,1,2,'BIN2OCT');return toBase(fromBase(a[0],2,'BIN2OCT'),8,a[1],'BIN2OCT')},
  HEX2BIN:a=>{argc(a,1,2,'HEX2BIN');return toBase(fromBase(a[0],16,'HEX2BIN'),2,a[1],'HEX2BIN')}, HEX2OCT:a=>{argc(a,1,2,'HEX2OCT');return toBase(fromBase(a[0],16,'HEX2OCT'),8,a[1],'HEX2OCT')},
  OCT2BIN:a=>{argc(a,1,2,'OCT2BIN');return toBase(fromBase(a[0],8,'OCT2BIN'),2,a[1],'OCT2BIN')}, OCT2HEX:a=>{argc(a,1,2,'OCT2HEX');return toBase(fromBase(a[0],8,'OCT2HEX'),16,a[1],'OCT2HEX')},
  CONVERT:a=>{argc(a,3,3,'CONVERT');return convertU(num(a[0]),text(a[1]),text(a[2]))},
  DELTA:a=>{argc(a,1,2,'DELTA');return num(a[0])===num(opt(a,1,0))?1:0}, GESTEP:a=>{argc(a,1,2,'GESTEP');return num(a[0])>=num(opt(a,1,0))?1:0},
  BITAND:a=>{argc(a,2,2,'BITAND');return Number(BigInt(Math.trunc(num(a[0])))&BigInt(Math.trunc(num(a[1]))))},
  BITOR:a=>{argc(a,2,2,'BITOR');return Number(BigInt(Math.trunc(num(a[0])))|BigInt(Math.trunc(num(a[1]))))},
  BITXOR:a=>{argc(a,2,2,'BITXOR');return Number(BigInt(Math.trunc(num(a[0])))^BigInt(Math.trunc(num(a[1]))))},
  BITLSHIFT:a=>{argc(a,2,2,'BITLSHIFT');const n=Math.trunc(num(a[1]));return n>=0?Math.trunc(num(a[0]))*Math.pow(2,n):Math.floor(Math.trunc(num(a[0]))/Math.pow(2,-n))},
  BITRSHIFT:a=>{argc(a,2,2,'BITRSHIFT');const n=Math.trunc(num(a[1]));return n>=0?Math.floor(Math.trunc(num(a[0]))/Math.pow(2,n)):Math.trunc(num(a[0]))*Math.pow(2,-n)},
  /* pencarian & array tambahan */
  EXPAND:a=>{argc(a,2,4,'EXPAND');const r=asArr(a[0]).rows,R=Math.trunc(num(a[1])),C=a[2]!==undefined?Math.trunc(num(a[2])):r[0].length;if(R<r.length||C<r[0].length)throw new XErr('#VALUE!','Ukuran EXPAND lebih kecil dari data');sizeOk(R,C,'EXPAND');
    const pad=a[3]!==undefined?one(a[3]):new XErr('#N/A','Diisi oleh EXPAND');return arr(Array.from({length:R},(_,i)=>Array.from({length:C},(_,j)=>r[i]&&r[i][j]!==undefined?r[i][j]:pad)))},
  AREAS:a=>{argc(a,1,1,'AREAS');return 1},
});
for(const k of ['SIGN','EXP','LN','LOG','LOG10','RADIANS','DEGREES','SIN','COS','TAN','ASIN','ACOS','ATAN','SINH','COSH','TANH','SEC','CSC','COT','FACT','EVEN','ODD','TRUNC','ROMAN','ARABIC','BASE','DECIMAL',
  'DEC2BIN','DEC2OCT','DEC2HEX','BIN2DEC','OCT2DEC','HEX2DEC','CONVERT','ISEVEN','ISODD','ISLOGICAL','ISNONTEXT','N','T','UNICHAR','UNICODE','FIXED','DOLLAR','NUMBERVALUE','ISOWEEKNUM','TIMEVALUE','YEARFRAC',
  'NORM.S.DIST','NORM.S.INV','NORM.DIST','NORM.INV','STANDARDIZE','CEILING.PRECISE','FLOOR.PRECISE','EFFECT','NOMINAL','DELTA','GESTEP'])LIFT.add(k);
/* ---------- lengkapi: trig hiperbolik, distribusi invers, kompatibilitas, teks byte, kompleks, surat berharga sederhana ---------- */
const cpx=s=>{if(typeof s==='number')return[s,0];const t=text(s).replace(/\s/g,'');if(t==='')return[0,0];const m=/^([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)?(?:([+-]?(?:\d+\.?\d*|\.\d+)?)([ij]))?$/.exec(t);
  if(!m||(!m[1]&&!m[3]))throw new XErr('#NUM!','"'+t+'" bukan bilangan kompleks');let re=0,im=0;if(m[3]){im=m[2]===''||m[2]==='+'?1:m[2]==='-'?-1:Number(m[2]);re=m[1]?Number(m[1]):0}else re=Number(m[1]);return[re,im]};
const cfmt=([re,im],suf='i')=>{const r=+re.toPrecision(15),i=+im.toPrecision(15);if(!i)return String(r);const is=i===1?'':i===-1?'-':String(i);return(r?String(r)+(i>0?'+':''):'')+is+suf};
const cmul=([a,b],[c,d])=>[a*c-b*d,a*d+b*c];
Object.assign(FN,{
  ASINH:a=>Math.asinh(N1(a,0,'ASINH',1,1)), ACOSH:a=>Math.acosh(N1(a,0,'ACOSH',1,1)), ATANH:a=>Math.atanh(N1(a,0,'ATANH',1,1)),
  ACOT:a=>Math.PI/2-Math.atan(N1(a,0,'ACOT',1,1)), ACOTH:a=>{const x=N1(a,0,'ACOTH',1,1);return 0.5*Math.log((x+1)/(x-1))},
  COTH:a=>1/Math.tanh(N1(a,0,'COTH',1,1)), CSCH:a=>1/Math.sinh(N1(a,0,'CSCH',1,1)), SECH:a=>1/Math.cosh(N1(a,0,'SECH',1,1)),
  SERIESSUM:a=>{argc(a,4,4,'SERIESSUM');const x=num(a[0]),n=num(a[1]),m=num(a[2]);return nums([a[3]]).reduce((s,c,i)=>s+c*Math.pow(x,n+i*m),0)},
  'BETA.INV':a=>{argc(a,3,5,'BETA.INV');const al=num(a[1]),be=num(a[2]),lo=num(opt(a,3,0)),hi=num(opt(a,4,1));return lo+(hi-lo)*invert(x=>ibeta(Math.min(x,1),al,be),num(a[0]),0,1)},
  'BINOM.INV':a=>{argc(a,3,3,'BINOM.INV');const n=Math.trunc(num(a[0])),p=num(a[1]),al=num(a[2]);let s=0;for(let k=0;k<=n;k++){s+=combin(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);if(s>=al-1e-12)return k}return n},
  'BINOM.DIST.RANGE':a=>{argc(a,3,4,'BINOM.DIST.RANGE');const n=Math.trunc(num(a[0])),p=num(a[1]),s1=Math.trunc(num(a[2])),s2=a[3]!==undefined?Math.trunc(num(a[3])):s1;let s=0;for(let k=s1;k<=s2;k++)s+=combin(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);return s},
  'GAMMA.INV':a=>{argc(a,3,3,'GAMMA.INV');const k=num(a[1]),t=num(a[2]);return t*invert(x=>igamma(k,x),num(a[0]),0,k+10)},
  'LOGNORM.INV':a=>{argc(a,3,3,'LOGNORM.INV');return Math.exp(num(a[1])+num(a[2])*ninv(num(a[0])))},
  'HYPGEOM.DIST':a=>{argc(a,5,5,'HYPGEOM.DIST');const k=Math.trunc(num(a[0])),n=Math.trunc(num(a[1])),K=Math.trunc(num(a[2])),N=Math.trunc(num(a[3]));const f=i=>combin(K,i)*combin(N-K,n-i)/combin(N,n);if(!truthy(a[4]))return f(k);let s=0;for(let i=Math.max(0,n-(N-K));i<=k;i++)s+=f(i);return s},
  'NEGBINOM.DIST':a=>{argc(a,4,4,'NEGBINOM.DIST');const f=Math.trunc(num(a[0])),r=Math.trunc(num(a[1])),p=num(a[2]);const g=i=>combin(i+r-1,r-1)*Math.pow(p,r)*Math.pow(1-p,i);if(!truthy(a[3]))return g(f);let s=0;for(let i=0;i<=f;i++)s+=g(i);return s},
  LOGEST:a=>{argc(a,1,2,'LOGEST');const ys=flat([a[0]]).filter(v=>typeof v==='number');const xs=a[1]!==undefined?flat([a[1]]).filter(v=>typeof v==='number'):ys.map((_,i)=>i+1);const l=lin(ys.map(Math.log),xs);return arr([[Math.exp(l.b),Math.exp(l.a)]])},
  /* nama lama (kompatibilitas) */
  BETADIST:a=>FN['BETA.DIST']([a[0],a[1],a[2],true,a[3],a[4]].filter(x=>x!==undefined)), BETAINV:a=>FN['BETA.INV'](a), CRITBINOM:a=>FN['BINOM.INV'](a),
  GAMMADIST:a=>FN['GAMMA.DIST'](a), GAMMAINV:a=>FN['GAMMA.INV'](a), HYPGEOMDIST:a=>{argc(a,4,4,'HYPGEOMDIST');return FN['HYPGEOM.DIST']([...a,false])},
  LOGINV:a=>FN['LOGNORM.INV'](a), LOGNORMDIST:a=>{argc(a,3,3,'LOGNORMDIST');return FN['LOGNORM.DIST']([...a,true])},
  NEGBINOMDIST:a=>{argc(a,3,3,'NEGBINOMDIST');return FN['NEGBINOM.DIST']([...a,false])}, WEIBULL:a=>FN['WEIBULL.DIST'](a),
  /* teks versi byte (sama untuk huruf Latin) */
  FINDB:a=>FN.FIND(a), SEARCHB:a=>FN.SEARCH(a), LEFTB:a=>FN.LEFT(a), RIGHTB:a=>FN.RIGHT(a), MIDB:a=>FN.MID(a), LENB:a=>FN.LEN(a), REPLACEB:a=>FN.REPLACE(a),
  ASC:a=>{argc(a,1,1,'ASC');return text(a[0])}, DBCS:a=>{argc(a,1,1,'DBCS');return text(a[0])},
  /* info */
  SHEET:a=>{argc(a,0,1,'SHEET');return 1}, SHEETS:a=>{argc(a,0,1,'SHEETS');return 1},
  /* bilangan kompleks */
  COMPLEX:a=>{argc(a,2,3,'COMPLEX');return cfmt([num(a[0]),num(a[1])],a[2]!==undefined?text(a[2]):'i')},
  IMREAL:a=>cpx(one(a[0]))[0], IMAGINARY:a=>cpx(one(a[0]))[1], IMABS:a=>Math.hypot(...cpx(one(a[0]))), IMARGUMENT:a=>{const[x,y]=cpx(one(a[0]));return Math.atan2(y,x)},
  IMCONJUGATE:a=>{const[x,y]=cpx(one(a[0]));return cfmt([x,-y])},
  IMSUM:a=>cfmt(flat(a).map(v=>cpx(v)).reduce((s,c)=>[s[0]+c[0],s[1]+c[1]],[0,0])),
  IMSUB:a=>{argc(a,2,2,'IMSUB');const p=cpx(one(a[0])),q=cpx(one(a[1]));return cfmt([p[0]-q[0],p[1]-q[1]])},
  IMPRODUCT:a=>cfmt(flat(a).map(v=>cpx(v)).reduce((s,c)=>cmul(s,c),[1,0])),
  IMDIV:a=>{argc(a,2,2,'IMDIV');const[p,q]=[cpx(one(a[0])),cpx(one(a[1]))];const d=q[0]**2+q[1]**2;if(!d)throw new XErr('#NUM!','Pembagian dengan nol');return cfmt([(p[0]*q[0]+p[1]*q[1])/d,(p[1]*q[0]-p[0]*q[1])/d])},
  IMPOWER:a=>{argc(a,2,2,'IMPOWER');const[x,y]=cpx(one(a[0]));const n=num(a[1]);const r=Math.pow(Math.hypot(x,y),n),t=Math.atan2(y,x)*n;return cfmt([r*Math.cos(t),r*Math.sin(t)])},
  IMSQRT:a=>{const[x,y]=cpx(one(a[0]));const r=Math.sqrt(Math.hypot(x,y)),t=Math.atan2(y,x)/2;return cfmt([r*Math.cos(t),r*Math.sin(t)])},
  IMEXP:a=>{const[x,y]=cpx(one(a[0]));return cfmt([Math.exp(x)*Math.cos(y),Math.exp(x)*Math.sin(y)])},
  IMLN:a=>{const[x,y]=cpx(one(a[0]));return cfmt([Math.log(Math.hypot(x,y)),Math.atan2(y,x)])},
  /* surat berharga diskonto (basis hari) */
  DISC:a=>{argc(a,4,5,'DISC');const yf=yearfrac(Math.floor(num(a[0])),Math.floor(num(a[1])),Math.trunc(num(opt(a,4,0))));return(num(a[3])-num(a[2]))/num(a[3])/yf},
  INTRATE:a=>{argc(a,4,5,'INTRATE');const yf=yearfrac(Math.floor(num(a[0])),Math.floor(num(a[1])),Math.trunc(num(opt(a,4,0))));return(num(a[3])-num(a[2]))/num(a[2])/yf},
  RECEIVED:a=>{argc(a,4,5,'RECEIVED');const yf=yearfrac(Math.floor(num(a[0])),Math.floor(num(a[1])),Math.trunc(num(opt(a,4,0))));return num(a[2])/(1-num(a[3])*yf)},
  PRICEDISC:a=>{argc(a,4,5,'PRICEDISC');const yf=yearfrac(Math.floor(num(a[0])),Math.floor(num(a[1])),Math.trunc(num(opt(a,4,0))));return num(a[3])*(1-num(a[2])*yf)},
  YIELDDISC:a=>{argc(a,4,5,'YIELDDISC');const yf=yearfrac(Math.floor(num(a[0])),Math.floor(num(a[1])),Math.trunc(num(opt(a,4,0))));return(num(a[3])-num(a[2]))/num(a[2])/yf},
  TBILLPRICE:a=>{argc(a,3,3,'TBILLPRICE');const d=Math.floor(num(a[1]))-Math.floor(num(a[0]));return 100*(1-num(a[2])*d/360)},
  TBILLYIELD:a=>{argc(a,3,3,'TBILLYIELD');const d=Math.floor(num(a[1]))-Math.floor(num(a[0])),p=num(a[2]);return(100-p)/p*360/d},
  TBILLEQ:a=>{argc(a,3,3,'TBILLEQ');const d=Math.floor(num(a[1]))-Math.floor(num(a[0])),r=num(a[2]);return 365*r/(360-r*d)},
});
for(const k of ['ASINH','ACOSH','ATANH','ACOT','ACOTH','COTH','CSCH','SECH','IMREAL','IMAGINARY','IMABS','IMARGUMENT','IMCONJUGATE','IMSQRT','IMEXP','IMLN'])LIFT.add(k);
/* ---------- obligasi, Bessel, kompleks trigonometri, info ---------- */
const d360=(s,e,eu)=>{const p=fromSerial(s),q=fromSerial(e);let d1=p.d,d2=q.d;if(eu){if(d1===31)d1=30;if(d2===31)d2=30}else{const lf=x=>x.m===2&&fromSerial(toSerial(x.y,x.m,x.d)+1).m===3;if(lf(p)&&lf(q))d2=30;if(lf(p))d1=30;if(d2===31&&d1>=30)d2=30;if(d1===31)d1=30}return(q.y-p.y)*360+(q.m-p.m)*30+(d2-d1)};
const dcount=(s,e,b)=>b===0?d360(s,e,false):b===4?d360(s,e,true):e-s;
function coupDates(st,mat,f){const step=12/f;const eom=fromSerial(mat+1).d===1;let k=1,ncd=mat,pcd;
  const at=n=>{const d=edate(mat,-step*n);return eom?eomonth(d,0):d};while(true){pcd=at(k);if(pcd<=st)break;ncd=pcd;k++;if(k>2000)throw new XErr('#NUM!','Tanggal tidak valid')}return{pcd,ncd,n:k}}
function bondArgs(a,fi,bi,fn){const st=Math.floor(num(a[0])),mat=Math.floor(num(a[1]));const f=Math.trunc(num(a[fi])),b=Math.trunc(num(opt(a,bi,0)));if(st>=mat)throw new XErr('#NUM!',fn+': settlement harus sebelum jatuh tempo');if(![1,2,4].includes(f))throw new XErr('#NUM!',fn+': frekuensi harus 1, 2, atau 4');if(b<0||b>4)throw new XErr('#NUM!',fn+': basis 0–4');
  const{pcd,ncd,n}=coupDates(st,mat,f);const E=b===1?ncd-pcd:b===3?365/f:360/f;const A=dcount(pcd,st,b);const DSC=b===0||b===4?E-A:ncd-st;return{st,mat,f,b,pcd,ncd,N:n,E,A,DSC}}
function bondPrice(o,rate,yld,red){const{f,E,A,DSC,N}=o;const c=100*rate/f;if(N===1)return(red+c)/(1+DSC/E*yld/f)-c*A/E;let p=red/Math.pow(1+yld/f,N-1+DSC/E);for(let k=1;k<=N;k++)p+=c/Math.pow(1+yld/f,k-1+DSC/E);return p-c*A/E}
function bondDur(o,rate,yld){const{f,E,DSC,N}=o;const c=100*rate/f;let pv=0,w=0;for(let k=1;k<=N;k++){const t=k-1+DSC/E,cf=c+(k===N?100:0),v=cf/Math.pow(1+yld/f,t);pv+=v;w+=v*t}return w/pv/f}
const ybasis=(b,s)=>b===3?365:b===1?((y=>((y%4===0&&y%100!==0)||y%400===0)?366:365)(fromSerial(s).y)):360;
const integ=(f,a,b,n)=>{n=n||400;const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3};
const besJ=(x,n)=>integ(t=>Math.cos(n*t-x*Math.sin(t)),0,Math.PI)/Math.PI;
const besI=(x,n)=>integ(t=>Math.exp(x*Math.cos(t))*Math.cos(n*t),0,Math.PI)/Math.PI;
const besK=(x,n)=>integ(t=>Math.exp(-x*Math.cosh(t))*Math.cosh(n*t),0,Math.max(5,Math.acosh(60/x+1)+1),2000);
const besY=(x,n)=>integ(t=>Math.sin(x*Math.sin(t)-n*t),0,Math.PI)/Math.PI-integ(t=>(Math.exp(n*t)+(n%2?-1:1)*Math.exp(-n*t))*Math.exp(-x*Math.sinh(t)),0,Math.max(5,Math.asinh(60/x)+1),2000)/Math.PI;
const cdiv=([a,b],[c,d])=>{const q=c*c+d*d;if(!q)throw new XErr('#NUM!','Pembagian dengan nol');return[(a*c+b*d)/q,(b*c-a*d)/q]};
const csin=([a,b])=>[Math.sin(a)*Math.cosh(b),Math.cos(a)*Math.sinh(b)], ccos=([a,b])=>[Math.cos(a)*Math.cosh(b),-Math.sin(a)*Math.sinh(b)];
const csinh=([a,b])=>[Math.sinh(a)*Math.cos(b),Math.cosh(a)*Math.sin(b)], ccosh=([a,b])=>[Math.cosh(a)*Math.cos(b),Math.sinh(a)*Math.sin(b)];
const cln=([a,b])=>[Math.log(Math.hypot(a,b)),Math.atan2(b,a)];
const cf1=g=>a=>{argc(a,1,1,'IM');return cfmt(g(cpx(one(a[0]))))};
Object.assign(FN,{
  COUPPCD:a=>{argc(a,3,4,'COUPPCD');return bondArgs(a,2,3,'COUPPCD').pcd}, COUPNCD:a=>{argc(a,3,4,'COUPNCD');return bondArgs(a,2,3,'COUPNCD').ncd},
  COUPNUM:a=>{argc(a,3,4,'COUPNUM');return bondArgs(a,2,3,'COUPNUM').N}, COUPDAYS:a=>{argc(a,3,4,'COUPDAYS');return bondArgs(a,2,3,'COUPDAYS').E},
  COUPDAYBS:a=>{argc(a,3,4,'COUPDAYBS');return bondArgs(a,2,3,'COUPDAYBS').A}, COUPDAYSNC:a=>{argc(a,3,4,'COUPDAYSNC');return bondArgs(a,2,3,'COUPDAYSNC').DSC},
  PRICE:a=>{argc(a,6,7,'PRICE');const o=bondArgs(a,5,6,'PRICE');return bondPrice(o,num(a[2]),num(a[3]),num(a[4]))},
  YIELD:a=>{argc(a,6,7,'YIELD');const o=bondArgs(a,5,6,'YIELD'),rate=num(a[2]),pr=num(a[3]),red=num(a[4]);let lo=-0.99,hi=10;for(let i=0;i<300;i++){const m=(lo+hi)/2;if(bondPrice(o,rate,m,red)>pr)lo=m;else hi=m}return(lo+hi)/2},
  DURATION:a=>{argc(a,5,6,'DURATION');const o=bondArgs(a,4,5,'DURATION');return bondDur(o,num(a[2]),num(a[3]))},
  MDURATION:a=>{argc(a,5,6,'MDURATION');const o=bondArgs(a,4,5,'MDURATION'),y=num(a[3]);return bondDur(o,num(a[2]),y)/(1+y/o.f)},
  ACCRINTM:a=>{argc(a,4,5,'ACCRINTM');return num(a[3])*num(a[2])*yearfrac(Math.floor(num(a[0])),Math.floor(num(a[1])),Math.trunc(num(opt(a,4,0))))},
  ACCRINT:a=>{argc(a,6,8,'ACCRINT');return num(a[4])*num(a[3])*yearfrac(Math.floor(num(a[0])),Math.floor(num(a[2])),Math.trunc(num(opt(a,6,0))))},
  PRICEMAT:a=>{argc(a,5,6,'PRICEMAT');const st=Math.floor(num(a[0])),mat=Math.floor(num(a[1])),is=Math.floor(num(a[2])),r=num(a[3]),y=num(a[4]),b=Math.trunc(num(opt(a,5,0)));const B=ybasis(b,st);
    const DSM=dcount(st,mat,b),DIM=dcount(is,mat,b),A=dcount(is,st,b);return(100+DIM/B*r*100)/(1+DSM/B*y)-A/B*r*100},
  YIELDMAT:a=>{argc(a,5,6,'YIELDMAT');const st=Math.floor(num(a[0])),mat=Math.floor(num(a[1])),is=Math.floor(num(a[2])),r=num(a[3]),pr=num(a[4]),b=Math.trunc(num(opt(a,5,0)));const B=ybasis(b,st);
    const DSM=dcount(st,mat,b),DIM=dcount(is,mat,b),A=dcount(is,st,b);const x=pr/100+A/B*r;return((1+DIM/B*r)-x)/x*B/DSM},
  BESSELJ:a=>{argc(a,2,2,'BESSELJ');const n=Math.trunc(num(a[1]));if(n<0)throw new XErr('#NUM!','Orde minimal 0');return besJ(num(a[0]),n)},
  BESSELI:a=>{argc(a,2,2,'BESSELI');const n=Math.trunc(num(a[1]));if(n<0)throw new XErr('#NUM!','Orde minimal 0');return besI(num(a[0]),n)},
  BESSELK:a=>{argc(a,2,2,'BESSELK');const x=num(a[0]),n=Math.trunc(num(a[1]));if(x<=0||n<0)throw new XErr('#NUM!','Argumen tidak valid');return besK(x,n)},
  BESSELY:a=>{argc(a,2,2,'BESSELY');const x=num(a[0]),n=Math.trunc(num(a[1]));if(x<=0||n<0)throw new XErr('#NUM!','Argumen tidak valid');return besY(x,n)},
  IMSIN:cf1(csin), IMCOS:cf1(ccos), IMTAN:cf1(z=>cdiv(csin(z),ccos(z))), IMCOT:cf1(z=>cdiv(ccos(z),csin(z))), IMSEC:cf1(z=>cdiv([1,0],ccos(z))), IMCSC:cf1(z=>cdiv([1,0],csin(z))),
  IMSINH:cf1(csinh), IMCOSH:cf1(ccosh), IMSECH:cf1(z=>cdiv([1,0],ccosh(z))), IMCSCH:cf1(z=>cdiv([1,0],csinh(z))),
  IMLOG10:cf1(z=>{const[x,y]=cln(z);return[x/Math.LN10,y/Math.LN10]}), IMLOG2:cf1(z=>{const[x,y]=cln(z);return[x/Math.LN2,y/Math.LN2]}),
  ENCODEURL:a=>{argc(a,1,1,'ENCODEURL');return encodeURIComponent(text(a[0]))},
  INFO:a=>{argc(a,1,1,'INFO');const k=text(a[0]).toLowerCase();const v={numfile:1,osversion:'Web',recalc:'Automatic',release:'16.0',system:'pcdos',directory:'/',origin:'$A:$A$1'}[k];if(v===undefined)throw new XErr('#VALUE!','Jenis INFO tidak dikenal');return v},
});
for(const k of ['IMSIN','IMCOS','IMTAN','IMCOT','IMSEC','IMCSC','IMSINH','IMCOSH','IMSECH','IMCSCH','IMLOG10','IMLOG2','ENCODEURL'])LIFT.add(k);
const ALL_FUNCS=Object.keys(FN).concat(SPECIAL);
function lift(f,args){
  const M=args.map(a=>isArr(a)?a.rows:null);const h=Math.max(...M.map(m=>m?m.length:1)),w=Math.max(...M.map(m=>m?m[0].length:1));
  const at=(k,i,j)=>{const m=M[k];if(!m)return args[k];const r=m.length===1?m[0]:m[i];if(!r)return new XErr('#N/A','Ukuran rentang tidak sama');const v=r.length===1?r[0]:r[j];return v===undefined?new XErr('#N/A','Ukuran rentang tidak sama'):v};
  const rows=[];for(let i=0;i<h;i++){const row=[];for(let j=0;j<w;j++){const a=args.map((_,k)=>at(k,i,j));const e=a.find(isErr);
    if(e){row.push(e);continue}try{const v=f(a);row.push(isArr(v)?v.rows[0][0]:v)}catch(e2){if(isErr(e2))row.push(e2);else throw e2}}rows.push(row)}
  return arr(rows)}
function broadcast(a,b,f){
  const A=isArr(a)?a.rows:[[a]],B=isArr(b)?b.rows:[[b]];
  const h=Math.max(A.length,B.length),w=Math.max(A[0].length,B[0].length);
  const pick=(M,i,j)=>{const r=M.length===1?M[0]:M[i];if(!r)return new XErr('#N/A','Ukuran rentang tidak sama');const v=r.length===1?r[0]:r[j];return v===undefined?new XErr('#N/A','Ukuran rentang tidak sama'):v};
  const rows=[];for(let i=0;i<h;i++){const row=[];for(let j=0;j<w;j++)row.push(f(pick(A,i,j),pick(B,i,j)));rows.push(row)}
  return arr(rows);
}

/* ---------- sheet ---------- */
// TEXTBEFORE/TEXTAFTER: (teks, pembatas, [ke-n], [abaikan huruf besar], [akhir teks = pembatas], [jika tidak ketemu])
function _textCut(a,name){
  const s=text(a[0]),d=text(a[1]),n=Math.trunc(num(opt(a,2,1))),ci=num(opt(a,3,0))===1,me=num(opt(a,4,0))===1;
  if(n===0||Math.abs(n)>s.length+1)throw new XErr('#VALUE!',name+': urutan pembatas (argumen ke-3) tidak boleh 0');
  if(d===''){return n>0?{s,i:0,len:0}:{s,i:s.length,len:0}}
  const S=ci?s.toLowerCase():s,D=ci?d.toLowerCase():d,pos=[];
  for(let i=S.indexOf(D);i>=0;i=S.indexOf(D,i+D.length))pos.push(i);
  let i=n>0?pos[n-1]:pos[pos.length+n];
  if(i===undefined&&me){if(n>0&&n===pos.length+1)i=s.length;else if(n<0&&-n===pos.length+1)i=0;if(i!==undefined)return{s,i,len:i===s.length?0:0,edge:true}}
  if(i===undefined){if(a[5]!==undefined)return{miss:true,v:a[5]};throw new XErr('#N/A','Pembatas "'+d+'" ke-'+n+' tidak ditemukan')}
  return{s,i,len:d.length};
}
function _flat(A,byCol){const R=A.rows;if(!byCol)return R.flat();const o=[];for(let j=0;j<(R[0]||[]).length;j++)for(let i=0;i<R.length;i++)o.push(R[i][j]);return o}
function makeSheet(cells,opts){
  opts=opts||{};
  const cache={},visiting=new Set(),spillOf={},anchorSize={};
  // kolom penuh (F:F) dibaca sampai baris terakhir yang berisi data
  let _last=0;const lastRow=()=>_last||(_last=Math.max(1,...Object.keys(cells).map(k=>{const p=splitRef(k);return p?p.r:0})));
  const formulaCells=Object.keys(cells).filter(k=>typeof cells[k]==='string'&&cells[k][0]==='=');
  function findSpill(k){
    if(k in spillOf)return spillOf[k];
    const t=splitRef(k);
    for(const a of formulaCells){
      if(a===k||visiting.has(a))continue;
      const p=splitRef(a);if(p.r>t.r||p.c>t.c)continue;
      value(a);
      if(k in spillOf)return spillOf[k];
    }
    return undefined;
  }
  function value(k){
    if(k in cache)return cache[k];
    const raw=cells[k];
    if(raw==null||raw===''){
      if(visiting.has(k))return null;
      visiting.add(k);const s=findSpill(k);visiting.delete(k);
      return cache[k]=s===undefined?null:s.v;
    }
    if(visiting.has(k))return new XErr('#CIRC!','Rumus merujuk ke dirinya sendiri, langsung atau lewat sel lain');
    visiting.add(k);
    let v=evalRaw(raw,true);
    if(isArr(v)){
      const p=splitRef(k),rows=v.rows;
      if(rows.length===1&&rows[0].length===1)v=rows[0][0];
      else{
        let blocked=false;const targets=[];
        rows.forEach((row,i)=>row.forEach((x,j)=>{if(!i&&!j)return;const key=colName(p.c+j)+(p.r+i);targets.push([key,x]);
          if((cells[key]!=null&&cells[key]!=='')||(key in spillOf&&spillOf[key].a!==k))blocked=true}));
        if(blocked)v=new XErr('#SPILL!','Hasilnya perlu '+rows.length+' baris × '+rows[0].length+' kolom, tapi ada sel tujuan yang sudah berisi data');
        else{for(const[key,x]of targets)spillOf[key]={a:k,v:x};anchorSize[k]=[rows.length,rows[0].length];v=rows[0][0]}
      }
    }
    visiting.delete(k);
    return cache[k]=v;
  }
  function evalRaw(r,allowArr){
    if(r==null||r==='')return null;
    if(typeof r==='number')return r;
    const s=String(r);
    if(s[0]==='=')return evalFormula(s.slice(1),allowArr);
    if(s[0]==="'")return s.slice(1); // apostrof di depan: paksa jadi teks, seperti di Excel
    const t=s.trim();
    if(t!==''&&!isNaN(Number(t)))return Number(t);
    if(/^-?\d+(\.\d+)?%$/.test(t))return parseFloat(t)/100;
    const dm=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);if(dm)return toSerial(+dm[3],+dm[2],+dm[1]);
    const tm=/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(t);if(tm)return(+tm[1]*3600+ +tm[2]*60+ +(tm[3]||0))/86400;
    if(/^(TRUE|FALSE)$/i.test(t))return t.toUpperCase()==='TRUE';
    return s;
  }
  const scopes=[];
  function ev(n){
    switch(n.t){
      case 'val':return n.v;
      case 'arr':return arr(n.v.map(r=>r.slice()));
      case 'blank':return undefined;
      case 'name':{for(let i=scopes.length-1;i>=0;i--)if(scopes[i].has(n.n))return scopes[i].get(n.n);
        throw new XErr('#NAME?','"'+n.n+'" tidak dikenal. Kalau itu teks, apit dengan tanda kutip ganda')}
      case 'ref':return value(n.k);
      case 'range':{if(/^[A-Z]{1,3}$/.test(n.a)&&/^[A-Z]{1,3}$/.test(n.b)){const last=lastRow();return arr(expandRange(n.a+'1',n.b+last).map(r=>r.map(value)))}
        const a=splitRef(n.a),b=splitRef(n.b);if(!a||!b)throw new XErr('#REF!','Rentang tidak valid');return arr(expandRange(n.a,n.b).map(r=>r.map(value)))}
      case 'neg':{const x=ev(n.x);return isArr(x)?arr(x.rows.map(r=>r.map(v=>opScalar('-',0,v)))):-num(x)}
      case 'pct':{const x=ev(n.x);return isArr(x)?arr(x.rows.map(r=>r.map(v=>opScalar('/',v,100)))):num(x)/100}
      case 'bin':{
        const a=ev(n.l),b=ev(n.r);
        if(isArr(a)||isArr(b))return broadcast(a,b,(x,y)=>opScalar(n.o,x,y));
        const v=opScalar(n.o,a,b);if(isErr(v))throw v;return v;
      }
      case 'call':{const f=ev(n.f);if(!f||!f.lambda)throw new XErr('#VALUE!','Hanya LAMBDA yang bisa langsung dipanggil dengan (…)');return callLambda(f,n.args)}
      case 'fn':{
        const A=n.args;
        if(n.n==='IF'){argc(A,2,3,'IF');const c=ev(A[0]);
          if(isArr(c)){const t=ev(A[1]),f=A[2]?ev(A[2]):false;return broadcast(c,broadcast(t,f,(x,y)=>[x,y]),(cc,pair)=>{try{return truthy(cc)?pair[0]:(pair[1]===undefined?false:pair[1])}catch(e){return e}})}
          return truthy(c)?(A[1].t==='blank'?0:ev(A[1])):(A[2]?(A[2].t==='blank'?0:ev(A[2])):false)}
        if(n.n==='IFS'){if(A.length<2||A.length%2)throw new XErr('#ERROR!','IFS perlu pasangan kondisi dan hasil');
          for(let i=0;i<A.length;i+=2)if(truthy(ev(A[i])))return ev(A[i+1]);
          throw new XErr('#N/A','Tidak ada kondisi IFS yang terpenuhi. Tambahkan TRUE sebagai kondisi terakhir untuk nilai lainnya')}
        if(n.n==='SWITCH'){if(A.length<3)throw new XErr('#ERROR!','SWITCH perlu nilai, lalu pasangan nilai-hasil');const x=one(ev(A[0]));if(isErr(x))throw x;
          let i=1;for(;i+1<A.length;i+=2){const c=one(ev(A[i]));if(cmpVals(x,c)===0&&rank(x)===rank(c))return ev(A[i+1])}
          if(i<A.length)return ev(A[i]);throw new XErr('#N/A','Tidak ada nilai SWITCH yang cocok')}
        if(n.n==='IFERROR'||n.n==='IFNA'){argc(A,2,2,n.n);let v;try{v=ev(A[0])}catch(e){if(isErr(e))v=e;else throw e}
          const bad=x=>isErr(x)&&(n.n==='IFERROR'||x.code==='#N/A');
          if(isArr(v))return arr(v.rows.map(r=>r.map(x=>bad(x)?one(ev(A[1])):x)));
          return bad(v)?ev(A[1]):v}
        if(n.n==='ISNUMBER'||n.n==='ISTEXT'||n.n==='ISBLANK'||n.n==='ISLOGICAL'||n.n==='ISNONTEXT'){argc(A,1,1,n.n);let v;try{v=ev(A[0])}catch(e){if(isErr(e))v=e;else throw e}
          // seperti Excel: error dianggap bukan angka/teks (hasil FALSE), jadi ISNUMBER(SEARCH(...)) tetap jalan
          const t=x=>isErr(x)?n.n==='ISNONTEXT':n.n==='ISNUMBER'?typeof x==='number':n.n==='ISTEXT'?typeof x==='string':n.n==='ISBLANK'?x==null:n.n==='ISLOGICAL'?typeof x==='boolean':typeof x!=='string';
          return isArr(v)?arr(v.rows.map(r=>r.map(t))):t(v)}
        if(n.n==='ISERROR'||n.n==='ISNA'){argc(A,1,1,n.n);let v;try{v=one(ev(A[0]))}catch(e){if(isErr(e))v=e;else throw e}return isErr(v)&&(n.n==='ISERROR'||v.code==='#N/A')}
        if(n.n==='CELL'){argc(A,1,2,'CELL');const k=text(ev(A[0])).toLowerCase();const r=A[1];const ref=r&&(r.t==='ref'?r.k:r.t==='range'?r.a:null);const at=ref||'A1';const p=splitRef(at);const v=ref?value(at):0;
          const out={address:'$'+colName(p.c)+'$'+p.r,row:p.r,col:p.c+1,contents:v??0,type:v==null||v===''?'b':typeof v==='string'?'l':'v',filename:'',format:'G',width:8,prefix:'',protect:1,parentheses:0,color:0}[k];if(out===undefined)throw new XErr('#VALUE!','Jenis info CELL tidak dikenal');return out}
        if(n.n==='ISREF'){argc(A,1,1,'ISREF');return A[0].t==='ref'||A[0].t==='range'}
        if(n.n==='ISOMITTED'){argc(A,1,1,'ISOMITTED');if(A[0].t!=='name')throw new XErr('#VALUE!','ISOMITTED butuh nama parameter LAMBDA');for(let i=scopes.length-1;i>=0;i--)if(scopes[i].has(A[0].n))return scopes[i].get(A[0].n)===undefined;return true}
        if(n.n==='ISFORMULA'||n.n==='FORMULATEXT'){argc(A,1,1,n.n);if(A[0].t!=='ref')throw new XErr('#VALUE!',n.n+' butuh satu alamat sel');const raw=cells[A[0].k];const isF=typeof raw==='string'&&raw[0]==='=';if(n.n==='ISFORMULA')return isF;if(!isF)throw new XErr('#N/A','Sel itu tidak berisi rumus');return raw}
        if(n.n==='ISERR'||n.n==='ERROR.TYPE'||n.n==='TYPE'){argc(A,1,1,n.n);let v;try{v=ev(A[0])}catch(e){if(isErr(e))v=e;else throw e}
          if(n.n==='TYPE')return isArr(v)?64:isErr(v)?16:typeof v==='number'||v==null?1:typeof v==='string'?2:4;
          v=isArr(v)?v.rows[0][0]:v;if(n.n==='ISERR')return isErr(v)&&v.code!=='#N/A';
          if(!isErr(v))throw new XErr('#N/A','Nilai ini bukan error');return{'#NULL!':1,'#DIV/0!':2,'#VALUE!':3,'#REF!':4,'#NAME?':5,'#NUM!':6,'#N/A':7,'#GETTING_DATA':8,'#SPILL!':9,'#CALC!':14}[v.code]||8}
        if(n.n==='LET'){if(A.length<3||A.length%2===0)throw new XErr('#ERROR!','LET perlu pasangan nama-nilai, lalu satu perhitungan di akhir');
          const sc=new Map();scopes.push(sc);
          try{for(let i=0;i+1<A.length;i+=2){if(A[i].t!=='name')throw new XErr('#ERROR!','Argumen ke-'+(i+1)+' LET harus berupa nama, misalnya total');sc.set(A[i].n,ev(A[i+1]))}
            return ev(A[A.length-1])}finally{scopes.pop()}}
        if(n.n==='LAMBDA'){if(!A.length)throw new XErr('#ERROR!','LAMBDA perlu minimal satu perhitungan');const ps=A.slice(0,-1).map(x=>{if(x.t!=='name')throw new XErr('#ERROR!','Parameter LAMBDA harus berupa nama');return x.n});
          return{lambda:true,params:ps,body:A[A.length-1],env:scopes.slice()}}
        if(n.n==='ROW'||n.n==='COLUMN'){argc(A,1,1,n.n);const r=A[0];if(r.t!=='ref'&&r.t!=='range')throw new XErr('#VALUE!',n.n+' butuh alamat sel, misalnya '+n.n+'(B3)');const p=splitRef(r.t==='ref'?r.k:r.a);return n.n==='ROW'?p.r:p.c+1}
        if(n.n==='ROWS'||n.n==='COLUMNS'){argc(A,1,1,n.n);const v=asArr(ev(A[0]));return n.n==='ROWS'?v.rows.length:v.rows[0].length}
        if(n.n==='INDIRECT'){argc(A,1,2,'INDIRECT');const t=text(ev(A[0])).toUpperCase().replace(/\$/g,'').trim();
          if(/^[A-Z]{1,3}\d+:[A-Z]{1,3}\d+$/.test(t)){const[a,b]=t.split(':');return arr(expandRange(a,b).map(r=>r.map(value)))}
          if(/^[A-Z]{1,3}\d+$/.test(t))return value(t);throw new XErr('#REF!','"'+t+'" bukan alamat sel yang valid')}
        if(n.n==='OFFSET'){argc(A,3,5,'OFFSET');const r=A[0];if(r.t!=='ref'&&r.t!=='range')throw new XErr('#VALUE!','Argumen pertama OFFSET harus alamat sel');
          const p=splitRef(r.t==='ref'?r.k:r.a),q=r.t==='range'?splitRef(r.b):p;const dr=Math.trunc(num(ev(A[1]))),dc=Math.trunc(num(ev(A[2])));
          const h=A[3]&&A[3].t!=='blank'?Math.trunc(num(ev(A[3]))):q.r-p.r+1,w=A[4]&&A[4].t!=='blank'?Math.trunc(num(ev(A[4]))):q.c-p.c+1;
          const r0=p.r+dr,c0=p.c+dc;if(r0<1||c0<0||h<1||w<1)throw new XErr('#REF!','Hasil OFFSET berada di luar lembar');
          const a=colName(c0)+r0,b=colName(c0+w-1)+(r0+h-1);return h===1&&w===1?value(a):arr(expandRange(a,b).map(rr=>rr.map(value)))}
        if(n.n==='GROUPBY'||n.n==='PIVOTBY'){const piv=n.n==='PIVOTBY';argc(A,piv?4:3,piv?4:3,n.n);
          const fnode=A[piv?3:2];const fname=fnode.t==='name'?fnode.n:null;const agg=fname&&FN[fname];if(!agg)throw new XErr('#VALUE!','Argumen terakhir '+n.n+' harus nama fungsi seperti SUM, COUNT, atau AVERAGE');
          const rk=lookupList(needRange(ev(A[0]),n.n)),ck=piv?lookupList(needRange(ev(A[1]),n.n)):null,vals=lookupList(needRange(ev(A[piv?2:1]),n.n));
          if(rk.length!==vals.length||(ck&&ck.length!==vals.length))throw new XErr('#VALUE!','Semua rentang '+n.n+' harus sama panjang');
          const uniq=l=>[...new Set(l.filter(x=>x!=null))].sort(cmpVals);const R=uniq(rk);
          const ag=xs=>{const v=agg([arr(xs.map(x=>[x]))]);return v};
          if(!piv){const out=R.map(r=>[r,ag(vals.filter((_,i)=>rk[i]===r))]);out.push(['Total',ag(vals)]);return arr(out)}
          const C=uniq(ck);const out=[[''].concat(C,['Total'])];
          for(const r of R)out.push([r].concat(C.map(c=>{const xs=vals.filter((_,i)=>rk[i]===r&&ck[i]===c);return xs.length?ag(xs):''}),[ag(vals.filter((_,i)=>rk[i]===r))]));
          out.push(['Total'].concat(C.map(c=>ag(vals.filter((_,i)=>ck[i]===c))),[ag(vals)]));return arr(out)}
        if(n.n==='BYROW'||n.n==='BYCOL'||n.n==='MAP'||n.n==='REDUCE'||n.n==='SCAN'||n.n==='MAKEARRAY'){
          const nm=n.n,fx=fnOf(A[A.length-1],nm);
          if(nm==='BYROW'||nm==='BYCOL'){argc(A,2,2,nm);const v=asArr(ev(A[0])).rows;
            if(nm==='BYROW')return arr(v.map(r=>[one(fx([arr([r])]))]));
            return arr([v[0].map((_,j)=>one(fx([arr(v.map(r=>[r[j]]))])))])}
          if(nm==='MAP'){if(A.length<2)throw new XErr('#VALUE!','MAP perlu rentang dan LAMBDA');const ins=A.slice(0,-1).map(a=>asArr(ev(a)).rows);
            return arr(ins[0].map((r,i)=>r.map((_,j)=>one(fx(ins.map(x=>x[i]&&x[i][j]!==undefined?x[i][j]:new XErr('#N/A','Ukuran rentang MAP berbeda')))))))}
          if(nm==='MAKEARRAY'){argc(A,3,3,nm);const R=Math.trunc(num(ev(A[0]))),C=Math.trunc(num(ev(A[1])));if(R<1||C<1)throw new XErr('#VALUE!','Jumlah baris dan kolom MAKEARRAY minimal 1');sizeOk(R,C,'MAKEARRAY');
            return arr(Array.from({length:R},(_,i)=>Array.from({length:C},(_,j)=>one(fx([i+1,j+1])))))}
          argc(A,2,3,nm);let acc=A.length===3&&A[0].t!=='blank'?one(ev(A[0])):0;const v=asArr(ev(A[A.length-2])).rows;const out=[];
          for(const r of v){const row=[];for(const x of r){acc=one(fx([acc,x==null?0:x]));if(isErr(acc))throw acc;row.push(acc)}out.push(row)}
          return nm==='REDUCE'?acc:arr(out)}
        for(let i=scopes.length-1;i>=0;i--)if(scopes[i].has(n.n)){const f=scopes[i].get(n.n);if(f&&f.lambda)return callLambda(f,A);break}
        const f=FN[n.n];
        if(!f)throw new XErr('#NAME?','Fungsi '+n.n+' tidak dikenal. Periksa ejaannya');
        const args=A.map(ev);
        for(const a of args)if(isErr(a))throw a;
        if(LIFT.has(n.n)&&args.some(isArr))return lift(f,args);
        const ci=CRIT_AT[n.n];
        if(ci){const pos=args.map((_,i)=>i).filter(ci).filter(i=>isArr(args[i]));
          if(pos.length)return lift(v=>{const b=args.slice();pos.forEach((p,k)=>b[p]=v[k]);return f(b)},pos.map(p=>args[p]));}
        return f(args);
      }
    }
  }
  function fnOf(node,nm){
    if(node.t==='name'&&FN[node.n]&&!scopes.some(sc=>sc.has(node.n))){const g=FN[node.n];return vals=>g(vals)}
    const f=ev(node);if(!f||!f.lambda)throw new XErr('#VALUE!','Argumen terakhir '+nm+' harus LAMBDA, misalnya LAMBDA(x,x*2)');
    return vals=>{if(vals.length!==f.params.length)throw new XErr('#VALUE!','LAMBDA di '+nm+' butuh '+vals.length+' parameter');
      const sc=new Map(f.params.map((p,i)=>[p,vals[i]]));const saved=scopes.splice(0);scopes.push(...f.env,sc);
      try{return ev(f.body)}catch(e){if(isErr(e))return e;throw e}finally{scopes.splice(0);scopes.push(...saved)}}}
  function callLambda(f,A){if(A.length!==f.params.length)throw new XErr('#VALUE!','LAMBDA ini butuh '+f.params.length+' argumen, diberi '+A.length);
    const vals=A.map(ev);const sc=new Map(f.params.map((p,i)=>[p,vals[i]]));const saved=scopes.splice(0);scopes.push(...f.env,sc);
    try{return ev(f.body)}finally{scopes.splice(0);scopes.push(...saved)}}
  function evalFormula(src,allowArr){
    try{
      if(!src.trim())throw new XErr('#ERROR!','Rumus masih kosong setelah tanda =');
      let v=ev(parse(src));
      if(v===undefined)v=0;
      if(v&&v.lambda)throw new XErr('#CALC!','LAMBDA perlu dipanggil dengan argumen, misalnya =LAMBDA(x,x*2)(5)');
      if(isArr(v)&&!allowArr)v=v.rows[0][0];
      if(typeof v==='number'&&!isFinite(v))return new XErr('#NUM!','Hasilnya terlalu besar');
      return v;
    }catch(e){return isErr(e)?e:new XErr('#ERROR!',String(e&&e.message||e))}
  }
  return{value,evalFormula,spillOf:k=>{value(k);return spillOf[k]&&spillOf[k].a},anchorSize:k=>{value(k);return anchorSize[k]}};
}

/* shift relative refs when copying a formula */
function shiftFormula(f,dr,dc){
  if(typeof f!=='string'||f[0]!=='=')return f;
  return f.split(/("(?:[^"]|"")*")/).map((seg,i)=>i%2?seg:seg.replace(/(^|[^A-Za-z0-9_.])(\$?)([A-Za-z]{1,3})(\$?)(\d+)(?![A-Za-z0-9_(.])/g,(m,pre,dc$,col,dr$,row)=>{
    const c=dc$?col.toUpperCase():colName(Math.max(0,colIndex(col.toUpperCase())+dc));
    const r=dr$?row:String(Math.max(1,+row+dr));
    return pre+dc$+c+dr$+r;
  })).join('');
}

const XL={fmtCode,XErr,isErr,isArr,colName,colIndex,splitRef,expandRange,toSerial,fromSerial,D,tokenize,parse,makeSheet,shiftFormula,cmpVals,ALL_FUNCS,BULAN,HARI};

export { XL };
export default XL;

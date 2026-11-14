export const LockIcon = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
  </svg>
);

const IC: Record<string, string> = {
 window:'<rect x="6" y="9" width="36" height="30" rx="3"/><path d="M6 16h36M6 22h36M18 22v17M30 22v17" class="ic-soft"/><path d="M6 16h36" class="ic-acc"/>',
 autofill:'<rect x="8" y="9" width="13" height="9" rx="1.5" class="ic-fill-soft"/><rect x="8" y="21" width="13" height="9" rx="1.5"/><rect x="8" y="33" width="13" height="7" rx="1.5"/><rect x="18" y="15" width="5" height="5" class="ic-fill-acc"/><path d="M28 14h12M28 26h12M28 37h8" class="ic-soft"/>',
 numfmt:'<path d="M8 15h32M8 25h32M8 35h32" class="ic-soft"/><path d="M12 30l5-11 5 11M14 26h6" /><path d="M28 19h8M32 19v12M28 31h8" class="ic-acc"/>',
 table:'<rect x="7" y="9" width="34" height="30" rx="2"/><rect x="7" y="9" width="34" height="7" class="ic-fill-acc"/><path d="M7 24h34M7 31h34M19 16v23M30 16v23" class="ic-soft"/>',
 sort:'<path d="M14 9v29M9 33l5 5 5-5"/><path d="M25 12h14M25 20h10M25 28h6M25 36h3" class="ic-acc"/>',
 cf:'<rect x="8" y="9" width="32" height="7" rx="1.5" class="ic-fill-acc"/><rect x="8" y="20" width="22" height="7" rx="1.5" class="ic-fill-soft"/><rect x="8" y="31" width="13" height="7" rx="1.5" class="ic-fill-warn"/>',
 dv:'<rect x="7" y="11" width="34" height="9" rx="2"/><path d="M33 14l3 3 3-3" class="ic-acc"/><rect x="7" y="23" width="34" height="16" rx="2" class="ic-soft"/><path d="M12 28h16M12 34h11" class="ic-acc"/>',
 dupes:'<rect x="8" y="9" width="22" height="8" rx="1.5"/><rect x="8" y="21" width="22" height="8" rx="1.5" class="ic-warn"/><rect x="8" y="33" width="22" height="6" rx="1.5"/><path d="M34 21l6 8M40 21l-6 8" class="ic-warn"/>',
 chart:'<path d="M8 40h32" class="ic-soft"/><rect x="11" y="27" width="5" height="13" class="ic-fill-soft"/><rect x="20" y="19" width="5" height="21" class="ic-fill-soft"/><rect x="29" y="23" width="5" height="17" class="ic-fill-soft"/><path d="M10 24l10-9 9 4 11-10" class="ic-acc"/>',
 pivot:'<rect x="7" y="9" width="34" height="31" rx="2"/><path d="M7 17h34M17 9v31"/><path d="M22 23h14M22 29h14M22 35h14" class="ic-soft"/><path d="M11 24v9h4" class="ic-acc"/>',
 slicer:'<rect x="8" y="8" width="15" height="8" rx="2" class="ic-fill-acc"/><rect x="8" y="20" width="15" height="8" rx="2"/><rect x="8" y="32" width="15" height="8" rx="2"/><path d="M28 12h12M28 24h12M28 36h8" class="ic-soft"/>',
 goalseek:'<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="8" class="ic-soft"/><circle cx="24" cy="24" r="3" class="ic-fill-acc"/>',
 pq:'<path d="M7 10h12l6 8v8" /><path d="M41 10H29l-4 8"/><path d="M25 26v12M20 33l5 5 5-5" class="ic-acc"/>',
 model:'<rect x="5" y="9" width="13" height="16" rx="2"/><rect x="30" y="9" width="13" height="16" rx="2"/><rect x="17" y="29" width="14" height="12" rx="2"/><path d="M18 17h12M12 25l7 4M36 25l-7 4" class="ic-acc"/>',
 freeze:'<rect x="7" y="8" width="34" height="32" rx="2" class="ic-soft"/><path d="M7 15h34M15 8v32" class="ic-acc"/><path d="M29 22v12M23 28h12M25 24l8 8M33 24l-8 8"/>',
 protect:'<rect x="12" y="21" width="24" height="18" rx="3"/><path d="M17 21v-5a7 7 0 0 1 14 0v5"/><circle cx="24" cy="30" r="2.5" class="ic-fill-acc"/>',
 print:'<path d="M14 18V8h20v10"/><rect x="8" y="18" width="32" height="14" rx="2"/><rect x="14" y="27" width="20" height="13" class="ic-soft"/><circle cx="34" cy="23" r="1.6" class="ic-fill-acc"/>',
 errors:'<path d="M24 7l18 31H6z"/><path d="M24 18v10" class="ic-warn"/><circle cx="24" cy="33" r="1.8" class="ic-fill-warn"/>',
 macro:'<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="6" class="ic-fill-warn"/>',
 vbe:'<rect x="6" y="9" width="36" height="30" rx="3"/><path d="M17 19l-6 5 6 5M31 19l6 5-6 5" class="ic-acc"/><path d="M27 17l-6 14"/>',
 tag:'<path d="M8 24V9h15l17 17-13 13z"/><circle cx="15" cy="16" r="2.5" class="ic-fill-acc"/>',
 comment:'<path d="M8 10h32v21H22l-8 7v-7H8z"/><path d="M14 17h20M14 23h12" class="ic-acc"/>',
 gear:'<circle cx="24" cy="24" r="6" class="ic-acc"/><path d="M24 6v7M24 35v7M6 24h7M35 24h7M11.3 11.3l5 5M31.7 31.7l5 5M11.3 36.7l5-5M31.7 16.3l5-5"/>',
 loop:'<path d="M13 19a12 12 0 0 1 22-1"/><path d="M36 11v8h-8" class="ic-acc"/><path d="M35 29a12 12 0 0 1-22 1"/><path d="M12 37v-8h8" class="ic-acc"/>',
 bolt:'<path d="M27 6L12 27h11l-2 15 15-21H25z"/>',
 spark:'<path d="M20 8l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/><path d="M35 28l1.5 4.5L41 34l-4.5 1.5L35 40l-1.5-4.5L29 34l4.5-1.5z" class="ic-fill-acc"/>',
};
const READ_ICON: Record<string, string> = { 'named-range': 'tag', 'kolaborasi-berbagi': 'comment', 'opsi-workbook': 'gear', 'vba-logika': 'loop', 'vba-kantor': 'vbe', 'vba-event-udf': 'bolt', 'excel-ai': 'spark' };
export function TopicIcon({ lesson }: { lesson: any }) {
  const key = (Array.isArray(lesson.preview) ? lesson.preview[0] : lesson.preview) || READ_ICON[lesson.id] || 'window';
  return <svg viewBox="0 0 48 48" className="ic" aria-hidden="true" dangerouslySetInnerHTML={{ __html: IC[key] || IC.window }} />;
}

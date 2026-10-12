import React from "react";
import { Plus } from "lucide-react";

/** Daftar tanya-jawab yang bisa dibuka-tutup (pakai <details>, tanpa JS). */
export function DaftarFaq({ items }) {
  return (
    <div className="pb-faq">
      {items.map((it) => (
        <details key={it.q}>
          <summary>
            {it.q}
            <Plus size={18} aria-hidden="true" />
          </summary>
          <div className="a">
            {it.a.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

type Row = Record<string, unknown>;

export function exportToCsv(filename: string, rows: readonly Row[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPdf(title: string, rows: Record<string, unknown>[]) {
  // Client-side "print to PDF" via new window.
  const w = window.open("", "_blank");
  if (!w) return;
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  w.document.write(`
    <html><head><title>${title}</title>
    <style>
      body{font-family:Inter,system-ui,sans-serif;padding:24px;color:#0f172a}
      h1{font-size:20px;margin:0 0 16px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{border:1px solid #e2e8f0;padding:6px 8px;text-align:left}
      th{background:#f1f5f9}
    </style>
    </head><body>
    <h1>${title}</h1>
    <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows
      .map(
        (r) => `<tr>${headers.map((h) => `<td>${r[h] ?? ""}</td>`).join("")}</tr>`,
      )
      .join("")}</tbody></table>
    <script>window.onload=()=>window.print()</script>
    </body></html>
  `);
  w.document.close();
}

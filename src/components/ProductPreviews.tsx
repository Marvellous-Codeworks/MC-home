/**
 * Lightweight blueprint-style mock UIs used as product previews on the
 * landing page. Pure CSS — no images required.
 */

export function TgdPreview() {
  const tabs = [
    { title: "github.com/marvellous-codeworks", state: "active", mem: "184 MB" },
    { title: "developer.chrome.com — discard API", state: "discarded", mem: "0 MB" },
    { title: "news.ycombinator.com", state: "discarded", mem: "0 MB" },
    { title: "figma.com — design system", state: "audio", mem: "212 MB" },
    { title: "stackoverflow.com — chrome.tabs", state: "discarded", mem: "0 MB" },
  ];

  return (
    <div className="h-full w-full p-4 font-mono text-[10px] flex flex-col gap-3">
      <div className="flex items-center justify-between text-muted-foreground uppercase tracking-widest">
        <span>TGD // tab.discard()</span>
        <span className="text-primary">SAVED 1.2 GB</span>
      </div>
      <div className="flex-1 border border-border divide-y divide-border">
        {tabs.map((t) => (
          <div key={t.title} className="flex items-center gap-3 px-3 py-2">
            <span
              className={
                "inline-block size-1.5 shrink-0 rounded-full " +
                (t.state === "active"
                  ? "bg-primary"
                  : t.state === "audio"
                    ? "bg-foreground"
                    : "bg-white/20")
              }
            />
            <span className="flex-1 truncate text-foreground/80">{t.title}</span>
            <span
              className={
                "uppercase tracking-widest text-[9px] " +
                (t.state === "discarded" ? "text-primary" : "text-muted-foreground")
              }
            >
              {t.state}
            </span>
            <span className="w-16 text-right text-muted-foreground">{t.mem}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-muted-foreground">
        <span>5 tabs / 3 discarded</span>
        <span className="text-foreground">⌥ + D</span>
      </div>
    </div>
  );
}

export function TmsPreview() {
  const bars = [82, 64, 48, 36, 28, 22, 18, 14, 12, 11];

  return (
    <div className="h-full w-full p-4 font-mono text-[10px] flex flex-col gap-3">
      <div className="flex items-center justify-between text-muted-foreground uppercase tracking-widest">
        <span>TMS // suspend.session</span>
        <span className="text-primary">● HIBERNATING</span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="border border-border p-3 flex flex-col justify-between">
          <span className="text-muted-foreground uppercase tracking-widest">Memory ↓</span>
          <div className="flex items-end gap-1 h-16">
            {bars.map((h, i) => (
              <div
                key={i}
                className={i < 2 ? "bg-foreground/40 flex-1" : "bg-primary flex-1"}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-foreground">
            <span>4.1 GB</span>
            <span className="text-primary">0.6 GB</span>
          </div>
        </div>
        <div className="border border-border p-3 flex flex-col gap-2">
          <span className="text-muted-foreground uppercase tracking-widest">Rules</span>
          <Row label="Idle &gt; 30 min" on />
          <Row label="On battery" on />
          <Row label="Pin protected" on />
          <Row label="Form input" />
          <Row label="Whitelist" on />
        </div>
      </div>

      <div className="flex items-center justify-between text-muted-foreground">
        <span>24 tabs suspended</span>
        <span className="text-foreground">Session safe</span>
      </div>
    </div>
  );
}

function Row({ label, on = false }: { label: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground/80" dangerouslySetInnerHTML={{ __html: label }} />
      <span
        className={
          "inline-block w-6 h-3 border " +
          (on ? "border-primary bg-primary/30" : "border-border bg-transparent")
        }
      >
        <span
          className={
            "block h-full w-1/2 " + (on ? "bg-primary translate-x-full" : "bg-muted-foreground/40")
          }
        />
      </span>
    </div>
  );
}

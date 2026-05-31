import type { ReactNode } from "react";

export interface ProductFeature {
  title: string;
  body: string;
}

export interface ProductCardProps {
  index: string;
  code: string;
  name: string;
  description: string;
  features: ProductFeature[];
  preview: ReactNode;
  storeUrl: string;
  sourceUrl: string;
  delay?: number;
}

export function ProductCard({
  index,
  code,
  name,
  description,
  features,
  preview,
  storeUrl,
  sourceUrl,
  delay = 0,
}: ProductCardProps) {
  return (
    <article
      className="bg-background p-8 lg:p-12 animate-reveal group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <header className="mb-12 flex justify-between items-start">
        <div className="size-12 border border-border flex items-center justify-center font-mono text-xl group-hover:border-primary group-hover:text-primary transition-colors">
          {index}
        </div>
        <div className="text-right">
          <span className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Extension Code
          </span>
          <span className="block font-mono text-sm">{code}</span>
        </div>
      </header>

      <h2 className="text-3xl font-mono font-bold mb-4 tracking-tight">{name}</h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">{description}</p>

      <ul className="space-y-4 mb-12">
        {features.map((f) => (
          <li key={f.title} className="flex items-start gap-4">
            <div className="mt-1.5 size-1 bg-primary shrink-0" aria-hidden />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground font-medium">{f.title}</strong> {f.body}
            </p>
          </li>
        ))}
      </ul>

      <div className="w-full aspect-video bg-white/[0.03] mb-12 border border-border group-hover:border-primary/20 transition-colors overflow-hidden">
        {preview}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={storeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 h-12 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-foreground transition-colors rounded-sm"
        >
          Chrome Web Store
        </a>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 h-12 border border-border font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-white/5 transition-colors rounded-sm"
        >
          GitHub Source
        </a>
      </div>
    </article>
  );
}

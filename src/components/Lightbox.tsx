import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxSlide {
  src: string;
  alt: string;
}

interface LightboxProps {
  slides: LightboxSlide[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ slides, index, onClose, onIndexChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + slides.length) % slides.length);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % slides.length);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, slides.length, onClose, onIndexChange]);

  const slide = slides[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={slide.alt}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 flex items-center justify-center border border-border bg-background text-foreground hover:bg-accent transition-colors"
      >
        <X className="w-5 h-5" aria-hidden />
      </button>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + slides.length) % slides.length);
            }}
            aria-label="Previous screenshot"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center border border-border bg-background text-foreground hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % slides.length);
            }}
            aria-label="Next screenshot"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center border border-border bg-background text-foreground hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-5 h-5" aria-hidden />
          </button>
        </>
      )}

      <img
        src={slide.src}
        alt={slide.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain border border-border"
      />

      {slides.length > 1 && (
        <span className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground bg-background/80 border border-border px-2 py-1">
          {index + 1} / {slides.length}
        </span>
      )}
    </div>
  );
}

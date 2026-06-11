import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export interface ScreenshotSlide {
  src: string;
  alt: string;
}

interface ScreenshotCarouselProps {
  slides: ScreenshotSlide[];
}

export function ScreenshotCarousel({ slides }: ScreenshotCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on("select", update);
    update();
    return () => { emblaApi.off("select", update); };
  }, [emblaApi]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <div className="relative h-full w-full group/carousel">
      {/* Embla viewport — must have explicit h-full so images fill the aspect-video container */}
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full h-full">
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next — appear on hover */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous screenshot"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7 flex items-center justify-center bg-background/70 border border-border text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-background"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next screenshot"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7 flex items-center justify-center bg-background/70 border border-border text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-background"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to screenshot ${i + 1}`}
            className={
              "h-1 transition-all " +
              (i === current
                ? "w-4 bg-primary"
                : "w-1 bg-foreground/30 hover:bg-foreground/60")
            }
          />
        ))}
      </div>
    </div>
  );
}

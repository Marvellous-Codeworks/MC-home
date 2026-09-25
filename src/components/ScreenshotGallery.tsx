import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";

interface GallerySlide {
  src: string;
  alt: string;
}

interface ScreenshotGalleryProps {
  slides: GallerySlide[];
}

/**
 * Bento-style screenshot gallery.
 * First image is large (spans 2 rows), remaining images fill a tighter grid.
 * Works for 4–7 images. Click any thumbnail to open it in a lightbox.
 */
export function ScreenshotGallery({ slides }: ScreenshotGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [featured, ...rest] = slides;

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full aspect-[16/9]">
        {/* Featured — spans full height on the left */}
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          aria-label={`Open ${featured.alt}`}
          className="col-span-2 row-span-2 overflow-hidden border border-border group/img cursor-zoom-in"
        >
          <img
            src={featured.src}
            alt={featured.alt}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
          />
        </button>

        {/* Remaining thumbnails — fill right column */}
        {rest.slice(0, 4).map((slide, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setLightboxIndex(i + 1)}
            aria-label={`Open ${slide.alt}`}
            className="overflow-hidden border border-border group/img cursor-zoom-in"
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.04]"
            />
          </button>
        ))}

        {/* If there are more than 4 thumbnails, show a "+N more" overlay on the last cell */}
        {rest.length > 4 && (
          <button
            type="button"
            onClick={() => setLightboxIndex(5)}
            aria-label={`Open ${rest[4].alt}`}
            className="overflow-hidden border border-border relative group/img cursor-zoom-in"
          >
            <img
              src={rest[4].src}
              alt={rest[4].alt}
              className="w-full h-full object-cover object-top"
            />
            {rest.length > 5 && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-foreground">
                  +{rest.length - 4}
                </span>
              </div>
            )}
          </button>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          slides={slides}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}

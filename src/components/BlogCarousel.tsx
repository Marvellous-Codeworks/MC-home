import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import useEmblaCarousel from "embla-carousel-react";
import { getBlogPosts, type BlogPost } from "@/lib/blog-posts.functions";
import { useI18n } from "@/lib/i18n";

const STALE_MS = 1000 * 60 * 30;

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function BlogPostCard({ post, readLabel }: { post: BlogPost; readLabel: string }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col gap-4 h-full p-8 bg-background border border-border hover:border-primary/40 transition-colors"
    >
      {post.date && (
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {formatDate(post.date)}
        </span>
      )}
      <h3 className="font-mono text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5 flex-1">
          {post.excerpt}
        </p>
      )}
      <span className="font-mono text-[10px] text-primary mt-auto">{readLabel}</span>
    </a>
  );
}

export function BlogCarousel() {
  const { t } = useI18n();
  const fetchPosts = useServerFn(getBlogPosts);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: () => fetchPosts(),
    staleTime: STALE_MS,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true,
  });
  const [current, setCurrent] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateState = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateState);
    emblaApi.on("reInit", updateState);
    updateState();
    return () => {
      emblaApi.off("select", updateState);
      emblaApi.off("reInit", updateState);
    };
  }, [emblaApi, updateState]);

  if (isLoading) {
    return (
      <p className="font-mono text-xs text-muted-foreground py-8">
        {t("blog.loading")}
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="font-mono text-xs text-muted-foreground py-8">
        {t("blog.empty")}
      </p>
    );
  }

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[45%] lg:basis-[31%]"
            >
              <BlogPostCard post={post} readLabel={t("blog.cta.read")} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-6">
        <div className="flex gap-2">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous post"
            className="h-7 w-7 flex items-center justify-center border border-border text-foreground disabled:opacity-30 hover:border-primary hover:text-primary transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next post"
            className="h-7 w-7 flex items-center justify-center border border-border text-foreground disabled:opacity-30 hover:border-primary hover:text-primary transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to post ${i + 1}`}
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
    </div>
  );
}

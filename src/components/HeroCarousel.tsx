import { useCallback, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useEmblaState } from "@/hooks/use-embla-state";
import { useI18n } from "@/lib/i18n";
import heroChrome from "@/assets/hero-chrome-opt.webp";
import logdropDashboard from "@/assets/logdrop-admin-dashboard.webp";

const LOGDROP_DOCS_URL = "https://kb.marvellouscode.works/docs/logdrop/overview";
const OAUTH_PROXY_DOCS_URL = "https://kb.marvellouscode.works/docs/tms-oauth-proxy/overview";

const CTA_BASE =
  "h-11 px-6 font-mono font-bold text-xs uppercase tracking-widest inline-flex items-center justify-center transition-colors rounded-sm";
const CTA_PRIMARY = `${CTA_BASE} bg-primary text-primary-foreground hover:bg-foreground`;
const CTA_SECONDARY = `${CTA_BASE} border border-border hover:bg-accent`;

interface Slide {
  id: string;
  tab: { title: string; body: string };
  eyebrow: string;
  title: [string, string, string];
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  visual: ReactNode;
}

/** Screenshot on the right of a slide, faded into the page. */
function HeroImage({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      className="hidden lg:block absolute -top-24 -bottom-16 right-0 w-[62%] pointer-events-none z-0"
    >
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent z-10" />
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-left-top opacity-60"
      />
    </div>
  );
}

/** Framed instead of faded: this screenshot has a light background in both themes. */
function HeroWindow({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      className="hidden lg:flex absolute inset-y-0 right-0 w-[38%] items-center z-0 pointer-events-none"
    >
      <img
        src={src}
        alt=""
        className="w-full aspect-[4/3] object-cover object-left-top border border-border rounded-sm"
      />
    </div>
  );
}

/** The proxy has no UI to screenshot, so its slide shows the exchange instead. */
function ProxyFlow() {
  const { t } = useI18n();
  const steps = [
    { name: t("hero.proxy.flow.a.t"), body: t("hero.proxy.flow.a.b") },
    { name: t("hero.proxy.flow.b.t"), body: t("hero.proxy.flow.b.b"), highlight: true },
    { name: t("hero.proxy.flow.c.t"), body: t("hero.proxy.flow.c.b") },
  ];
  return (
    <div
      aria-hidden
      className="hidden lg:flex absolute inset-y-0 right-0 w-[34%] flex-col justify-center z-0 pointer-events-none"
    >
      {steps.map((step, i) => (
        <div key={step.name}>
          {i > 0 && <div className="ml-6 h-6 w-px bg-border" />}
          <div
            className={`border bg-background p-4 ${step.highlight ? "border-primary" : "border-border"}`}
          >
            <p className="font-mono text-xs font-bold uppercase tracking-widest">{step.name}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{step.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroCarousel() {
  const { t } = useI18n();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const { selected } = useEmblaState(emblaApi);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const slides: Slide[] = [
    {
      id: "extensions",
      tab: { title: t("hero.tab.ext.t"), body: t("hero.tab.ext.b") },
      eyebrow: t("hero.ext.eyebrow"),
      title: [t("hero.title.a"), t("hero.title.b"), t("hero.title.c")],
      subtitle: t("hero.ext.subtitle"),
      primary: { label: t("tms.name"), href: "/tms" },
      secondary: { label: t("tgd.name"), href: "/tgd" },
      visual: <HeroImage src={heroChrome} />,
    },
    {
      id: "logdrop",
      tab: { title: t("logdrop.name"), body: t("hero.tab.logdrop.b") },
      eyebrow: t("hero.logdrop.eyebrow"),
      title: [t("hero.logdrop.title.a"), t("hero.logdrop.title.b"), t("hero.logdrop.title.c")],
      subtitle: t("hero.logdrop.subtitle"),
      primary: { label: t("product.learnMore"), href: "/logdrop" },
      secondary: { label: t("oauthproxy.cta.docs"), href: LOGDROP_DOCS_URL },
      visual: <HeroWindow src={logdropDashboard} />,
    },
    {
      id: "oauth-proxy",
      tab: { title: t("oauthproxy.name"), body: t("hero.tab.proxy.b") },
      eyebrow: t("hero.proxy.eyebrow"),
      title: [t("hero.proxy.title.a"), t("hero.proxy.title.b"), t("hero.proxy.title.c")],
      subtitle: t("hero.proxy.subtitle"),
      primary: { label: t("product.learnMore"), href: "/tms-oauth-proxy" },
      secondary: { label: t("oauthproxy.cta.docs"), href: OAUTH_PROXY_DOCS_URL },
      visual: <ProxyFlow />,
    },
  ];

  // The progress bar's CSS animation is the timer: it pauses with the carousel,
  // and with reduced motion it doesn't run, so nothing rotates on its own.
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const paused = hovered || focused;

  return (
    <header
      id="hero"
      aria-roledescription="carousel"
      aria-label={t("hero.carousel.label")}
      className="relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, i) => {
            const Heading = i === 0 ? "h1" : "h2";
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={slide.tab.title}
                inert={i !== selected}
                className="min-w-0 shrink-0 grow-0 basis-full px-6 pt-24 pb-16"
              >
                <div className="max-w-6xl mx-auto relative">
                  {slide.visual}
                  <div className="relative z-10">
                    <p className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-6">
                      {slide.eyebrow}
                    </p>
                    <Heading
                      className={`text-5xl md:text-7xl font-mono font-extrabold tracking-tight text-balance leading-[0.9] max-w-4xl ${i === 0 ? "" : "lg:max-w-[58%]"}`}
                    >
                      {slide.title[0]}
                      <span className="text-primary">{slide.title[1]}</span>
                      {slide.title[2]}
                    </Heading>
                    <p
                      className={`mt-8 text-xl text-muted-foreground max-w-[50ch] text-pretty ${i === 0 ? "" : "lg:max-w-[58%]"}`}
                    >
                      {slide.subtitle}
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-3">
                      <a href={slide.primary.href} className={CTA_PRIMARY}>
                        {slide.primary.label}
                      </a>
                      <a href={slide.secondary.href} className={CTA_SECONDARY}>
                        {slide.secondary.label}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Always visible, so the three products read at a glance */}
      <div className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 border border-border bg-background">
          {slides.map((slide, i) => {
            const active = i === selected;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                aria-current={active}
                className={`relative p-4 text-left border-border not-last:border-b sm:not-last:border-b-0 sm:not-last:border-r transition-colors hover:bg-accent ${active ? "" : "text-muted-foreground"}`}
              >
                {active && (
                  <span
                    key={selected}
                    aria-hidden
                    onAnimationEnd={next}
                    style={{ animationPlayState: paused ? "paused" : "running" }}
                    className="hero-progress absolute inset-x-0 top-0 h-0.5 bg-primary origin-left"
                  />
                )}
                <span className="block font-mono text-xs font-bold uppercase tracking-widest">
                  {slide.tab.title}
                </span>
                <span className="block mt-1 text-sm text-muted-foreground">{slide.tab.body}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Background grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#fff_70%,transparent_100%)]"
      />
    </header>
  );
}

import { useCallback, useSyncExternalStore } from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";

type EmblaCarouselType = NonNullable<UseEmblaCarouselType[1]>;

export interface EmblaState {
  selected: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const INITIAL: EmblaState = { selected: 0, canScrollPrev: false, canScrollNext: false };

// Snapshots must be referentially stable, so the state is encoded as a string
// and decoded outside the store.
function encode(api: EmblaCarouselType | undefined): string {
  if (!api) return "0|0|0";
  return `${api.selectedScrollSnap()}|${api.canScrollPrev() ? 1 : 0}|${api.canScrollNext() ? 1 : 0}`;
}

/** Selected slide and prev/next availability of an Embla carousel, kept in sync with its events. */
export function useEmblaState(api: EmblaCarouselType | undefined): EmblaState {
  const subscribe = useCallback(
    (listener: () => void) => {
      if (!api) return () => {};
      api.on("select", listener);
      api.on("reInit", listener);
      return () => {
        api.off("select", listener);
        api.off("reInit", listener);
      };
    },
    [api],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    () => encode(api),
    () => encode(undefined),
  );
  if (!api) return INITIAL;
  const [selected, prev, next] = snapshot.split("|");
  return { selected: Number(selected), canScrollPrev: prev === "1", canScrollNext: next === "1" };
}

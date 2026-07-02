import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getBlogNotifications, type BlogNotification } from "@/lib/blog-notifications.functions";
import { useI18n } from "@/lib/i18n";

const STORAGE_KEY = "mc.notif.read";
const STALE_MS = 1000 * 60 * 30; // 30 minutes

function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    /* noop */
  }
  return new Set();
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* noop */
  }
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function NotificationBell() {
  const { t } = useI18n();
  const fetchNotifs = useServerFn(getBlogNotifications);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery<BlogNotification[]>({
    queryKey: ["blog-notifications"],
    queryFn: () => fetchNotifs(),
    staleTime: STALE_MS,
  });

  // Load read state from localStorage after hydration
  useEffect(() => {
    setReadIds(loadReadIds());
  }, []);

  const unreadCount = posts.filter((p) => !readIds.has(p.id)).length;

  const markRead = useCallback(
    (id: string) => {
      setReadIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        saveReadIds(next);
        return next;
      });
    },
    [],
  );

  const markAllRead = useCallback(() => {
    const next = new Set(posts.map((p) => p.id));
    setReadIds(next);
    saveReadIds(next);
  }, [posts]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={t("notif.label")}
          className="relative flex items-center justify-center w-8 h-8 rounded-sm text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-[9px] font-bold leading-none">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-96 sm:w-[26rem] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
            {t("notif.label")}
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors"
            >
              {t("notif.mark_all")}
            </button>
          )}
        </div>

        {/* Body */}
        <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <p className="px-4 py-6 font-mono text-xs text-muted-foreground text-center">
              {t("notif.loading")}
            </p>
          ) : posts.length === 0 ? (
            <p className="px-4 py-6 font-mono text-xs text-muted-foreground text-center">
              {t("notif.empty")}
            </p>
          ) : (
            posts.map((post) => {
              const isUnread = !readIds.has(post.id);
              return (
                <div
                  key={post.id}
                  className={`px-4 py-3 transition-colors ${isUnread ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {isUnread && (
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                    <div className={isUnread ? "" : "pl-3.5"}>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => {
                          markRead(post.id);
                          setOpen(false);
                        }}
                        className="font-mono text-[11px] font-semibold text-foreground hover:text-primary leading-snug line-clamp-2 transition-colors"
                      >
                        {post.title}
                      </a>
                      {post.date && (
                        <p className="font-mono text-[9px] text-muted-foreground/70 mt-0.5">
                          {formatDate(post.date)}
                        </p>
                      )}
                      {post.excerpt && (
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed line-clamp-5">
                          {post.excerpt}
                        </p>
                      )}
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => {
                          markRead(post.id);
                          setOpen(false);
                        }}
                        className="inline-block mt-2 font-mono text-[10px] text-primary hover:underline"
                      >
                        {t("notif.read_more")}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

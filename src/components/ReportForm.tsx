import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { useI18n } from "@/lib/i18n";
import { submitReport } from "@/lib/report-submit.functions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const BROWSERS = ["Chrome", "Edge", "Brave", "Vivaldi", "Opera", "Other"] as const;
const OPERATING_SYSTEMS = ["Windows", "macOS", "Linux", "ChromeOS", "Other"] as const;

const DIAGNOSTIC_GUIDE_URL = "https://kb.marvellouscode.works/docs/TMS/pages/diagnostic-page";
const LOGDROP_URL = "https://logdrop.marvellouscode.works";

const REQUIRED = "This field is required.";
const TOO_SHORT = "Please add a bit more detail.";

const schema = z
  .object({
    type: z.enum(["bug", "feature"]),
    title: z.string().min(5, "Please write a short summary (at least 5 characters).").max(200),
    email: z.string().email(),
    honeypot: z.string(),
    // Conditional fields: always strings (controlled inputs), required per
    // `type` in the superRefine below rather than at the field level.
    tmsVersion: z.string().max(40),
    browser: z.string().max(20),
    browserVersion: z.string().max(60),
    os: z.string().max(20),
    whatHappened: z.string().max(4000),
    steps: z.string().max(4000),
    expected: z.string().max(2000),
    problem: z.string().max(4000),
    solution: z.string().max(4000),
    alternatives: z.string().max(2000),
  })
  .superRefine((v, ctx) => {
    const require = (field: keyof typeof v, minLen = 1) => {
      const value = String(v[field] ?? "").trim();
      if (!value) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: REQUIRED });
      } else if (value.length < minLen) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: TOO_SHORT });
      }
    };
    if (v.type === "bug") {
      require("tmsVersion");
      require("browser");
      require("browserVersion");
      require("os");
      require("whatHappened", 10);
      require("steps", 10);
    } else {
      require("problem", 10);
      require("solution", 10);
    }
  });

type FormValues = z.infer<typeof schema>;

const inputClass = "h-10 w-full border border-border bg-background px-3 text-sm";
const textareaClass = "w-full border border-border bg-background px-3 py-2 text-sm";

function buildBody(v: FormValues): string {
  const sections: string[] =
    v.type === "bug"
      ? [
          `### TMS version\n${v.tmsVersion.trim()}`,
          `### Browser\n${v.browser}${
            v.browserVersion.trim() ? ` ${v.browserVersion.trim()}` : ""
          }`,
          `### Operating system\n${v.os}`,
          `### What happened\n${v.whatHappened.trim()}`,
          `### Steps to reproduce\n${v.steps.trim()}`,
          ...(v.expected.trim() ? [`### Expected behaviour\n${v.expected.trim()}`] : []),
        ]
      : [
          `### Problem / use case\n${v.problem.trim()}`,
          `### Proposed solution\n${v.solution.trim()}`,
          ...(v.alternatives.trim()
            ? [`### Alternatives considered\n${v.alternatives.trim()}`]
            : []),
        ];
  return sections.join("\n\n");
}

export function ReportForm({
  repo,
}: {
  repo: { owner: string; repo: string };
  productKey: string;
}) {
  const { t, locale } = useI18n();
  const submit = useServerFn(submitReport);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formLoadedAt] = useState(() => Date.now());

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "bug",
      title: "",
      email: "",
      honeypot: "",
      tmsVersion: "",
      browser: "",
      browserVersion: "",
      os: "",
      whatHappened: "",
      steps: "",
      expected: "",
      problem: "",
      solution: "",
      alternatives: "",
    },
  });

  const type = useWatch({ control: form.control, name: "type" });

  async function onSubmit(values: FormValues) {
    setStatus("sending");
    try {
      await submit({
        data: {
          type: values.type,
          title: values.title,
          body: buildBody(values),
          email: values.email,
          honeypot: values.honeypot,
          owner: repo.owner,
          repo: repo.repo,
          locale,
          formLoadedAt,
        },
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-border p-8 space-y-2">
        <p className="font-mono text-sm font-bold">{t("report.form.success.title")}</p>
        <p className="text-sm text-muted-foreground">
          {t("report.form.success.body").replace("{email}", form.getValues("email"))}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px overflow-hidden"
          {...form.register("honeypot")}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("report.form.type")}</FormLabel>
              <FormControl>
                <select {...field} className={inputClass}>
                  <option value="bug">{t("report.form.type.bug")}</option>
                  <option value="feature">{t("report.form.type.feature")}</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("report.form.title")}</FormLabel>
              <FormControl>
                <input
                  {...field}
                  placeholder={t("report.form.title.placeholder")}
                  className={inputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === "bug" && (
          <>
            <FormField
              control={form.control}
              name="tmsVersion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.tmsVersion")}</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder={t("report.form.tmsVersion.placeholder")}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="browser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.browser")}</FormLabel>
                  <FormControl>
                    <select {...field} className={inputClass}>
                      <option value="">{t("report.form.select")}</option>
                      {BROWSERS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="browserVersion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.browserVersion")}</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder={t("report.form.browserVersion.placeholder")}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="os"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.os")}</FormLabel>
                  <FormControl>
                    <select {...field} className={inputClass}>
                      <option value="">{t("report.form.select")}</option>
                      {OPERATING_SYSTEMS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatHappened"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.whatHappened")}</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder={t("report.form.whatHappened.placeholder")}
                      rows={5}
                      className={textareaClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.steps")}</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder={t("report.form.steps.placeholder")}
                      rows={5}
                      className={textareaClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expected"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.expected")}</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder={t("report.form.expected.placeholder")}
                      rows={3}
                      className={textareaClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-xs text-muted-foreground">
              {t("report.form.diagnosticHint")}{" "}
              <a
                href={DIAGNOSTIC_GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                {t("report.form.diagnosticHint.link")}
              </a>
              . {t("report.form.diagnosticHint.privacy")}{" "}
              <a
                href={LOGDROP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                {t("report.form.diagnosticHint.logdropLink")}
              </a>{" "}
              {t("report.form.diagnosticHint.privacySuffix")}
            </p>
          </>
        )}

        {type === "feature" && (
          <>
            <FormField
              control={form.control}
              name="problem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.problem")}</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder={t("report.form.problem.placeholder")}
                      rows={5}
                      className={textareaClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.solution")}</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder={t("report.form.solution.placeholder")}
                      rows={5}
                      className={textareaClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternatives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("report.form.alternatives")}</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder={t("report.form.alternatives.placeholder")}
                      rows={3}
                      className={textareaClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("report.form.email")}</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="email"
                  placeholder={t("report.form.email.placeholder")}
                  className={inputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {status === "error" && <p className="text-sm text-destructive">{t("report.form.error")}</p>}

        <button
          type="submit"
          disabled={status === "sending"}
          className="h-11 px-6 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest hover:bg-foreground transition-colors rounded-sm disabled:opacity-50"
        >
          {status === "sending" ? t("report.form.submitting") : t("report.form.submit")}
        </button>
      </form>
    </Form>
  );
}

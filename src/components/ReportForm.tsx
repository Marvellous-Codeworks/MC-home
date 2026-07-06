import { useState } from "react";
import { useForm } from "react-hook-form";
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

const schema = z.object({
  type: z.enum(["bug", "feature"]),
  title: z.string().min(5).max(200),
  body: z.string().min(10).max(5000),
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

export function ReportForm({
  repo,
}: {
  repo: { owner: string; repo: string };
  productKey: string;
}) {
  const { t, locale } = useI18n();
  const submit = useServerFn(submitReport);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "bug", title: "", body: "", email: "" },
  });

  async function onSubmit(values: FormValues) {
    setStatus("sending");
    try {
      await submit({
        data: {
          ...values,
          owner: repo.owner,
          repo: repo.repo,
          locale,
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
        <p className="font-mono text-sm font-bold">
          {t("report.form.success.title")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("report.form.success.body").replace(
            "{email}",
            form.getValues("email"),
          )}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("report.form.type")}</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="h-10 w-full border border-border bg-background px-3 text-sm"
                >
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
                  className="h-10 w-full border border-border bg-background px-3 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("report.form.body")}</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder={t("report.form.body.placeholder")}
                  rows={6}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  className="h-10 w-full border border-border bg-background px-3 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {status === "error" && (
          <p className="text-sm text-destructive">{t("report.form.error")}</p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-11 px-6 bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-widest hover:bg-foreground transition-colors rounded-sm disabled:opacity-50"
        >
          {status === "sending"
            ? t("report.form.submitting")
            : t("report.form.submit")}
        </button>
      </form>
    </Form>
  );
}

// components/forms/newsletter-form.tsx
"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  subscribeNewsletter,
  type NewsletterState,
} from "@/app/actions/newsletter";

const initialState: NewsletterState = { status: "idle" };

function SubmitButton({ tone }: { tone: "light" | "dark" }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(
        "self-start",
        tone === "dark" && "bg-canvas text-near-black hover:bg-canvas/90",
      )}
    >
      {pending ? "Subscribing…" : "Subscribe"}
    </Button>
  );
}

interface Props {
  tone?: "light" | "dark";
  className?: string;
}

export function NewsletterForm({ tone = "light", className }: Props) {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);
  const fieldErrors = state.status === "error" ? state.fieldErrors ?? {} : {};
  const isDark = tone === "dark";

  return (
    <form action={formAction} className={cn("flex flex-col gap-4", className)} noValidate>
      {/* Honeypot — hidden from real users and screen readers (tabIndex=-1, aria-hidden) */}
      <div className="hidden" aria-hidden>
        <label>
          Don&apos;t fill this out
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label htmlFor="nl-email" className="sr-only">
        Email
      </label>
      <Input
        id="nl-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@studio.com"
        aria-invalid={fieldErrors.email ? "true" : undefined}
        aria-describedby={fieldErrors.email ? "nl-email-error" : undefined}
        className={cn(
          "h-12",
          isDark && "bg-canvas/95 text-ink placeholder:text-muted-slate",
        )}
      />
      {fieldErrors.email ? (
        <p id="nl-email-error" className={cn("text-xs", isDark ? "text-soft-coral" : "text-error-red")}>
          {fieldErrors.email}
        </p>
      ) : null}

      <SubmitButton tone={tone} />

      {state.status === "ok" ? (
        <p
          role="status"
          aria-live="polite"
          className={cn("text-sm", isDark ? "text-canvas/85" : "text-ink/80")}
        >
          {state.message}
        </p>
      ) : null}
      {state.status === "error" && !Object.keys(fieldErrors).length ? (
        <p
          role="alert"
          className={cn("text-sm", isDark ? "text-soft-coral" : "text-error-red")}
        >
          {state.message}
        </p>
      ) : null}

      <p className={cn("text-xs", isDark ? "text-canvas/60" : "text-muted-slate")}>
        By subscribing you agree to our{" "}
        <a href="/legal/privacy" className="underline underline-offset-4">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}

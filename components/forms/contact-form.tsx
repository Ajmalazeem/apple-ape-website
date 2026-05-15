// components/forms/contact-form.tsx
"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContact, type ContactState } from "@/app/actions/contact";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="self-start">
      {pending ? "Sending…" : "Send message"}
    </Button>
  );
}

interface FieldProps {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, name, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-slate"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs text-error-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <form
      action={formAction}
      className="rounded-lg border border-hairline bg-canvas p-8 sm:p-10"
      noValidate
    >
      <div className="hidden" aria-hidden>
        <label>
          Don&apos;t fill this out
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" error={errors.name}>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>

        <Field label="Email" name="email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Subject (optional)" name="subject" error={errors.subject}>
          <Input id="subject" name="subject" />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Message" name="message" error={errors.message}>
          <Textarea
            id="message"
            name="message"
            required
            rows={8}
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
        </Field>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <SubmitButton />

        {state.status === "ok" ? (
          <p role="status" aria-live="polite" className="text-sm text-ink/80">
            {state.message}
          </p>
        ) : null}
        {state.status === "error" && !Object.keys(errors).length ? (
          <p role="alert" className="text-sm text-error-red">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

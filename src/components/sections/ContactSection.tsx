import React, { useState } from "react";
import { Send, FileText, ExternalLink, PlaneTakeoff, User, Mail, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_EMAIL = "vvictort20@gmail.com";

type ContactResponse = {
  message?: string;
  fieldErrors?: FormErrors;
  code?: string;
  fallbackEmail?: string;
};

const buildDeliveryUnavailableMessage = (email: string) =>
  `I can't receive contact form messages right now. Email me directly at ${email}.`;

const buildGatewayMessage = (code: string | undefined, email: string) => {
  if (code === "gateway_rate_limited") {
    return `The contact form is busy right now. Please try again shortly, or email me directly at ${email}.`;
  }

  return buildDeliveryUnavailableMessage(email);
};

const buildMailtoHref = (email: string, state: FormState) => {
  const subject = state.subject.trim() || `Portfolio inquiry from ${state.name.trim() || "your site"}`;
  const bodyLines = [
    state.name.trim() ? `Name: ${state.name.trim()}` : "",
    state.email.trim() ? `Email: ${state.email.trim()}` : "",
    "",
    state.message.trim(),
  ].filter(Boolean);

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join("\n"),
  });

  return `mailto:${email}?${params.toString()}`;
};

export function ContactSection() {
  const initialFormState: FormState = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVars = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  const [formState, setFormState] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [fallbackEmail, setFallbackEmail] = useState("");

  const validateField = (field: keyof FormState, value: string) => {
    const trimmedValue = value.trim();

    if (field === "name" && !trimmedValue) return "Your name is required.";
    if (field === "email") {
      if (!trimmedValue) return "Your email is required.";
      if (!EMAIL_PATTERN.test(trimmedValue)) return "Please enter a valid email address.";
    }
    if (field === "message" && !trimmedValue) return "A message is required.";

    return "";
  };

  const validateForm = (state: FormState) => {
    const nextErrors: FormErrors = {};

    (["name", "email", "message"] as const).forEach((field) => {
      const error = validateField(field, state[field]);
      if (error) nextErrors[field] = error;
    });

    return nextErrors;
  };

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;

      const nextErrors = { ...current };
      const error = validateField(field, value);

      if (error) nextErrors[field] = error;
      else delete nextErrors[field];

      return nextErrors;
    });
  };

  const handleBlur = (field: keyof FormState) => {
    setFieldErrors((current) => {
      const nextErrors = { ...current };
      const error = validateField(field, formState[field]);

      if (error) nextErrors[field] = error;
      else delete nextErrors[field];

      return nextErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitStatus === "submitting") return;

    const nextErrors = validateForm(formState);
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setSubmitStatus("error");
      setSubmitMessage("Please fix the highlighted fields.");
      setFallbackEmail("");
      return;
    }

    setSubmitStatus("submitting");
    setSubmitMessage("");
    setFieldErrors({});
    setFallbackEmail("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = (await response.json().catch(() => null)) as ContactResponse | null;

      if (!response.ok) {
        if (data?.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }

        const nextFallbackEmail = data?.fallbackEmail || (response.status >= 500 ? CONTACT_EMAIL : "");
        setFallbackEmail(nextFallbackEmail);

        if (data?.message) {
          if (nextFallbackEmail) {
            throw new Error(buildGatewayMessage(data.code, nextFallbackEmail));
          }

          throw new Error(data.message);
        }

        if (response.status >= 500) {
          throw new Error(buildDeliveryUnavailableMessage(nextFallbackEmail || CONTACT_EMAIL));
        }

        throw new Error("Unable to send your message right now.");
      }

      setFormState(initialFormState);
      setFieldErrors({});
      setSubmitStatus("success");
      setSubmitMessage(data?.message || "Transmission sent successfully.");
      setFallbackEmail("");
    } catch (error) {
      setSubmitStatus("error");

      if (error instanceof Error) {
        const isNetworkFailure =
          error.message === "Failed to fetch" ||
          error.message.includes("Load failed") ||
          error.message.includes("NetworkError");

        if (isNetworkFailure) {
          setFallbackEmail(CONTACT_EMAIL);
          setSubmitMessage(buildDeliveryUnavailableMessage(CONTACT_EMAIL));
          return;
        }

        setSubmitMessage(error.message);
        return;
      }

      setFallbackEmail(CONTACT_EMAIL);
      setSubmitMessage(buildDeliveryUnavailableMessage(CONTACT_EMAIL));
    }
  };

  const fallbackMailtoHref = fallbackEmail ? buildMailtoHref(fallbackEmail, formState) : "";

  return (
    <div id="contact" className="w-full max-w-6xl mx-auto px-8 py-20 flex flex-col gap-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-2 relative">
        <div className="flex items-center gap-2 text-primary font-mono text-sm font-bold tracking-widest uppercase mb-2">
          <PlaneTakeoff className="w-4 h-4" />
          <span>CONTROL TOWER //</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">Get In Touch</h2>
        <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
          Have a project in mind, want to collaborate, or just say hello? Send a transmission and I'll respond as soon
          as I land.
        </p>
      </motion.div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        <motion.div
          variants={itemVars}
          className="lg:col-span-3 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group h-full">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase">
              <Send className="w-4 h-4" />
              <span>SEND TRANSMISSION</span>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">MSG-2026</span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 relative z-10 font-mono text-sm flex-1 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    aria-invalid={Boolean(fieldErrors.name)}
                    className={`w-full bg-[#111] border rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:outline-none transition-colors ${
                      fieldErrors.name ? "border-red-500/60 focus:border-red-500/80" : "border-white/10 focus:border-primary/50"
                    }`}
                    value={formState.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                  />
                </div>
                <p className="min-h-[1.25rem] text-xs leading-relaxed text-red-400">{fieldErrors.name || ""}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    aria-invalid={Boolean(fieldErrors.email)}
                    className={`w-full bg-[#111] border rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:outline-none transition-colors ${
                      fieldErrors.email ? "border-red-500/60 focus:border-red-500/80" : "border-white/10 focus:border-primary/50"
                    }`}
                    value={formState.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                  />
                </div>
                <p className="min-h-[1.25rem] text-xs leading-relaxed text-red-400">{fieldErrors.email || ""}</p>
              </div>
            </div>

            <div className="relative group">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                name="subject"
                placeholder="Subject (optional)"
                className="w-full bg-[#111] border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
                value={formState.subject}
                onChange={(e) => updateField("subject", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <div className="relative group flex-1">
                <textarea
                  name="message"
                  placeholder="Your Message *"
                  rows={5}
                  aria-invalid={Boolean(fieldErrors.message)}
                  className={`w-full min-h-[12rem] h-full bg-[#111] border rounded-lg py-4 px-4 text-white placeholder:text-zinc-600 focus:outline-none transition-colors resize-none ${
                    fieldErrors.message
                      ? "border-red-500/60 focus:border-red-500/80"
                      : "border-white/10 focus:border-primary/50"
                  }`}
                  value={formState.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                />
              </div>
              <p className="min-h-[1.25rem] text-xs leading-relaxed text-red-400">{fieldErrors.message || ""}</p>
            </div>

            <button
              type="submit"
              disabled={submitStatus === "submitting"}
              className="mt-2 lg:mt-auto w-full flex items-center justify-center gap-2 cursor-pointer bg-primary/90 hover:bg-primary text-black font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0">
              <Send className="w-4 h-4" />
              <span>{submitStatus === "submitting" ? "SENDING..." : "SEND MESSAGE"}</span>
            </button>

            {submitMessage && (
              <p
                aria-live="polite"
                className={`text-xs leading-relaxed ${
                  submitStatus === "error" ? (fallbackEmail ? "text-primary/90" : "text-red-400") : "text-green-400"
                }`}>
                {submitMessage}
              </p>
            )}

            {submitStatus === "error" && fallbackEmail && (
              <a
                href={fallbackMailtoHref}
                className="self-start font-mono text-[11px] font-bold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors">
                Open email draft
              </a>
            )}
          </form>
        </motion.div>

        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          <motion.div
            variants={itemVars}
            className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group shrink-0">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase mb-6">
              <FileText className="w-4 h-4" />
              <span>FLIGHT MANIFEST</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">Resume / CV</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              View or download my complete resume with experience, education, and skills.
            </p>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-auto self-start items-center gap-2 border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-mono text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg z-10">
              <FileText className="w-4 h-4" />
              <span>OPEN RESUME</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </motion.div>

          <motion.div
            variants={itemVars}
            className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group lg:flex-1">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase mb-8">
              <PlaneTakeoff className="w-4 h-4" />
              <span>FLIGHT INFO</span>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">LOCATION</span>
                <span className="font-mono text-sm text-white font-bold tracking-wider">Vancouver, BC</span>
              </div>
              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-4">
                <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">STATUS</span>
                <span className="font-mono text-sm text-white font-bold tracking-wider">Open to Opportunities</span>
              </div>
              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-4">
                <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">RESPONSE TIME</span>
                <span className="font-mono text-sm text-white font-bold tracking-wider">~24 hours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from "react";
import { Send, FileText, ExternalLink, PlaneTakeoff, User, Mail, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function ContactSection() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVars = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, wire up to Formspree, EmailJS, or similar.
    alert("Transmission sent successfully! (Demo mode)");
  };

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
        {/* Contact Form (Left Side, 3 cols wide) */}
        <motion.div
          variants={itemVars}
          className="lg:col-span-3 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group h-full">
          {/* Background subtle effect */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Form Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold tracking-widest uppercase">
              <Send className="w-4 h-4" />
              <span>SEND TRANSMISSION</span>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">MSG-2026</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10 font-mono text-sm flex-1 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  className="w-full bg-[#111] border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  className="w-full bg-[#111] border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
            </div>

            <div className="relative group">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Subject (optional)"
                className="w-full bg-[#111] border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
              />
            </div>

            <div className="relative group flex-1 min-h-[12rem]">
              <textarea
                required
                placeholder="Your Message *"
                rows={5}
                className="w-full h-full min-h-[12rem] bg-[#111] border border-white/10 rounded-lg py-4 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="mt-4 lg:mt-auto w-full flex items-center justify-center gap-2 cursor-pointer bg-primary/90 hover:bg-primary text-black font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:-translate-y-0.5">
              <Send className="w-4 h-4" />
              <span>SEND MESSAGE</span>
            </button>
          </form>
        </motion.div>

        {/* Right Side Cards (2 cols wide) */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          {/* Resume Card */}
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

          {/* Flight Info Card */}
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

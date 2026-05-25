"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Metadata from "@/components/Metadata";
import Navbar from "@/components/Navbar";
import client from "@/utils/sanity/client";

const CONTACT_DEFAULTS = {
  pageTitle: "CONTACT",
  seoTitle: "Contact | bish.",
  seoKeywords: ["contact", "bish uprety", "creative director", "photographer"],
};

export async function getStaticProps() {
  const settings = await client.fetch(
    `*[_type == "settings" && _id == "settings"][0]{ ... }`,
  );

  return { props: { settings: settings || null }, revalidate: 360 };
}

export default function Contact({ settings }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Metadata
        title={CONTACT_DEFAULTS.seoTitle}
        description="Get in touch with bish Uprety, creative director and photographer based in Toronto."
        keywords={CONTACT_DEFAULTS.seoKeywords}
        canonicalLink="/contact"
      />
      <Navbar settings={settings} />
      <div className="flex flex-col justify-between h-screen mx-4 md:mx-8 pt-20">
        <div className="flex flex-col gap-8 max-w-md pt-4">
          <p className="font-body tracking-tight">
            Get in touch for project inquiries, collaborations, or just to say
            hello.
          </p>

          {status === "success" ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-body tracking-tight"
            >
              Message sent. I&apos;ll be in touch soon.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="font-body text-xs uppercase tracking-widest"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border border-brand-black bg-transparent font-body p-2 tracking-tight focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="font-body text-xs uppercase tracking-widest"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-brand-black bg-transparent font-body p-2 tracking-tight focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="message"
                  className="font-body text-xs uppercase tracking-widest"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="border border-brand-black bg-transparent font-body p-2 tracking-tight focus:outline-none resize-none"
                />
              </div>

              {status === "error" && (
                <p className="font-body text-xs tracking-tight">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="border border-brand-black font-body font-semibold uppercase tracking-widest text-sm py-2 px-6 w-fit hover:bg-brand-black hover:text-brand-white transition-colors disabled:opacity-50"
              >
                {status === "submitting" ? "Sending..." : "Send"}
              </button>
            </form>
          )}
        </div>

        <motion.div className="mb-4 md:mb-8 ml-4 md:ml-8 pt-12">
          <h1 className="text-[48px] md:text-[96px] font-title font-semibold tracking-tight text-brand-black leading-none">
            {CONTACT_DEFAULTS.pageTitle}
          </h1>
        </motion.div>
      </div>
    </>
  );
}

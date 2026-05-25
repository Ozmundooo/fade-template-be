import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", external: true },
  { label: "Contact", href: "/contact" },
];

const menuVariants = {
  closed: {
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
  open: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
};

const backdropVariants = {
  closed: { opacity: 0, transition: { duration: 0.3 } },
  open: { opacity: 1, transition: { duration: 0.3 } },
};

const itemVariants = {
  closed: { opacity: 0, y: 24 },
  open: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: 0.25 + i * 0.07,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on route change
  useEffect(() => {
    const handleRouteChange = () => setOpen(false);
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events]);

  return (
    <>
      {/* ── Top bar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 w-full  flex justify-between items-center p-5 z-[60]      `}
      >
        <Link
          href="/"
          className="text-[0px] font-title font-semibold tracking-tight text-brand-black leading-none"
        >
          bish.
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-[80px] uppercase font-body font-semibold text-lg">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          {SOCIAL_LINKS.map((l) =>
            l.external ? (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ),
          )}
        </div>

        <button
          className={`md:hidden uppercase z-99 font-body font-semibold  my-auto z-[70]
              ${open ? "text-brand-white" : "text-brand-black"}
            `}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[55] bg-brand-black md:hidden"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed inset-0 z-[55] flex flex-col justify-between bg-[#262424] p-5 md:hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Nav items */}
              <div>
                <h1 className="text-[32px] font-title font-semibold tracking-tight text-brand-white leading-none">
                  bish.
                </h1>
                {/* <button
                  className="absolute top-5 right-5 uppercase font-body font-semibold text-sm text-brand-white z-[70]"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  Close
                </button> */}
              </div>
              <ul className="flex flex-col gap-5">
                {NAV_LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      href={l.href}
                      className="block text-[40px] font-title font-semibold uppercase text-brand-white leading-tight hover:opacity-60 transition-opacity"
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Social / secondary links */}
              <motion.div
                className="flex gap-8 justify-end"
                custom={NAV_LINKS.length}
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {SOCIAL_LINKS.map((l) =>
                  l.external ? (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-body text-brand-white/70 hover:text-brand-white transition-colors"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="text-sm font-body text-brand-white/70 hover:text-brand-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  ),
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

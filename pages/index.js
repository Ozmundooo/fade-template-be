"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import Metadata from "@/components/Metadata";
import client, { urlFor } from "@/utils/sanity/client";
import Navbar from "@/components/Navbar";

function useViewport() {
  const [viewport, setViewport] = useState("desktop");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setViewport("mobile");
      else if (window.innerWidth < 1200) setViewport("tablet");
      else setViewport("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return viewport;
}

const HOME_DEFAULTS = {
  brandName: "bish.",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  seoTitle: "bish.",
  seoKeywords: [
    "photography",
    "creative direction",
    "Toronto photographer",
    "bish uprety",
  ],
};

const DESKTOP_POSITIONS = [
  { top: "2%", left: "4%", w: 140 },
  { top: "0%", left: "18%", w: 250 },
  { top: "3%", right: "20%", w: 180 },
  { top: "16%", right: "2%", w: 120 },
  { top: "18%", left: "40%", w: 200 },
  { top: "28%", right: "6%", w: 240 },
  { top: "36%", left: "6%", w: 160 },
  { top: "38%", left: "35%", w: 200 },
  { top: "24%", right: "30%", w: 180 },
  { top: "50%", left: "55%", w: 140 },
  { top: "52%", left: "16%", w: 220 },
  { top: "58%", right: "5%", w: 160 },
  { top: "68%", left: "8%", w: 140 },
  { top: "70%", left: "32%", w: 110 },
  { top: "66%", right: "22%", w: 190 },
  { top: "82%", left: "50%", w: 100 },
  { top: "85%", left: "14%", w: 230 },
  { top: "88%", right: "8%", w: 250 },
];

const TABLET_POSITIONS = [
  { top: "4%", left: "6%", w: 140 },
  { top: "10%", right: "8%", w: 180 },
  { top: "22%", left: "20%", w: 160 },
  { top: "34%", right: "12%", w: 200 },
  { top: "46%", left: "8%", w: 150 },
  { top: "58%", right: "10%", w: 180 },
  { top: "72%", left: "24%", w: 140 },
  { top: "84%", right: "6%", w: 200 },
];

const MOBILE_POSITIONS = [
  { top: "0%", left: "5%", w: 120 },
  { top: "18%", right: "5%", w: 140 },
  { top: "32%", left: "10%", w: 130 },
  { top: "48%", right: "8%", w: 150 },
  { top: "64%", left: "6%", w: 120 },
  { top: "80%", right: "5%", w: 140 },
];

export async function getStaticProps() {
  const [home, work] = await Promise.all([
    client.fetch(
      `*[_type == "home" && _id == "home"][0]{
        brandName,
        description,
        seo
      }`,
    ),
    client.fetch(
      `*[_type == "work"] | order(publishedAt desc, _createdAt desc) {
        _id,
        title,
        image,
        slug,
      }`,
    ),
  ]);

  return { props: { home: home || null, work }, revalidate: 360 };
}

function ScatterImage({ src, alt, pos, delay, viewport }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const width =
    viewport === "mobile"
      ? pos.w * 1.25
      : viewport === "tablet"
        ? pos.w
        : pos.w * 1.25;
  return (
    <motion.div
      ref={ref}
      className="absolute overflow-hidden"
      style={{ top: pos.top, left: pos.left, right: pos.right, width }}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="block w-full h-auto p-2 border border-brand-black"
      />
    </motion.div>
  );
}

export default function Home({ home, work = [] }) {
  const viewport = useViewport();
  const brandName = home?.brandName || HOME_DEFAULTS.brandName;
  const brandDescription = home?.description || HOME_DEFAULTS.description;

  const positions = useMemo(() => {
    if (viewport === "mobile") return MOBILE_POSITIONS;
    if (viewport === "tablet") return TABLET_POSITIONS;
    return DESKTOP_POSITIONS;
  }, [viewport]);

  useEffect(() => {
    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, []);

  const allImages = useMemo(
    () =>
      work.flatMap((item) =>
        Array.isArray(item.image)
          ? item.image.map((img) => ({
              _id: item._id,
              title: item.title,
              slug: item.slug,
              image: img,
            }))
          : [],
      ),
    [work],
  );
  const seoImageUrl = home?.seo?.image
    ? urlFor(home.seo.image).width(1200).height(630).format("webp").url()
    : allImages[0]?.image
      ? urlFor(allImages[0].image).width(1200).height(630).format("webp").url()
      : undefined;

  if (!allImages.length) {
    return (
      <>
        <Metadata
          title={home?.seo?.title || HOME_DEFAULTS.seoTitle}
          description={home?.seo?.description || brandDescription}
          keywords={home?.seo?.keywords || HOME_DEFAULTS.seoKeywords}
          canonicalLink="/"
          imageUrl={seoImageUrl}
          imageAlt={brandName}
        />
        <main className="bg-brand-white relative min-h-screen flex items-center justify-center p-5">
          <Navbar />
          <p className="text-sm uppercase tracking-[0.3em] opacity-70">
            No images found.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Metadata
        title={home?.seo?.title || HOME_DEFAULTS.seoTitle}
        description={home?.seo?.description || brandDescription}
        keywords={home?.seo?.keywords || HOME_DEFAULTS.seoKeywords}
        canonicalLink="/"
        imageUrl={seoImageUrl}
        imageAlt={brandName}
      />
      <Navbar />
      <motion.div
        className="fixed bottom-4 md:bottom-8 left-4 md:left-8 z-10 pointer-events-none max-w-[90vw] md:max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <h1 className="text-[48px] md:text-[96px] font-title font-semibold tracking-tight text-brand-black leading-none">
          {brandName}
        </h1>
        <p className="mt-2 text-[16px] md:text-[24px] font-body text-brand-black whitespace-pre-line">
          {brandDescription}
        </p>
      </motion.div>

      <main className="bg-brand-white relative min-h-[250vh] md:min-h-[320vh] overflow-hidden">
        {positions.map((pos, i) => {
          const img = allImages[(i + 1) % allImages.length] || allImages[0];
          return (
            <ScatterImage
              key={i}
              pos={pos}
              src={urlFor(img.image).height(800).format("webp").url()}
              alt={img.title || ""}
              delay={(i % 6) * 0.08}
              viewport={viewport}
            />
          );
        })}
        <div className="p-5"></div>
      </main>
    </>
  );
}

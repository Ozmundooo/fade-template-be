"use client";
import Image from "next/image";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";

import client, { urlFor } from "@/utils/sanity/client";
import Link from "next/link";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Navbar from "@/components/Navbar";
import Metadata from "@/components/Metadata";

const GALLERY_DEFAULTS = {
  pageTitle: "GALLERY",
  description: "Browse a curated selection of photography and creative work.",
  seoTitle: "Gallery | bish.",
  seoKeywords: ["gallery", "photography", "creative direction", "bish"],
};

function ImageItem({
  image,
  title,
  slug,
  index,
  scrollContainerRef,
  onInView,
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef,
    offset: ["start end", "end start"],
  });

  // Opacity peaks at 1 when image is centered in viewport, fades when away
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [0.5, 0.8, 1, 0.8, 0.5],
  );

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.7]);

  const smoothOpacity = useSpring(opacity, {
    stiffness: 120,
    damping: 25,
    mass: 0.3,
  });

  // Track when this image is centered
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v > 0.4 && v < 0.6) {
        onInView(index);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, index, onInView]);

  return (
    <div ref={ref} className="snap-center flex items-center justify-center">
      <div className=" gap-4 w-full max-w-70 lg:max-w-5xl">
        <Link href={`/gallery/${slug}`}>
          <motion.div
            className="my-4 cursor-pointer  "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ opacity: smoothOpacity, scale }}
            transition={{
              opacity: {
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1],
                delay: index * 0.01,
              },
            }}
          >
            <Image
              src={urlFor(image).width(700).format("webp").url()}
              alt={title}
              width={700}
              height={700}
              className="h-full object-contain w-full col-span-2 p-2 border border-brand-black  "
            />
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const [gallery, work] = await Promise.all([
    client.fetch(
      `*[_type == "gallery" && _id == "gallery"][0]{
        pageTitle,
        description,
        seo
      }`,
    ),
    client.fetch(
      `*[_type == "work"] | order(publishedAt desc, _createdAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        image
      }`,
    ),
  ]);

  return {
    props: {
      gallery: gallery || null,
      work,
    },
    revalidate: 360,
  };
}

export default function GalleryPage({ gallery, work = [] }) {
  const [containerEl, setContainerEl] = useState(null);
  const containerRef = useMemo(() => ({ current: containerEl }), [containerEl]);
  const [activeIndex, setActiveIndex] = useState(0);
  const pageTitle = gallery?.pageTitle || GALLERY_DEFAULTS.pageTitle;

  const visibleWork = useMemo(
    () =>
      work.filter(
        (item) =>
          item.slug?.current &&
          Array.isArray(item.image) &&
          item.image.length > 0,
      ),
    [work],
  );

  const handleInView = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const total = visibleWork.length;
  const safeActiveIndex = total ? Math.min(activeIndex, total - 1) : 0;
  const currentWork = visibleWork[safeActiveIndex] || null;
  const currentTitle = currentWork?.title || "";
  const currentYear = currentWork?.publishedAt
    ? new Date(currentWork.publishedAt).getFullYear()
    : "";
  const seoImageUrl = gallery?.seo?.image
    ? urlFor(gallery.seo.image).width(1200).height(630).format("webp").url()
    : currentWork?.image?.[0]
      ? urlFor(currentWork.image[0])
          .width(1200)
          .height(630)
          .format("webp")
          .url()
      : undefined;

  return (
    <>
      <Metadata
        title={gallery?.seo?.title || GALLERY_DEFAULTS.seoTitle}
        description={
          gallery?.seo?.description ||
          gallery?.description ||
          GALLERY_DEFAULTS.description
        }
        keywords={gallery?.seo?.keywords || GALLERY_DEFAULTS.seoKeywords}
        canonicalLink="/gallery"
        imageUrl={seoImageUrl}
        imageAlt={gallery?.seo?.image?.alt || pageTitle}
      />
      <motion.main
        ref={setContainerEl}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="bg-brand-white relative h-screen px-8 pt-14 overflow-y-auto snap-y snap-mandatory"
      >
        <Navbar activePage="work" />
        {total ? (
          <div className="max-w-sm mx-auto ">
            <div className="snap-center flex items-center justify-center h-[30vh] lg:h-[20vh] pointer-events-none" />
            {containerEl &&
              visibleWork.map((item, index) => (
                <ImageItem
                  key={`${item._id}-${index}`}
                  image={item.image[0]}
                  title={item.title}
                  slug={item.slug.current}
                  index={index}
                  scrollContainerRef={containerRef}
                  onInView={handleInView}
                />
              ))}
            <div className="snap-center flex items-center justify-center h-[30vh] lg:h-[20vh] pointer-events-none" />
          </div>
        ) : (
          <div className="flex h-[80vh] items-center justify-center">
            <p className="text-sm uppercase tracking-[0.3em] opacity-70">
              No gallery work yet.
            </p>
          </div>
        )}

        <div className="fixed lg:bg-transparent lg:p-0 lowercase bottom-5 left-5 text-right z-50 pointer-events-none">
          <div className="text-sm mb-2 font-body text-brand-black ">
            {String(total ? safeActiveIndex + 1 : 0).padStart(2, "0")} of{" "}
            {String(total).padStart(2, "0")}
          </div>
          <h1 className="text-[48px] md:text-[96px] font-title font-semibold tracking-tight uppercase text-brand-black leading-none">
            {pageTitle}
          </h1>
        </div>

        <div className="hidden fixed right-40 top-1/2 -translate-y-1/2 w-72 lg:flex flex-col justify-between lg:bg-transparent lg:p-0 lowercase z-50 pointer-events-none h-24">
          <div className="overflow-hidden h-12 mt-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTitle}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-2xl font-semibold font-title text-brand-black whitespace-nowrap"
              >
                {currentTitle}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="overflow-hidden h-6 mt-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentYear}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-xl font-semibold font-body text-brand-black"
              >
                {currentYear}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.main>
    </>
  );
}

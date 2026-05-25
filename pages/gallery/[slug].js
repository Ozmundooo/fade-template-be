"use client";
import Image from "next/image";
import { useState } from "react";
import client, { urlFor } from "@/utils/sanity/client";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Metadata from "@/components/Metadata";

export async function getStaticPaths() {
  const works = await client.fetch(`*[_type == "work"] { slug }`);
  const paths = works
    .filter((w) => w.slug?.current)
    .map((w) => ({ params: { slug: w.slug.current } }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const work = await client.fetch(
    `*[_type == "work" && slug.current == $slug][0] {
      _id,
      title,
      image,
      slug,
      publishedAt,
      description,
      seo,
    }`,
    { slug: params.slug },
  );

  if (!work) {
    return { notFound: true };
  }

  return {
    props: { work },
    revalidate: 360,
  };
}

export default function WorkDetail({ work }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const seoTitle = work.seo?.title || `${work.title} | bish.`;
  const seoDescription =
    work.seo?.description ||
    work.description ||
    `Explore \"${work.title}\", a captivating work by bish Uprety.`;
  const seoImageUrl = work.seo?.image
    ? urlFor(work.seo.image).width(1200).height(630).format("webp").url()
    : work.image?.[0]
      ? urlFor(work.image[0]).width(1200).height(630).format("webp").url()
      : undefined;

  const currentYear = work.publishedAt
    ? new Date(work.publishedAt).getFullYear()
    : null;

  return (
    <>
      <Metadata
        title={seoTitle}
        description={seoDescription}
        canonicalLink={`/gallery/${work.slug.current}`}
        imageUrl={seoImageUrl}
        imageAlt={work.seo?.image?.alt || work.title}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="bg-brand-white relative h-screen pt-10 overflow-hidden"
      >
        <Navbar activePage="work" />

        <div className="md:hidden flex flex-col h-[calc(100vh-2.5rem)] pt-5">
          <div className="relative h-[90%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={urlFor(work.image[activeIndex])
                    .width(1200)
                    .quality(85)
                    .format("webp")
                    .url()}
                  alt={`${work.title} - ${activeIndex + 1}`}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <div className="px-5 absolute bottom-0 left-0 right-0 flex flex-row gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent py-5">
              {work.image?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`shrink-0 transition-opacity duration-300 ${
                    i === activeIndex
                      ? "opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={urlFor(img)
                      .width(200)
                      .quality(70)
                      .format("webp")
                      .url()}
                    alt={`${work.title} - ${i + 1}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="h-[10%] px-4 flex flex-col justify-center lowercase overflow-hidden">
            <div className="flex items-baseline gap-4 mb-1">
              <h1 className="text-2xl font-semibold font-title text-brand-black">
                {work.title}
              </h1>
              {currentYear && (
                <span className="text-xl font-body text-brand-black">
                  {currentYear}
                </span>
              )}
            </div>
            {work.description && (
              <p className="text-sm font-body text-brand-black leading-snug line-clamp-2">
                {work.description}
              </p>
            )}
          </div>
        </div>

        <section className="hidden md:grid grid-cols-4 gap-8  mx-auto w-screen h-full mt-10">
          <div className="flex flex-col">
            {/* <h1 className="text-2xl font-semibold font-title text-brand-black">
              {work.title}
            </h1>
            {currentYear && (
              <span className="text-xl font-body text-brand-black">
                {currentYear}
              </span>
            )} */}
          </div>

          <div className="flex-1 col-span-2 overflow-hidden flex items-start  h-[85vh] p-4 border border-brand-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="h-full flex items-start justify-center"
              >
                <Image
                  src={urlFor(work.image[activeIndex])
                    .width(1200)
                    .quality(85)
                    .format("webp")
                    .url()}
                  alt={`${work.title} - ${activeIndex + 1}`}
                  width={1200}
                  height={900}
                  priority
                  className="object-contain my-auto max-h-full "
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-36 lg:w-48 pb-10  flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-full scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
            {work.image?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 transition-opacity duration-300 cursor-pointer p-2 border-brand-black border ${
                  i === activeIndex
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <Image
                  src={urlFor(img).width(300).quality(70).format("webp").url()}
                  alt={`${work.title} - ${i + 1}`}
                  width={300}
                  height={300}
                  className="w-full object-cover"
                />
              </button>
            ))}
          </div>
        </section>
      </motion.main>
    </>
  );
}

"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Metadata from "@/components/Metadata";
import client, { urlFor } from "@/utils/sanity/client";
import Navbar from "@/components/Navbar";
import BishOne from "@/assets/bishOne.png";
import BishTwo from "@/assets/bishTwo.png";

const ABOUT_DEFAULTS = {
  pageTitle: "ABOUT",
  biography:
    "bish Uprety is a creative director and photographer based in Toronto. Being an immigrant and having a different perspective on the everyday, he has cultivated his own sense of style through his art. bish has always had a keen sense for authenticity and makes his subjects feel comfortable enough to be themselves in front of the camera. bish has also delved into deeper and more introspective topics through his personal work. he’s not afraid to share his emotions to the world.",
  seoTitle: "About | bish.",
  seoKeywords: ["about", "bish uprety", "creative director", "photographer"],
  socialLinks: [
    { label: "Social Link 1", url: "#" },
    { label: "Social Link 2", url: "#" },
    { label: "Social Link 3", url: "#" },
  ],
};

function isExternalLink(url = "") {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

export async function getStaticProps() {
  const [about, settings] = await Promise.all([
    client.fetch(
      `*[_type == "about" && _id == "about"][0]{
        pageTitle,
        biography,
        featureImage,
        portraitImage,
        socialLinks,
        seo
      }`,
    ),
    client.fetch(`*[_type == "settings" && _id == "settings"][0]{ ... }`),
  ]);

  return {
    props: { about: about || null, settings: settings || null },
    revalidate: 360,
  };
}

export default function About({ about, settings }) {
  const pageTitle = about?.pageTitle || ABOUT_DEFAULTS.pageTitle;
  const biography = about?.biography || ABOUT_DEFAULTS.biography;
  const socialLinks = about?.socialLinks?.length
    ? about.socialLinks
    : ABOUT_DEFAULTS.socialLinks;
  const featureImageSrc = about?.featureImage
    ? urlFor(about.featureImage).width(480).height(640).format("webp").url()
    : BishOne;
  const portraitImageSrc = about?.portraitImage
    ? urlFor(about.portraitImage).width(960).height(1280).format("webp").url()
    : BishTwo;
  const seoImageUrl = about?.seo?.image
    ? urlFor(about.seo.image).width(1200).height(630).format("webp").url()
    : undefined;

  return (
    <>
      <Metadata
        title={about?.seo?.title || ABOUT_DEFAULTS.seoTitle}
        description={about?.seo?.description || biography}
        keywords={about?.seo?.keywords || ABOUT_DEFAULTS.seoKeywords}
        canonicalLink="/about"
        imageUrl={seoImageUrl}
        imageAlt={about?.seo?.image?.alt || pageTitle}
      />
      <Navbar settings={settings} />
      <div className="grid lg:grid-cols-2 gap-8 h-screen  mx-4 md:mx-8">
        <div className="flex flex-col justify-between h-screen">
          <div className=" flex flex-col justify-between h-full pt-20 md:pt-20">
            <p className="font-body tracking-tight">{biography}</p>
            <div className=" p-2 border border-brand-black w-fit mx-auto lg:mx-0">
              <Image
                src={featureImageSrc}
                alt={about?.featureImage?.alt || "bish one"}
                width={480}
                height={640}
                className="w-60 mx-auto lg:mx-0 h-auto "
              />
            </div>
            <div className="flex gap-8 font-body tracking-tight  ">
              {socialLinks.map((link) => {
                const external = isExternalLink(link.url);

                return (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
          <motion.div className=" mb-4 md:mb-8 ml-4 md:ml-8 pt-12">
            <h1 className="text-[48px] md:text-[96px] font-title font-semibold tracking-tight text-brand-black leading-none">
              {pageTitle}
            </h1>
          </motion.div>
        </div>
        <div className="hidden lg:block justify-start pt-20 md:pt-20">
          <Image
            src={portraitImageSrc}
            alt={about?.portraitImage?.alt || "bish two"}
            width={960}
            height={1280}
            className="h-auto ml-auto w-auto object-contain "
          />
        </div>
      </div>
    </>
  );
}

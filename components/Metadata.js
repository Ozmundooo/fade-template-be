import React from "react";
import Head from "next/head";

const DEFAULT_TITLE = "bish.";
const DEFAULT_DESCRIPTION =
  "bish is a creative director and photographer based in Toronto.";
const DEFAULT_IMAGE = "/ogimage.png";
const DEFAULT_SITE_URL = "https://www.dearbish.com";
const DEFAULT_KEYWORDS = [
  "photography",
  "creative direction",
  "portrait photography",
  "editorial photography",
  "Toronto photographer",
  "bish uprety",
  "bish",
  "dear bish",
];

function resolveUrl(path = "/") {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_SITE_URL;
  return new URL(path, baseUrl).toString();
}

function resolveKeywords(keywords) {
  if (Array.isArray(keywords)) {
    return keywords.join(", ");
  }

  return keywords || DEFAULT_KEYWORDS.join(", ");
}

export default function Metadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonicalLink = "/",
  imageUrl,
  imageAlt = DEFAULT_TITLE,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "bish",
  noIndex = false,
}) {
  const canonicalUrl = resolveUrl(canonicalLink);
  const resolvedImageUrl = imageUrl
    ? resolveUrl(imageUrl)
    : resolveUrl(DEFAULT_IMAGE);
  const robotsContent = noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const twitterCard = imageUrl ? "summary_large_image" : "summary";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={resolveKeywords(keywords)} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="language" content="English" />
      <meta name="author" content={author} />
      <meta charSet="utf-8" />

      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="canonical" href={canonicalUrl} />

      <meta itemProp="name" content={title} />
      <meta itemProp="url" content={canonicalUrl} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={resolvedImageUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="bish" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={resolvedImageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {author && <meta property="article:author" content={author} />}

      <meta name="twitter:site" content="bish." />
      <meta name="twitter:creator" content={author} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImageUrl} />
    </Head>
  );
}

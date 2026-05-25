import { createClient } from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-06-01",
  useCdn: process.env.NODE_ENV === "production",
};

const client = createClient(config);

export default client;
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: "data", // json files
  schema: z.object({
    code: z.string(),
    context: z.string(),
    gate: z.string(),
    status: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    github: z.string().optional(),
    live: z.string().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
};

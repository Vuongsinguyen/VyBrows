import { defineCollection, z } from "astro:content";

export const collections = {
  projects: defineCollection({
    type: "content", // hoặc 'data' nếu dùng kiểu data
    schema: z.object({
      name: z.string(),
      category: z.string(),
      image1: z.string(),
      image2: z.string(),
      desc: z.string(),
      techs: z.array(z.string()),
      // Thêm các trường khác nếu cần
    }),
  }),
  services: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      lang: z.string(),
      slug: z.string().optional(),
      order: z.number(),
      description: z.string(),
      "full-description": z.string().optional(),
      image: z.string(),
    }),
  }),
};
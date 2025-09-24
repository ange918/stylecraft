import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  image: z.string(),
  category: z.enum(['mens', 'womens', 'kids', 'accessories']),
  sale: z.boolean().default(false),
  description: z.string().optional(),
  sizes: z.array(z.string()).default(['XS', 'S', 'M', 'L', 'XL']),
  colors: z.array(z.string()).default(['Black', 'White', 'Navy']),
  inStock: z.boolean().default(true)
});

export const cartItemSchema = z.object({
  id: z.number(),
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  size: z.string(),
  color: z.string().optional(),
  image: z.string()
});

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;

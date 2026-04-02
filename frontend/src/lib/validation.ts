/**
 * Validation schemas using Zod
 * Define all form validation rules here
 */
import { z } from "zod";

// Checkout Form Schema
export const checkoutFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .refine((val) => /^[6-9]/.test(val), "Phone must start with 6, 7, 8, or 9"),
  
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be less than 100 characters"),
  
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Product Creation Schema
export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be less than 100 characters"),
  
  category: z.enum(["pickles", "powders", "snacks", "special"], {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  
  price_per_kg: z
    .number()
    .positive("Price must be positive")
    .max(10000, "Price seems too high"),
  
  image: z
    .string()
    .url("Image must be a valid URL")
    .startsWith("http", "Image URL must be HTTP or HTTPS"),
  
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  
  isAvailable: z.boolean().default(true),
  isBestSeller: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Admin Login Schema
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email"),
  
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// Order Item Schema
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  weight: z.enum(["250g", "500g", "1kg"], {
    errorMap: () => ({ message: "Invalid weight option" }),
  }),
  quantity: z
    .number()
    .positive("Quantity must be positive")
    .int("Quantity must be a whole number"),
});

export type OrderItemData = z.infer<typeof orderItemSchema>;

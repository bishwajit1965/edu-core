import { z } from "zod";

const institutionSchema = z.object({
  name: z.string().trim().min(1).max(200),
  institutionType: z.enum(["SCHOOL", "COLLEGE", "SCHOOL_AND_COLLEGE"]),
  eiin: z.string().trim().optional(),
  code: z.string().trim().min(1),
  establishedYear: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  address: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().trim().email(),
  website: z.string().trim().optional(),
  mpoCode: z.string().trim().optional(),
  nuCode: z.string().trim().optional(),
});

const brandingSchema = z.object({
  logo: z.string().trim().optional(),
  favicon: z.string().trim().optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

const contactSchema = z.object({
  phone: z.string().trim().optional(),
  email: z.string().trim().email().or(z.literal("")).optional(),
  address: z.string().trim().optional(),
  mapUrl: z.string().trim().optional(),
});

const socialSchema = z.object({
  facebook: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
});

const seoSchema = z.object({
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(500).optional(),
  keywords: z.array(z.string().trim()).optional(),
});

const featuresSchema = z.object({
  admissions: z.boolean().optional(),
  notices: z.boolean().optional(),
  events: z.boolean().optional(),
  literaryCorner: z.boolean().optional(),
  studentPortal: z.boolean().optional(),
  guardianPortal: z.boolean().optional(),
});

const systemSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  registrationEnabled: z.boolean().optional(),
  timezone: z.string().trim().min(1).optional(),
  language: z.string().trim().min(2).optional(),
});

const websiteSchema = z.object({
  theme: z.enum([
    "classic-traditional",
    "academic-editorial",
    "premium-minimal",
    "modern-professional",
    "vibrant-friendly",
  ]),
});

const leadershipMessageSchema = z.object({
  role: z.enum(["GB_CHAIRMAN", "PRINCIPAL", "VICE_PRINCIPAL"]),
  name: z.string().trim().min(1).max(200),
  qualification: z.string().trim().min(1).max(200),
  designation: z.string().trim().optional(),
  photo: z.string().trim().optional(),
  message: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

const leadershipMessagesSchema = z.object({
  enabled: z.boolean().optional(),
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  leaders: z.array(leadershipMessageSchema).optional(),
});

export const createInstitutionSettingsValidationSchema = z.object({
  body: z.object({
    institution: institutionSchema,
    branding: brandingSchema.optional(),
    contact: contactSchema.optional(),
    social: socialSchema.optional(),
    seo: seoSchema.optional(),
    features: featuresSchema.optional(),
    system: systemSchema.optional(),
    website: websiteSchema.partial().optional(),
    leadershipMessages: leadershipMessagesSchema.optional(),
  }),
});

export const updateInstitutionSettingsValidationSchema = z.object({
  body: z
    .object({
      institution: institutionSchema.partial().optional(),
      branding: brandingSchema.partial().optional(),
      contact: contactSchema.partial().optional(),
      social: socialSchema.partial().optional(),
      seo: seoSchema.partial().optional(),
      features: featuresSchema.partial().optional(),
      system: systemSchema.partial().optional(),
      website: websiteSchema.partial().optional(),
      leadershipMessages: leadershipMessagesSchema.partial().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one settings section must be provided.",
    }),
});

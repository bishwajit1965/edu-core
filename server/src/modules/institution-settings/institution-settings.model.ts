import { Schema, model } from "mongoose";

import {
  IInstitutionSettings,
  InstitutionSettingsModel,
} from "./institution-settings.interface.js";

const institutionSettingsSchema = new Schema<
  IInstitutionSettings,
  InstitutionSettingsModel
>(
  {
    institution: {
      name: { type: String, required: true, trim: true },
      institutionType: { type: String, required: true, trim: true },
      eiin: { type: String, required: true, default: "" },
      code: { type: String, required: true, trim: true },
      establishedYear: { type: Number, min: 1800 },
      address: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      website: { type: String, trim: true, default: "" },
      mpoCode: { type: String, trim: true, default: "" },
      nuCode: { type: String, trim: true, default: "" },
    },

    branding: {
      logo: { type: String, default: "" },
      favicon: { type: String, default: "" },
      primaryColor: { type: String, default: "#2563eb" },
    },
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      mapUrl: { type: String, default: "" },
    },
    social: {
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },

    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: { type: [String], default: [] },
    },
    features: {
      admissions: { type: Boolean, default: true },
      notices: { type: Boolean, default: true },
      events: { type: Boolean, default: true },
      literaryCorner: { type: Boolean, default: true },
      studentPortal: { type: Boolean, default: false },
      guardianPortal: { type: Boolean, default: false },
    },

    system: {
      maintenanceMode: { type: Boolean, default: false },
      registrationEnabled: { type: Boolean, default: true },
      timezone: { type: String, default: "Asia/Dhaka" },
      language: { type: String, default: "bn" },
    },
  },
  { timestamps: true },
);

export const InstitutionSettings = model<
  IInstitutionSettings,
  InstitutionSettingsModel
>("InstitutionSettings", institutionSettingsSchema);

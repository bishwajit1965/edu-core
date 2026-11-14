import { useEffect, useId, useMemo, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";

import { useApiMutation } from "../../../hooks/theme/useApiMutation.js";

import {
  THEME_HEADER_LAYOUT,
  THEME_HERO_LAYOUT,
  THEME_FOOTER_LAYOUT,
  THEME_SECTION_KEYS,
  type ThemeConfigInput,
  type CreateThemePayload,
  type Theme,
} from "../../../features/theme/themeApi.js";

import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import Checkbox from "../../../components/ui/Checkbox";
import Button from "../../../components/ui/Button";
import { LucideIcon } from "../../../components/ui/LucideIcons.js";
import { showError } from "../../../utils/alert.js";

// One file is reserved for the required theme preview.
const MAX_SLIDES = 9;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ThemeFormProps {
  onCancel?: () => void;
  theme?: Theme; // Use your existing Theme type
}

interface SlideDraft {
  title: string;
  subtitle: string;
  description: string;
  alt: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  order: number;
  isActive: boolean;
  imageFile: File | null;
  imageUrl?: string;
}

const createEmptySlide = (index: number): SlideDraft => ({
  title: "",
  subtitle: "",
  description: "",
  alt: `Slider image ${index + 1}`,
  primaryButtonText: "",
  primaryButtonLink: "",
  secondaryButtonText: "",
  secondaryButtonLink: "",
  order: index + 1,
  isActive: true,
  imageFile: null,
});

const defaultThemeConfig: ThemeConfigInput = {
  colors: {
    primary: "#1D4ED8",
    secondary: "#0F172A",
    accent: "#F59E0B",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    text: "#1E293B",
    muted: "#64748B",
  },

  typography: {
    headingFont: "Poppins",
    bodyFont: "Inter",
  },

  layout: {
    maxWidth: "1280px",

    header: {
      layout: THEME_HEADER_LAYOUT.CLASSIC,
      sticky: true,
      showTopBar: true,
      showLogo: true,
      showInstitutionName: true,
    },

    hero: {
      layout: THEME_HERO_LAYOUT.SLIDER,
      showHero: true,
      showSubtitle: true,
      showPrimaryButton: true,
      showSecondaryButton: true,
    },

    slider: {
      enabled: true,
      autoplay: true,
      interval: 5000,
      slides: [],
    },

    sections: [
      {
        key: THEME_SECTION_KEYS.ABOUT,
        title: "About Us",
        enabled: true,
        layout: "default",
        order: 1,
      },
      {
        key: THEME_SECTION_KEYS.NOTICES,
        title: "Notices",
        enabled: true,
        layout: "default",
        order: 2,
      },
      {
        key: THEME_SECTION_KEYS.ACADEMIC,
        title: "Academic",
        enabled: true,
        layout: "default",
        order: 3,
      },
      {
        key: THEME_SECTION_KEYS.EVENTS,
        title: "Events",
        enabled: true,
        layout: "default",
        order: 4,
      },
      {
        key: THEME_SECTION_KEYS.TEACHERS,
        title: "Teachers",
        enabled: true,
        layout: "default",
        order: 5,
      },
      {
        key: THEME_SECTION_KEYS.GALLERY,
        title: "Gallery",
        enabled: true,
        layout: "default",
        order: 6,
      },
      {
        key: THEME_SECTION_KEYS.CONTACT,
        title: "Contact",
        enabled: true,
        layout: "default",
        order: 7,
      },
    ],

    footer: {
      layout: THEME_FOOTER_LAYOUT.COLUMNS,
      showLogo: true,
      showSocialLinks: true,
      showContactInfo: true,
      showQuickLinks: true,
    },
  },
};

// ------------------------------------
// Image dropzone
// ------------------------------------

interface ImageDropzoneProps {
  label: string;
  file: File | null;
  imageUrl?: string;
  onChange: (file: File | null) => void;
  required?: boolean;
}

const ImageDropzone = ({
  label,
  file,
  imageUrl,
  onChange,
  required = false,
}: ImageDropzoneProps) => {
  const inputId = useId();

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!file) return "";

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFile = (selectedFile?: File) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Image size must not exceed 5 MB.");
      return;
    }

    setError("");
    onChange(selectedFile);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(inputId)?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-5 text-center transition ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-base-300 hover:border-primary"
        }`}
      >
        {previewUrl || imageUrl ? (
          <img
            src={previewUrl || imageUrl}
            alt={label}
            className="mx-auto max-h-48 max-w-full rounded-md object-contain"
          />
        ) : (
          <div className="space-y-2 py-5">
            <p className="text-3xl" aria-hidden="true">
              📷
            </p>

            <p className="text-sm font-medium">Drag and drop an image here</p>

            <p className="text-xs text-base-content/60">
              Or click to browse · Maximum 5 MB
            </p>
          </div>
        )}

        {file && (
          <p className="mt-3 break-all text-xs text-base-content/70">
            {file.name}
          </p>
        )}

        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {error && <p className="text-xs text-error">{error}</p>}

      {file && (
        <Button
          type="button"
          onClick={() => {
            onChange(null);
            setError("");
          }}
        >
          Remove image
        </Button>
      )}
    </div>
  );
};

// ------------------------------------
// Theme form
// ------------------------------------

const ThemeForm = ({ onCancel, theme }: ThemeFormProps) => {
  const themeApiMutation = useApiMutation({
    method: theme ? "update" : "create",
    key: ["themes", "admin"],
  });
  console.log("Theme mutation method:", theme ? "update" : "create");
  const [name, setName] = useState(theme?.name ?? "");
  const [slug, setSlug] = useState(theme?.slug ?? "");
  const [description, setDescription] = useState(theme?.description ?? "");
  const [isActive, setIsActive] = useState(theme?.isActive ?? true);

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [config, setConfig] = useState<ThemeConfigInput>(
    theme?.config ?? defaultThemeConfig,
  );
  const [slides, setSlides] = useState<SlideDraft[]>(
    theme?.config.layout.slider.slides?.map((slide) => ({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description ?? "",
      alt: slide.image.alt ?? "",
      primaryButtonText: slide.primaryButtonText ?? "",
      primaryButtonLink: slide.primaryButtonLink ?? "",
      secondaryButtonText: slide.secondaryButtonText ?? "",
      secondaryButtonLink: slide.secondaryButtonLink ?? "",
      order: slide.order,
      isActive: slide.isActive,
      imageFile: null,
      imageUrl: slide.image.url,
    })) ?? [],
  );
  const [validationError, setValidationError] = useState("");

  // ----------------------------------
  // Updates
  // ----------------------------------

  const updateColor = (
    key: keyof ThemeConfigInput["colors"],
    value: string,
  ) => {
    setConfig((previous) => ({
      ...previous,
      colors: {
        ...previous.colors,
        [key]: value,
      },
    }));
  };

  const updateSlide = (
    index: number,
    field: keyof SlideDraft,
    value: string | boolean | File | null,
  ) => {
    setSlides((previous) =>
      previous.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, [field]: value } : slide,
      ),
    );
  };

  const addSlide = () => {
    if (slides.length >= MAX_SLIDES) return;

    setSlides((previous) => [...previous, createEmptySlide(previous.length)]);
  };

  const removeSlide = (index: number) => {
    setSlides((previous) =>
      previous
        .filter((_, slideIndex) => slideIndex !== index)
        .map((slide, slideIndex) => ({
          ...slide,
          order: slideIndex + 1,
        })),
    );
  };

  const updateSection = (
    index: number,
    field: "title" | "enabled" | "order",
    value: string | boolean | number,
  ) => {
    setConfig((previous) => ({
      ...previous,
      layout: {
        ...previous.layout,
        sections: previous.layout.sections.map((section, sectionIndex) =>
          sectionIndex === index ? { ...section, [field]: value } : section,
        ),
      },
    }));
  };

  const handleNameChange = (value: string) => {
    setName(value);

    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    );
  };

  // ----------------------------------
  // Submit
  // ----------------------------------

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit fired");
    event.preventDefault();
    setValidationError("");

    if (!previewFile && !theme?.preview?.url) {
      setValidationError("Please select a theme preview image.");
      return;
    }

    if (!name.trim() || !slug.trim()) {
      setValidationError("Theme name and slug are required.");
      return;
    }

    if (config.layout.slider.enabled && slides.length === 0) {
      setValidationError("Please add at least one slider slide.");
      return;
    }

    if (slides.some((slide) => !slide.imageFile && !slide.imageUrl)) {
      setValidationError(
        "Please upload an image for every configured slider slide.",
      );
      return;
    }
    console.log("All validation passed");
    const sliderSlides = slides.map((slide, index) => ({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description || undefined,
      image: {
        alt:
          slide.alt.trim() || slide.title.trim() || `Slider image ${index + 1}`,
      },
      primaryButtonText: slide.primaryButtonText || undefined,
      primaryButtonLink: slide.primaryButtonLink || undefined,
      secondaryButtonText: slide.secondaryButtonText || undefined,
      secondaryButtonLink: slide.secondaryButtonLink || undefined,
      order: index + 1,
      isActive: slide.isActive,
    }));

    const finalConfig: ThemeConfigInput = {
      ...config,
      layout: {
        ...config.layout,
        slider: {
          ...config.layout.slider,
          slides: sliderSlides,
        },
      },
    };

    const payload: CreateThemePayload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      preview: theme?.preview ?? {},
      config: finalConfig,
      isActive,
    };

    // Keep file order aligned with slide order.
    const slideFiles = slides.map((slide) => slide.imageFile as File);

    try {
      await themeApiMutation.mutateAsync({
        id: theme?._id,
        payload,
        previewFile: previewFile ?? undefined,
        slideFiles,
      });

      onCancel?.();
    } catch (error) {
      console.error(error);
      showError("Error in updating theme!");
    }
  };

  const mutationError = themeApiMutation.error;

  // ----------------------------------
  // Render
  // ----------------------------------

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. BASIC INFORMATION */}

      <Card title="1. Basic Information">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Theme Name"
              name="name"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Modern & Professional"
              required
            />

            <Input
              label="Theme Slug"
              name="slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="modern-professional"
              required
            />
          </div>

          <Textarea
            label="Description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Describe this theme..."
          />

          <Checkbox
            label="Active Theme"
            description="Make this theme available for selection."
            name="isActive"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />

          <ImageDropzone
            label="Theme Preview Image"
            file={previewFile}
            imageUrl={theme?.preview?.url}
            onChange={setPreviewFile}
            required
          />
        </div>
      </Card>

      {/* 2. THEME APPEARANCE */}

      <Card title="2. Theme Appearance">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              Object.keys(config.colors) as Array<
                keyof ThemeConfigInput["colors"]
              >
            ).map((key) => (
              <div key={key} className="space-y-2">
                <Input
                  label={`${key.charAt(0).toUpperCase()}${key.slice(1)} Color`}
                  name={`${key}Color`}
                  type="color"
                  value={config.colors[key]}
                  onChange={(event) => updateColor(key, event.target.value)}
                />

                <Input
                  name={`${key}ColorHex`}
                  value={config.colors[key]}
                  onChange={(event) => updateColor(key, event.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Heading Font"
              name="headingFont"
              value={config.typography.headingFont}
              onChange={(event) =>
                setConfig((previous) => ({
                  ...previous,
                  typography: {
                    ...previous.typography,
                    headingFont: event.target.value,
                  },
                }))
              }
            />

            <Input
              label="Body Font"
              name="bodyFont"
              value={config.typography.bodyFont}
              onChange={(event) =>
                setConfig((previous) => ({
                  ...previous,
                  typography: {
                    ...previous.typography,
                    bodyFont: event.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      </Card>

      {/* 3. HEADER */}

      <Card title="3. Header Configuration">
        <div className="space-y-4">
          <Select
            label="Header Layout"
            name="headerLayout"
            value={config.layout.header.layout}
            onChange={(event) =>
              setConfig((previous) => ({
                ...previous,
                layout: {
                  ...previous.layout,
                  header: {
                    ...previous.layout.header,
                    layout: event.target
                      .value as typeof config.layout.header.layout,
                  },
                },
              }))
            }
            options={[
              { label: "Classic", value: THEME_HEADER_LAYOUT.CLASSIC },
              { label: "Centered", value: THEME_HEADER_LAYOUT.CENTERED },
              { label: "Split", value: THEME_HEADER_LAYOUT.SPLIT },
            ]}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["sticky", "Sticky Header"],
                ["showTopBar", "Show Top Bar"],
                ["showLogo", "Show Logo"],
                ["showInstitutionName", "Show Institution Name"],
              ] as const
            ).map(([key, label]) => (
              <Checkbox
                key={key}
                label={label}
                name={`header-${key}`}
                checked={config.layout.header[key]}
                onChange={(event) =>
                  setConfig((previous) => ({
                    ...previous,
                    layout: {
                      ...previous.layout,
                      header: {
                        ...previous.layout.header,
                        [key]: event.target.checked,
                      },
                    },
                  }))
                }
              />
            ))}
          </div>
        </div>
      </Card>

      {/* 4. HERO */}

      <Card title="4. Hero Configuration">
        <div className="space-y-4">
          <Select
            label="Hero Layout"
            name="heroLayout"
            value={config.layout.hero.layout}
            onChange={(event) =>
              setConfig((previous) => ({
                ...previous,
                layout: {
                  ...previous.layout,
                  hero: {
                    ...previous.layout.hero,
                    layout: event.target
                      .value as typeof config.layout.hero.layout,
                  },
                },
              }))
            }
            options={[
              { label: "Centered", value: THEME_HERO_LAYOUT.CENTERED },
              { label: "Left", value: THEME_HERO_LAYOUT.LEFT },
              { label: "Split", value: THEME_HERO_LAYOUT.SPLIT },
              { label: "Slider", value: THEME_HERO_LAYOUT.SLIDER },
            ]}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["showHero", "Show Hero"],
                ["showSubtitle", "Show Subtitle"],
                ["showPrimaryButton", "Show Primary Button"],
                ["showSecondaryButton", "Show Secondary Button"],
              ] as const
            ).map(([key, label]) => (
              <Checkbox
                key={key}
                label={label}
                name={`hero-${key}`}
                checked={config.layout.hero[key]}
                onChange={(event) =>
                  setConfig((previous) => ({
                    ...previous,
                    layout: {
                      ...previous.layout,
                      hero: {
                        ...previous.layout.hero,
                        [key]: event.target.checked,
                      },
                    },
                  }))
                }
              />
            ))}
          </div>

          <p className="text-xs text-base-content/60">
            Hero background image upload is not included because the current
            backend does not support a hero image field.
          </p>
        </div>
      </Card>

      {/* 5. SLIDER */}

      <Card title="5. Slider Configuration">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-base-content/60">
              Configure the homepage slider and its images.
            </p>

            <Button
              type="button"
              onClick={addSlide}
              disabled={slides.length >= MAX_SLIDES}
            >
              + Add Slide
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Checkbox
              label="Enable Slider"
              name="sliderEnabled"
              checked={config.layout.slider.enabled}
              onChange={(event) =>
                setConfig((previous) => ({
                  ...previous,
                  layout: {
                    ...previous.layout,
                    slider: {
                      ...previous.layout.slider,
                      enabled: event.target.checked,
                    },
                  },
                }))
              }
            />

            <Checkbox
              label="Autoplay"
              name="sliderAutoplay"
              checked={config.layout.slider.autoplay}
              onChange={(event) =>
                setConfig((previous) => ({
                  ...previous,
                  layout: {
                    ...previous.layout,
                    slider: {
                      ...previous.layout.slider,
                      autoplay: event.target.checked,
                    },
                  },
                }))
              }
            />
          </div>

          <Input
            label="Slider Interval (milliseconds)"
            name="sliderInterval"
            type="number"
            min={1000}
            value={config.layout.slider.interval}
            onChange={(event) =>
              setConfig((previous) => ({
                ...previous,
                layout: {
                  ...previous.layout,
                  slider: {
                    ...previous.layout.slider,
                    interval: Math.max(
                      1000,
                      Number(event.target.value) || 1000,
                    ),
                  },
                },
              }))
            }
          />

          <p className="text-xs text-base-content/60">
            {slides.length} / {MAX_SLIDES} slides added. Each configured slide
            requires an image.
          </p>

          {slides.map((slide, index) => (
            <Card key={index} title={`Slide ${index + 1}`}>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button type="button" onClick={() => removeSlide(index)}>
                    Remove Slide
                  </Button>
                </div>

                <ImageDropzone
                  label={`Slide ${index + 1} Image`}
                  file={slide.imageFile}
                  imageUrl={slide.imageUrl}
                  onChange={(file) => updateSlide(index, "imageFile", file)}
                  required
                />

                <Input
                  label="Image Alt Text"
                  name={`slide-${index}-alt`}
                  value={slide.alt}
                  onChange={(event) =>
                    updateSlide(index, "alt", event.target.value)
                  }
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Title"
                    name={`slide-${index}-title`}
                    value={slide.title}
                    onChange={(event) =>
                      updateSlide(index, "title", event.target.value)
                    }
                  />

                  <Input
                    label="Subtitle"
                    name={`slide-${index}-subtitle`}
                    value={slide.subtitle}
                    onChange={(event) =>
                      updateSlide(index, "subtitle", event.target.value)
                    }
                  />
                </div>

                <Textarea
                  label="Description"
                  name={`slide-${index}-description`}
                  rows={2}
                  value={slide.description}
                  onChange={(event) =>
                    updateSlide(index, "description", event.target.value)
                  }
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Primary Button Text"
                    name={`slide-${index}-primary-text`}
                    value={slide.primaryButtonText}
                    onChange={(event) =>
                      updateSlide(
                        index,
                        "primaryButtonText",
                        event.target.value,
                      )
                    }
                  />

                  <Input
                    label="Primary Button Link"
                    name={`slide-${index}-primary-link`}
                    value={slide.primaryButtonLink}
                    onChange={(event) =>
                      updateSlide(
                        index,
                        "primaryButtonLink",
                        event.target.value,
                      )
                    }
                  />

                  <Input
                    label="Secondary Button Text"
                    name={`slide-${index}-secondary-text`}
                    value={slide.secondaryButtonText}
                    onChange={(event) =>
                      updateSlide(
                        index,
                        "secondaryButtonText",
                        event.target.value,
                      )
                    }
                  />

                  <Input
                    label="Secondary Button Link"
                    name={`slide-${index}-secondary-link`}
                    value={slide.secondaryButtonLink}
                    onChange={(event) =>
                      updateSlide(
                        index,
                        "secondaryButtonLink",
                        event.target.value,
                      )
                    }
                  />
                </div>

                <Checkbox
                  label="Active Slide"
                  name={`slide-${index}-active`}
                  checked={slide.isActive}
                  onChange={(event) =>
                    updateSlide(index, "isActive", event.target.checked)
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* 6. LAYOUT */}

      <Card title="6. Layout Settings">
        <Input
          label="Maximum Content Width"
          name="maxWidth"
          value={config.layout.maxWidth}
          onChange={(event) =>
            setConfig((previous) => ({
              ...previous,
              layout: {
                ...previous.layout,
                maxWidth: event.target.value,
              },
            }))
          }
          placeholder="1280px"
        />
      </Card>

      {/* 7. HOMEPAGE SECTIONS */}

      <Card title="7. Homepage Sections">
        <div className="space-y-4">
          {config.layout.sections.map((section, index) => (
            <div
              key={section.key}
              className="grid items-center gap-3 border-b border-base-300 pb-4 md:grid-cols-3"
            >
              <div className="text-sm font-medium capitalize">
                {section.key}
              </div>

              <Input
                name={`section-${section.key}-title`}
                value={section.title}
                onChange={(event) =>
                  updateSection(index, "title", event.target.value)
                }
                placeholder="Section title"
              />

              <div className="flex items-center justify-between gap-3">
                <Checkbox
                  label="Enabled"
                  name={`section-${section.key}-enabled`}
                  checked={section.enabled}
                  onChange={(event) =>
                    updateSection(index, "enabled", event.target.checked)
                  }
                />

                <Input
                  name={`section-${section.key}-order`}
                  type="number"
                  min={1}
                  value={section.order}
                  onChange={(event) =>
                    updateSection(index, "order", Number(event.target.value))
                  }
                  className="max-w-20"
                  title="Section order"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 8. FOOTER */}

      <Card title="8. Footer Configuration">
        <div className="space-y-4">
          <Select
            label="Footer Layout"
            name="footerLayout"
            value={config.layout.footer.layout}
            onChange={(event) =>
              setConfig((previous) => ({
                ...previous,
                layout: {
                  ...previous.layout,
                  footer: {
                    ...previous.layout.footer,
                    layout: event.target
                      .value as typeof config.layout.footer.layout,
                  },
                },
              }))
            }
            options={[
              { label: "Simple", value: THEME_FOOTER_LAYOUT.SIMPLE },
              { label: "Columns", value: THEME_FOOTER_LAYOUT.COLUMNS },
              { label: "Extended", value: THEME_FOOTER_LAYOUT.EXTENDED },
            ]}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["showLogo", "Show Logo"],
                ["showSocialLinks", "Show Social Links"],
                ["showContactInfo", "Show Contact Information"],
                ["showQuickLinks", "Show Quick Links"],
              ] as const
            ).map(([key, label]) => (
              <Checkbox
                key={key}
                label={label}
                name={`footer-${key}`}
                checked={config.layout.footer[key]}
                onChange={(event) =>
                  setConfig((previous) => ({
                    ...previous,
                    layout: {
                      ...previous.layout,
                      footer: {
                        ...previous.layout.footer,
                        [key]: event.target.checked,
                      },
                    },
                  }))
                }
              />
            ))}
          </div>
        </div>
      </Card>

      {/* VALIDATION AND MUTATION ERRORS */}

      {(validationError || mutationError) && (
        <div className="rounded-md border border-error/30 bg-error/10 p-3 text-sm text-error">
          {validationError ||
            (mutationError instanceof Error
              ? mutationError.message
              : "Unable to create theme. Please try again.")}
        </div>
      )}

      {/* ACTIONS */}

      <div className="flex flex-wrap justify-end gap-3 pb-6">
        {onCancel && (
          <Button
            type="button"
            size="sm"
            variant="warning"
            onClick={onCancel}
            disabled={themeApiMutation.isPending}
            icon={LucideIcon.XCircle}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          size="sm"
          loading={themeApiMutation.isPending}
          disabled={themeApiMutation.isPending}
          icon={theme ? LucideIcon.Edit : LucideIcon.UploadCloud}
        >
          {themeApiMutation.isPending
            ? theme
              ? "Updating Theme..."
              : "Creating Theme..."
            : theme
              ? "Update Theme"
              : "Create Theme"}
        </Button>
      </div>
    </form>
  );
};

export default ThemeForm;

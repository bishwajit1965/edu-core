export const THEME_HEADER_LAYOUT = {
  CLASSIC: "classic",
  CENTERED: "centered",
  SPLIT: "split",
} as const;

export const THEME_HERO_LAYOUT = {
  CENTERED: "centered",
  LEFT: "left",
  SPLIT: "split",
  SLIDER: "slider",
} as const;

export const THEME_FOOTER_LAYOUT = {
  SIMPLE: "simple",
  COLUMNS: "columns",
  EXTENDED: "extended",
} as const;

export const THEME_SECTION_KEYS = {
  ABOUT: "about",
  NOTICES: "notices",
  EVENTS: "events",
  FACILITIES: "facilities",
  ACADEMIC: "academic",
  TEACHERS: "teachers",
  GALLERY: "gallery",
  TESTIMONIALS: "testimonials",
  CONTACT: "contact",
} as const;

export const THEME_SLIDER_DEFAULTS = {
  ENABLED: true,
  AUTOPLAY: true,
  INTERVAL: 5000,
  MIN_SLIDES: 1,
  MAX_SLIDES: 10,
} as const;

export const THEME_DEFAULTS = {
  IS_ACTIVE: true,
  IS_DELETED: false,
} as const;

import Color from "color";
import { ColorPalette } from "./types";

export const ACCENT_COUNT = 8;

// NOTE: DO NOT ADD COLORS WITHOUT EXTREMELY GOOD REASON AND DESIGN REVIEW
// NOTE: KEEP SYNCRONIZED WITH COLORS.CSS
/* eslint-disable no-color-literals */
export const colors: ColorPalette = {
  brand: "#3596EC",
  summarize: "#69C9E2",
  filter: "#8E8FE5",
  accent0: "#3596EC",
  accent1: "#69C9E2",
  accent2: "#AE91EE",
  accent3: "#FB90A2",
  accent4: "#F9D45C",
  accent5: "#FFAF5D",
  accent6: "#93EADC",
  accent7: "#7172AD",
  "admin-navbar": "#7172AD",
  white: "#FFFFFF",
  black: "#262D34",
  success: "#1FD286",
  danger: "#F45A6D",
  error: "#F45A6D",
  warning: "#F9CF48",
  "text-dark": "#262D34",
  "text-medium": "#75838F",
  "text-light": "#C3CCD3",
  "text-white": "#FFFFFF",
  "bg-black": "#262D34",
  "bg-dark": "#99A7B3",
  "bg-medium": "#EDF3F7",
  "bg-light": "#F6FAFC",
  "bg-white": "#FFFFFF",
  "bg-yellow": "#FFFCF2",
  "bg-night": "#42484E",
  shadow: "rgba(0,0,0,0.08)",
  border: "#F0F3F6",

  /* Saturated colors for the SQL editor. Shouldn't be used elsewhere since they're not white-labelable. */
  "saturated-blue": "#3891E0",
  "saturated-green": "#1FD286",
  "saturated-purple": "#9777DE",
  "saturated-red": "#F45A6D",
  "saturated-yellow": "#F9CF48",
};
/* eslint-enable no-color-literals */

export const originalColors = { ...colors };

const aliases: Record<string, (palette: ColorPalette) => string> = {
  dashboard: palette => color("brand", palette),
  nav: palette => color("bg-white", palette),
  content: palette => color("bg-light", palette),
  database: palette => color("accent2", palette),
  pulse: palette => color("accent4", palette),

  "brand-light": palette => lighten(color("brand", palette), 0.532),
  focus: palette => lighten(color("brand", palette), 0.465),

  "accent0-light": palette => tint(color(`accent0`, palette)),
  "accent1-light": palette => tint(color(`accent1`, palette)),
  "accent2-light": palette => tint(color(`accent2`, palette)),
  "accent3-light": palette => tint(color(`accent3`, palette)),
  "accent4-light": palette => tint(color(`accent4`, palette)),
  "accent5-light": palette => tint(color(`accent5`, palette)),
  "accent6-light": palette => tint(color(`accent6`, palette)),
  "accent7-light": palette => tint(color(`accent7`, palette)),

  "accent0-dark": palette => shade(color(`accent0`, palette)),
  "accent1-dark": palette => shade(color(`accent1`, palette)),
  "accent2-dark": palette => shade(color(`accent2`, palette)),
  "accent3-dark": palette => shade(color(`accent3`, palette)),
  "accent4-dark": palette => shade(color(`accent4`, palette)),
  "accent5-dark": palette => shade(color(`accent5`, palette)),
  "accent6-dark": palette => shade(color(`accent6`, palette)),
  "accent7-dark": palette => shade(color(`accent7`, palette)),
};

export const color = (color: string, palette = colors) => {
  if (color in palette) {
    return palette[color];
  }

  if (color in aliases) {
    return aliases[color](palette);
  }

  return color;
};

export const alpha = (c: string, a: number) => {
  return Color(color(c)).alpha(a).string();
};

export const lighten = (c: string, f: number = 0.5) => {
  return Color(color(c)).lighten(f).string();
};

export const darken = (c: string, f: number = 0.25) => {
  return Color(color(c)).darken(f).string();
};

export const tint = (c: string, f: number = 0.125) => {
  const value = Color(color(c));
  return value.lightness(value.lightness() + f * 100).hex();
};

export const shade = (c: string, f: number = 0.125) => {
  const value = Color(color(c));
  return value.lightness(value.lightness() - f * 100).hex();
};

export const hueRotate = (c: string) => {
  return Color(color(c)).hue() - Color(color(c, originalColors)).hue();
};

export const isLight = (c: string) => {
  return Color(color(c)).isLight();
};

export const isDark = (c: string) => {
  return Color(color(c)).isDark();
};

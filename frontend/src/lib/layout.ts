/**
 * Layout & Spacing System
 * Ensures consistent spacing across the entire application
 */

export const LAYOUT = {
  // Container widths
  container: "w-full",
  containerLg: "w-full",

  // Padding
  containerPadding: "px-6 md:px-10 lg:px-16 xl:px-24",
  containerPaddingLg: "px-6 md:px-12 lg:px-20",

  // Section padding
  sectionPadding: "py-20",
  sectionPaddingLg: "py-24",
  sectionPaddingTop: "pt-20",
  sectionPaddingBottom: "pb-20",

  // Component padding
  cardPadding: "p-8",
  cardPaddingLg: "p-12",

  // Gap/spacing
  gridGap: "gap-8",
  gridGapLg: "gap-12",
  flexGap: "gap-6",
  flexGapLg: "gap-8",
  textMeasure: "max-w-4xl",
  productGrid: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",

  // Component spacing
  cornerRadius: "rounded-3xl",
  cornerRadiusMd: "rounded-2xl",
  cornerRadiusSm: "rounded-xl",
};

/**
 * Usage examples:
 *
 * Container: `${LAYOUT.container} ${LAYOUT.containerPadding}`
 * Section: `py-24`
 * Card: `${LAYOUT.cardPadding}`
 * Grid: `grid ${LAYOUT.gridGap}`
 *
 * For consistency across the site, always use these constants.
 */

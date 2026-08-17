export const DEFAULT_PRODUCT_CATEGORIES = [
  "Street Lamps",
  "Landscape Lamps",
  "Industrial Lighting",
  "Ceiling Lights",
  "Wall Sconces",
  "Pendant Lamps",
];

type ProductCategoryRow = {
  category?: string | null;
};

export function getProductCategoryOptions(
  rows: ProductCategoryRow[] | null | undefined,
  fallbackToDefaults = true,
) {
  const categories = Array.from(
    new Set(
      (rows ?? [])
        .map((row) => row.category?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  return categories.length || !fallbackToDefaults
    ? categories
    : [...DEFAULT_PRODUCT_CATEGORIES];
}

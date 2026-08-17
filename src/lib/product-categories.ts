export type ProductCategory = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

export function sortProductCategories(categories: ProductCategory[]) {
  return [...categories].sort(
    (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name),
  );
}

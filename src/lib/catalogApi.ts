const BASE_URL = process.env.CATALOG_API_BASE_URL!;
const API_KEY = process.env.CATALOG_API_KEY!;

export type CatalogSearchParams = {
  query?: string; // номер детали
  vin?: string;
  brand?: string;
  model?: string;
  year?: number;
  page?: number;
};

export type CatalogItem = {
  id: string;
  oemNumber: string;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  stock?: number;
};

// Пока что — ЗАГЛУШКА без реального запроса к API.
export async function searchCatalog(
  _params: CatalogSearchParams
): Promise<CatalogItem[]> {
  void BASE_URL;
  void API_KEY;

  await new Promise((r) => setTimeout(r, 300)); // имитация сети

  return [
    {
      id: "1",
      oemNumber: "123456",
      name: "Тормозные колодки передние",
      brand: "Bosch",
      price: 3500,
      imageUrl: "/placeholder-brake-pads.png",
      stock: 12,
    },
    {
      id: "2",
      oemNumber: "987654",
      name: "Фильтр масляный",
      brand: "Mann",
      price: 900,
      imageUrl: "/placeholder-oil-filter.png",
      stock: 30,
    },
  ];
}

export async function getCatalogItem(id: string): Promise<CatalogItem | null> {
  const items = await searchCatalog({});
  return items.find((item) => item.id === id) ?? null;
}


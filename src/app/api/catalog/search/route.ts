import { NextRequest, NextResponse } from "next/server";
import { searchCatalog } from "@/lib/catalogApi";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") ?? undefined;
    const vin = searchParams.get("vin") ?? undefined;
    const brand = searchParams.get("brand") ?? undefined;
    const model = searchParams.get("model") ?? undefined;
    const year = searchParams.get("year");

    const items = await searchCatalog({
      query,
      vin,
      brand,
      model,
      year: year ? Number(year) : undefined,
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Ошибка поиска по каталогу" },
      { status: 500 }
    );
  }
}


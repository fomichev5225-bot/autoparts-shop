import { NextRequest, NextResponse } from "next/server";
import { getCatalogItem } from "@/lib/catalogApi";

type RouteParams = {
  params: { id: string };
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const item = await getCatalogItem(params.id);

    if (!item) {
      return NextResponse.json(
        { message: "Деталь не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Ошибка при получении детали" },
      { status: 500 }
    );
  }
}


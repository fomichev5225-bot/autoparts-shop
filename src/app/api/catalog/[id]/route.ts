import { NextRequest, NextResponse } from "next/server";
import { getCatalogItem } from "@/lib/catalogApi";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const item = await getCatalogItem(id);

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

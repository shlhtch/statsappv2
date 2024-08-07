import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const teams = await prisma.stats.findUnique({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении отчета" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  try {
    const updatedStat = await prisma.stats.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(updatedStat);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при обновлении отчета" },
      { status: 500 }
    );
  }
}

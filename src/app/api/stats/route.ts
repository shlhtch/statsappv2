import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stats = await prisma.teams.findMany({
      include: {
        members: {
          select: {
            name: true,
            stats: true,
          },
        },
      },
    });
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении отчетов" },
      { status: 500 }
    );
  }
}

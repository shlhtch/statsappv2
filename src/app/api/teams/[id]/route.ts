import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const teams = await prisma.teams.findUnique({
      where: { id: parseInt(id) },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            isAuth: true,
            telegramId: true,
            role: true,
            stats: true,
          },
        },
      },
    });
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении команд" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");
  const memberId = searchParams.get("memberId");
  const date = searchParams.get("date");

  let formattedDate;
  if (date) {
    const [day, month, year] = date.split("-");
    formattedDate = new Date(`${year}-${month}-${day}`);
  }

  try {
    const teams = await prisma.teams.findMany({
      where: id !== null ? { id: parseInt(id, 10) } : undefined,
      include: {
        members: {
          where: memberId !== null ? { id: parseInt(memberId, 10) } : undefined,
          include: {
            stats: {
              where: formattedDate ? { date: formattedDate } : undefined,
              select: {
                id: true,
                date: true,
                user_id: true,
                deposits: true,
                redeposits: true,
                tir1: true,
                tir2: true,
                comment: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Ошибка при получении команд:", error);
    return NextResponse.json(
      { error: "Ошибка при получении команд" },
      { status: 500 }
    );
  }
}
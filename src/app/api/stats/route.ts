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

export async function POST(request: Request) {
  try {
    const {
      date,
      user_id,
      deposits,
      redeposits,
      tir1,
      tir2,
      comment,
    }: {
      date: string;
      user_id: number;
      deposits: number;
      redeposits: number;
      tir1: number;
      tir2: number | null;
      comment: string;
    } = await request.json();

    const [day, month, year] = date.split("-");
    const formattedDate = new Date(`${day}-${month}-${year}`);

    if (
      !date ||
      user_id === undefined ||
      deposits === undefined ||
      redeposits === undefined ||
      tir1 === undefined ||
      (tir2 !== null && tir2 === undefined)
    ) {
      return NextResponse.json(
        { error: "Некоторые поля имеют некорректные значения" },
        { status: 400 }
      );
    }

    const existingRecord = await prisma.stats.findUnique({
      where: {
        user_id_date: {
          user_id,
          date: formattedDate,
        },
      },
    });

    if (existingRecord) {
      return NextResponse.json(
        {
          error: "Запись для данной даты уже существует, проверь отчеты",
        },
        { status: 409 }
      );
    }

    const newStat = await prisma.stats.create({
      data: {
        date: formattedDate,
        user_id,
        deposits,
        redeposits,
        tir1,
        tir2,
        comment,
      },
    });

    return NextResponse.json(newStat, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании записи:", error);
    return NextResponse.json(
      { error: "Ошибка при создании записи" },
      { status: 500 }
    );
  }
}
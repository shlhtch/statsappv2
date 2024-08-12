import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//всё поменять!!!!!!!!!!!!!!
export async function GET() {
  try {
    const teams = await prisma.teams.findMany({
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

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newTeam = await prisma.teams.create({
      data,
    });
    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при создании команды" },
      { status: 500 }
    );
  }
}

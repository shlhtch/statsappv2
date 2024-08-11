import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const user = await prisma.users.findUnique({
      where: { telegramId: id },
      select: { team_id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const stats = await prisma.stats.findMany({
      where: {
        user: {
          team_id: user.team_id

        },
      },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
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

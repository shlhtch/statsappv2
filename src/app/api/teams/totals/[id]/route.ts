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

    if (user.team_id === null) {
      return NextResponse.json(
        { error: "У пользователя нет команды" },
        { status: 404 }
      );
    }

    const team = await prisma.teams.findUnique({
      where: { id: user.team_id },
	  include: {
		members: {
			select: {
				name: true,
				stats: {
					select: {
						date: true,
						totals: true
					}
				}
			}
		}
	  }
    });

    if (!team) {
      return NextResponse.json(
        { error: "Команда не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user, team });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ошибка при получении отчета" },
      { status: 500 }
    );
  }
}

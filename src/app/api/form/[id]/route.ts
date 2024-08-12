import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const user = await prisma.users.findUnique({
      where: { telegramId: id },
      select: {
        name: true,
        isAuth: true,
        role: true,
        team_id: true,
      },
    });

    if (!user || !user.isAuth) {
      return NextResponse.json(
        { message: "У вас нет доступа" },
        { status: 403 }
      );
    }

    if (user.team_id === null) {
      return NextResponse.json(
        { message: "Пользователь не привязан к команде" },
        { status: 404 }
      );
    }

    // Получаем команду по team_id
    const team = await prisma.teams.findUnique({
      where: { id: user.team_id },
      include: {
        members: {
          select: {
            name: true,
            role: true,
			telegramId: true,
			id: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { message: "Команда не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        team: {
          ...team,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении пользователя" },
      { status: 500 }
    );
  }
}

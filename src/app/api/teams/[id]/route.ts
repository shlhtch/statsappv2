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

    const team = await prisma.teams.findUnique({
      where: { id: user.team_id },
      include: {
        members: {
          select: {
            name: true,
            role: true,
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

    const teamLeads = team.members.filter(
      (member) => member.role === "TEAMLEAD"
    );

    const totalMembersCount = team.members.length;

    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 1);
    const day = String(previousDate.getDate()).padStart(2, "0");
    const month = String(previousDate.getMonth() + 1).padStart(2, "0");
    const year = previousDate.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    if (teamLeads.length === 0) {
      return NextResponse.json(
        {
          message: "Нет членов с ролью TEAMLEAD",
          totalMembers: totalMembersCount,
          previousDate: formattedDate,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        team: {
          ...team,
          members: teamLeads,
          totalMembers: totalMembersCount,
          previousDate: formattedDate,
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

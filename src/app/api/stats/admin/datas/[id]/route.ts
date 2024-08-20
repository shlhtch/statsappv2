import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { searchParams } = new URL(req.url);

  const teamId = searchParams.get("teamId");
  const date = searchParams.get("date");
  const memberId = searchParams.get("memberId");

  let formattedDate;
  if (date) {
    const [day, month, year] = date.split("-");
    formattedDate = new Date(`${year}-${month}-${day}`);
  }

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

    if (user.role === "ADMIN") {
      const teams = await prisma.teams.findMany({
        where: {
          ...(teamId && { id: parseInt(teamId, 10) }),
        },
        include: {
          members: {
            where: {
              ...(memberId && { id: parseInt(memberId, 10) }),
            },
            include: {
              stats: {
                where: {
                  ...(formattedDate && { date: formattedDate }),
                },
                select: {
                  id: true,
                  date: true,
                  user_id: true,
                  deposits: true,
                  redeposits: true,
                  tir1: true,
                  tir2: true,
                  comment: true,
                  fifthvalue: true,
                  secondvalue: true,
                  thirdvalue: true,
                  fourthvalue: true,
                  firstvalue: true,
                  firtsminus: true,
                  secondminus: true,
                  thirdminus: true,
                  totals: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json(
        {
          user: { name: user.name, role: user.role, team_id: user.team_id },
          teams,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "У вас нет доступа" }, { status: 403 });
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    return NextResponse.json(
      { error: "Ошибка при получении пользователя" },
      { status: 500 }
    );
  }
}
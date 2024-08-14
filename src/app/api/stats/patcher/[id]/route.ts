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
      select: {
        id: true,
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

    const message = `${user.name} | ${user.role} | ${user.team_id} | ${user.id}`;

    const stats = await prisma.stats.findMany({
      where: { user_id: user.id },
      orderBy: { date: "desc" },
      take: 31,
    });

    return NextResponse.json({ message, stats }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ошибка при получении пользователя" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { deposits, redeposits, tir1, tir2, comment } = await req.json();

    if (
      deposits === undefined ||
      redeposits === undefined ||
      tir1 === undefined ||
      tir2 === undefined ||
      comment === undefined
    ) {
      return NextResponse.json(
        { error: "Все поля обязятельны для заполнения" },
        { status: 400 }
      );
    }

    const updatedStat = await prisma.stats.update({
      where: { id: Number(id) },
      data: {
        deposits,
        redeposits,
        tir1,
        tir2,
        comment,
      },
    });

    return NextResponse.json(updatedStat, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ошибка при обновлении записи" },
      { status: 500 }
    );
  }
}
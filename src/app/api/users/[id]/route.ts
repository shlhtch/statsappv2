import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const user = await prisma.users.findUnique({
      where: { telegramId: id },
      select: {
        name: true,
        isAuth: true,
        role: true,
        team_id: true
      },
    });

    if (!user || !user.isAuth) {
      return NextResponse.json({ message: 'У вас нет доступа' }, { status: 403 });
    }

    const message = `${user.name} | ${user.role} | ${user.team_id}`;
    return NextResponse.json({ message }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при получении пользователя' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await req.json();
  
    try {
      const updatedUser = await prisma.users.update({
        where: { id: parseInt(id) },
        data: body,
      });
      return NextResponse.json(updatedUser);
    } catch (error) {
      return NextResponse.json({ error: 'Ошибка при обновлении пользователя' }, { status: 500 });
    }
  }
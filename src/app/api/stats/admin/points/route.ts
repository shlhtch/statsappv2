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
      where: {
        ...(id && { id: parseInt(id, 10) }),
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

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Ошибка при получении команд:", error);
    return NextResponse.json(
      { error: "Ошибка при получении команд" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { id, firtsminus, secondminus, thirdminus } = await request.json();

  if (
    !id ||
    (firtsminus === undefined &&
      secondminus === undefined &&
      thirdminus === undefined)
  ) {
    return NextResponse.json(
      { error: "Missing id or update values" },
      { status: 400 }
    );
  }

  try {
    const updatedStat = await prisma.stats.update({
      where: { id: parseInt(id, 10) },
      data: {
        ...(firtsminus !== undefined && { firtsminus }),
        ...(secondminus !== undefined && { secondminus }),
        ...(thirdminus !== undefined && { thirdminus }),
      },
    });

    return NextResponse.json(updatedStat);
  } catch (error) {
    console.error("Ошибка при обновлении stats:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении stats" },
      { status: 500 }
    );
  }
}
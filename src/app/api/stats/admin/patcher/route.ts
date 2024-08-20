import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  let formattedDate;
  if (date) {
    const [day, month, year] = date.split("-");
    formattedDate = new Date(`${year}-${month}-${day}`);
  }

  try {
    const teams = await prisma.teams.findMany({
      where: {
        id: {
          not: 5,
        },
      },
      include: {
        members: {
          include: {
            stats: {
              where: {
                date: formattedDate,
              },
            },
          },
        },
      },
    });

    const maxDeposits = Math.max(
      ...teams
        .flatMap((team) =>
          team.members.flatMap((member) =>
            member.stats.map((stat) => stat.deposits)
          )
        )
        .filter((value) => !isNaN(value))
    );

    const filteredTeams = teams
      .map((team) => ({
        ...team,
        members: team.members
          .map((member) => ({
            ...member,
            stats: member.stats.filter((stat) => stat.deposits === maxDeposits),
          }))
          .filter((member) => member.stats.length > 0),
      }))
      .filter((team) => team.members.length > 0);

    const teamWithId5 = await prisma.teams.findUnique({
      where: { id: 5 },
      include: {
        members: {
          include: {
            stats: {
              where: {
                date: formattedDate,
              },
            },
          },
        },
      },
    });

    let filteredTeam5 = null;

    if (teamWithId5) {
      const maxDepositsTeam5 = Math.max(
        ...teamWithId5.members
          .flatMap((member) => member.stats.map((stat) => stat.deposits))
          .filter((value) => !isNaN(value))
      );

      filteredTeam5 = {
        ...teamWithId5,
        members: teamWithId5.members
          .map((member) => ({
            ...member,
            stats: member.stats.filter(
              (stat) => stat.deposits === maxDepositsTeam5
            ),
          }))
          .filter((member) => member.stats.length > 0),
      };
    }

    return NextResponse.json({ filteredTeams, filteredTeam5 });
  } catch (error) {
    console.error("Ошибка при получении команд:", error);
    return NextResponse.json(
      { error: "Ошибка при получении команд" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { id, fifthvalue } = await request.json();

  if (
    !id ||
    (
      fifthvalue === undefined)
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
        ...(fifthvalue !== undefined && { fifthvalue }),
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
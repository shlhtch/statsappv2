import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stats = await prisma.teams.findMany({
      include: {
        members: {
          select: {
            name: true,
            stats: {
              select: {
                date: true,
                totals: true,
              },
            },
          },
        },
      },
    });

    const result = stats.map((team) => ({
      ...team,
      members: team.members.map((member) => {
        const monthlyTotals: Record<string, number> = {};

        member.stats.forEach((stat) => {
          const totalValue = stat.totals ?? 0;

          const date = new Date(stat.date);
          const yearMonth = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

          if (!monthlyTotals[yearMonth]) {
            monthlyTotals[yearMonth] = 0;
          }
          monthlyTotals[yearMonth] += totalValue;
        });

        const totalsArray = Object.entries(monthlyTotals).map(
          ([month, total]) => ({
            month,
            total,
          })
        );

        const totalSum = totalsArray.reduce((sum, item) => sum + item.total, 0);
        const usdArray: Record<string, { value: number; status: number }> = {};
        for (let i = 1; i <= Math.floor(totalSum / 10); i++) {
          usdArray[`usd${i}`] = { value: 10, status: 0 };
        }

        return {
          ...member,
          totals: totalsArray,
          usd: usdArray,
        };
      }),
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении отчетов" },
      { status: 500 }
    );
  }
}

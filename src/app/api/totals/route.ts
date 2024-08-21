import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const teams = await prisma.teams.findMany({
      include: {
        members: {
          select: {
            id: true,
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

    const statsWithTotals = await Promise.all(
      teams.map(async (team) => ({
        ...team,
        members: await Promise.all(
          team.members.map(async (member) => {
            const monthlyTotals: Record<string, number> = {};
            let totalSum = 0;

            member.stats.forEach((stat) => {
              const totalsValue = stat.totals || 0;
              totalSum += totalsValue;

              const monthKey = new Date(stat.date).toISOString().slice(0, 7);
              if (!monthlyTotals[monthKey]) {
                monthlyTotals[monthKey] = 0;
              }
              monthlyTotals[monthKey] += totalsValue;
            });

            const monthlyTotalsArray = Object.entries(monthlyTotals).map(
              ([month, total]) => ({
                month,
                total,
              })
            );

            const existingRecords = await prisma.usd.findMany({
              where: {
                user_id: member.id,
              },
              orderBy: {
                created_at: "asc",
              },
            });

            const existingValues = existingRecords.map(
              (record) => record.value
            );
            const maxExistingValue =
              existingValues.length > 0 ? Math.max(...existingValues) : 0;

            for (let threshold = 10; threshold <= totalSum; threshold += 10) {
              if (threshold > maxExistingValue) {
                await prisma.usd.create({
                  data: {
                    user_id: member.id,
                    value: threshold,
                  },
                });
              }
            }

            for (const record of existingRecords) {
              if (record.value > totalSum) {
                await prisma.usd.delete({ where: { id: record.id } });
              }
            }

            const usdRecords = await prisma.usd.findMany({
              where: {
                user_id: member.id,
              },
              orderBy: {
                created_at: "asc",
              },
            });

            return {
              ...member,
              totalSum,
              monthlyTotals: monthlyTotalsArray,
              usdRecords,
            };
          })
        ),
      }))
    );

    return NextResponse.json(statsWithTotals);
  } catch (error) {
    console.error("Error occurred during GET request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    return NextResponse.json(
      { error: "Ошибка при получении отчетов", details: errorMessage },
      { status: 500 }
    );
  }
}

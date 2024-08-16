'use client'
import React, { useEffect, useState } from "react";

interface Member {
  id: number;
  name: string;
  totalSum: number;
  monthlyTotals: { month: string; total: number }[];
  usdRecords: { id: number; value: number; isPay: boolean }[];
}

const getMonthName = (month: string) => {
  const [year, monthNumber] = month.split("-");
  const months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];
  const monthIndex = parseInt(monthNumber, 10) - 1;
  return `${year} ${months[monthIndex]}`;
};

const TotalsControls: React.FC = () => {
  const [teams, setTeams] = useState<{ members: Member[] }[]>([]);
  const [openMember, setOpenMember] = useState<string | null>(null);
  const [openTotalSum, setOpenTotalSum] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/totals");
        if (!response.ok) {
          throw new Error("Ошибка при получении данных");
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="p-4 rounded-md mx-2 h-[450px] overflow-y-auto">
      {teams.map((team) =>
        team.members.map((member) => (
          <div key={member.id} className="mb-2">
            <div
              className={`flex justify-center items-center cursor-pointer text-center bg-[#2F313B] mb-0 ${
                openMember === member.id.toString()
                  ? "rounded-t-xl"
                  : "rounded-xl"
              } h-[42px]`}
              onClick={() =>
                setOpenMember(
                  openMember === member.id.toString()
                    ? null
                    : member.id.toString()
                )
              }
            >
              {member.name}
            </div>
            {openMember === member.id.toString() && (
              <div className="p-4 rounded-b-lg bg-[#2F313B] border-t border-gray-500">
                <div className="mb-2">
                  <span
                    className="cursor-pointer border-b border-gray-500"
                    onClick={() =>
                      setOpenTotalSum(
                        openTotalSum === member.id.toString()
                          ? null
                          : member.id.toString()
                      )
                    }
                  >
                    Итого: {member.totalSum}
                  </span>
                </div>
                {openTotalSum === member.id.toString() && (
                  <div className="grid grid-cols-4 gap-2 text-[12px]">
                    {member.usdRecords.map((record, index) => (
                      <button
                        key={record.id}
                        className={`w-[70px] h-[28px] rounded-lg ${
                          record.isPay ? "bg-[#06EE5F]" : "bg-[#FF3B30]"
                        }`}
                      >
                        {index + 1}: {record.value} USD
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  {member.monthlyTotals.map((monthTotal) => (
                    <div key={monthTotal.month} className="mb-1">
                      {getMonthName(monthTotal.month)}: {monthTotal.total}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TotalsControls;
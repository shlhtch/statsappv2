'use client'

import React, { useEffect, useState } from "react";

const TotalsControl: React.FC = () => {
  const [teams, setTeams] = useState<ITotalTeam[]>([]);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(
    new Set()
  );
  const [selectedButton, setSelectedButton] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/totals");
      const data = await response.json();
      setTeams(data);
    };

    const savedButtonStates = localStorage.getItem("selectedButtonStates");
    if (savedButtonStates) {
      setSelectedButton(JSON.parse(savedButtonStates));
    }

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "selectedButtonStates",
      JSON.stringify(selectedButton)
    );
  }, [selectedButton]);

  const toggleMember = (memberName: string) => {
    const updated = new Set(expandedMembers);
    updated.has(memberName)
      ? updated.delete(memberName)
      : updated.add(memberName);
    setExpandedMembers(updated);
  };

  const toggleButtonColor = (buttonId: string, memberName: string) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => ({
        ...team,
        members: team.members.map((member) => {
          if (member.name === memberName) {
            // Проверяем существование usdValue с помощью безопасного доступа
            const currentUSDValue = member.usd[buttonId];
            console.log("Current USD Value: ", currentUSDValue); // Отладочный вывод

            // Проверяем, если значение currentUSDValue существует
            if (currentUSDValue) {
              const newStatus = currentUSDValue.status === 0 ? 1 : 0;
              console.log(
                `Toggling status from ${currentUSDValue.status} to ${newStatus}`
              ); // Отладочный вывод

              return {
                ...member,
                usd: {
                  ...member.usd,
                  [buttonId]: { ...currentUSDValue, status: newStatus },
                },
              };
            } else {
              console.warn(
                `Button ID ${buttonId} not found for member ${memberName}.`
              ); // Предупреждение
            }
          }
          return member; // Возвращаем предыдущий объект, если имя не совпадает
        }),
      }))
    );
  };

  const monthNames = [
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

  return (
    <div className="mx-2">
      {teams.map((team, index) => (
        <div key={index} className="mb-4">
          {team.members.map((member, memberIndex) => (
            <div key={memberIndex} className="border p-4 mt-2">
              <div
                onClick={() => toggleMember(member.name)}
                className="font-bold cursor-pointer"
              >
                {member.name}
              </div>
              {expandedMembers.has(member.name) && (
                <div>
                  <div className="mt-2">
                    <h4 className="font-semibold">Суммы по месяцам:</h4>
                    {member.totals.map((stat, statIndex) => {
                      const monthData = new Date(stat.month);
                      const month = `${monthData.getFullYear()} ${
                        monthNames[monthData.getMonth()]
                      }`;

                      return (
                        <div key={statIndex}>
                          {month}: {stat.total}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <h4
                      className="font-semibold cursor-pointer"
                      onClick={() => toggleMember(`totalSum-${member.name}`)}
                    >
                      {member.totals.reduce((sum, stat) => sum + stat.total, 0)}{" "}
                      totalSum
                    </h4>
                    {expandedMembers.has(`totalSum-${member.name}`) && (
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(member.usd).map(
                          ([usdKey, usdValue]) => (
                            <button
                              key={usdKey}
                              onClick={() =>
                                toggleButtonColor(usdKey, member.name)
                              }
                              className={`rounded-xl p-2 text-white ${
                                usdValue.status ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              <div className="text-xs">
                                {`${parseInt(usdKey.replace("usd", ""), 10)}`}
                              </div>
                              <div className="text-sm">10 USD</div>
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TotalsControl;

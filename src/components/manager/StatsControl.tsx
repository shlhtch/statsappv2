'use client'

import { useEffect, useState, useCallback } from "react";


const StatsControl = () => {
  // Состояния для фильтров и данных
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [filteredData, setFilteredData] = useState<IMember[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Загрузка команд при монтировании компонента
  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch("/api/stats/dashboard"); // Используем новый эндпоинт
      const data: ITeam[] = await response.json();
      setTeams(data);
    };

    fetchTeams();
  }, []);

  // Общая функция изменения фильтров с использованием useCallback
  const handleFilterChange = useCallback(async () => {
    // Фильтрация данных
    const filteredMembers = teams
      .flatMap((team) => team.members)
      .filter((member) => {
        const matchTeam = selectedTeam
          ? member.team_id === parseInt(selectedTeam)
          : true;
        const matchMember = selectedMember
          ? member.id === parseInt(selectedMember)
          : true;
        const matchDate = selectedDate
          ? member.stats.some((stat: IStat) =>
              stat.date.startsWith(selectedDate)
            )
          : true; // Уточнили тип

        return matchTeam && matchMember && matchDate;
      });

    setFilteredData(filteredMembers);
  }, [teams, selectedTeam, selectedMember, selectedDate]);

  // Фильтрация по выбранным значениям
  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  return (
    <div className="p-5">
      <h2 className="text-lg font-bold mb-4">Статистика</h2>
      <div className="mb-4">
        <select
          onChange={(e) => setSelectedTeam(e.target.value)}
          value={selectedTeam}
          className="p-2 border border-gray-300 rounded mr-2"
        >
          <option value="">Выберите команду</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.title}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedMember(e.target.value)}
          value={selectedMember}
          className="p-2 border border-gray-300 rounded mr-2"
        >
          <option value="">Выберите участника</option>
          {teams.flatMap((team) =>
            team.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))
          )}
        </select>

        <input
          type="date"
          onChange={(e) => setSelectedDate(e.target.value)}
          value={selectedDate}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Участник</th>
            <th className="border p-2">Депы</th>
            <th className="border p-2">Додепы</th>
            <th className="border p-2">Tir1</th>
            <th className="border p-2">Tir2</th>
            <th className="border p-2">Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((member) =>
              member.stats.map((stat) => (
                <tr key={stat.id}>
                  <td className="border p-2">{member.name}</td>
                  <td className="border p-2">{stat.deposits}</td>
                  <td className="border p-2">{stat.redeposits}</td>
                  <td className="border p-2">{stat.tir1}</td>
                  <td className="border p-2">{stat.tir2}</td>
                  <td className="border p-2">{stat.comment}</td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan={6} className="border p-2 text-center">
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatsControl;

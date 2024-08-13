'use client'

import { useEffect, useState, useCallback } from "react";

const StatsControl = () => {
  const getYesterdaysDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  };

  const [teams, setTeams] = useState<ITeam[]>([]);
  const [filteredData, setFilteredData] = useState<IMember[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(getYesterdaysDate());

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch("/api/stats/dashboard");
      const data: ITeam[] = await response.json();
      setTeams(data);
    };

    fetchTeams();
  }, []);

  const handleFilterChange = useCallback(async () => {
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
          : true;

        return matchTeam && matchMember && matchDate;
      });

    setFilteredData(filteredMembers);
  }, [teams, selectedTeam, selectedMember, selectedDate]);

  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  return (
    <div className="p-5">
      <div className="mb-4 p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div>
              <input
                type="date"
                onChange={(e) => setSelectedDate(e.target.value)}
                value={selectedDate}
                className="p-2 w-full bg-[#2F313B] rounded-xl"
              />
            </div>
          </div>
          <select
            onChange={(e) => setSelectedMember(e.target.value)}
            value={selectedMember}
            className="p-2 w-ful bg-[#2F313B] rounded-xl"
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
        </div>
        <div>
          <select
            onChange={(e) => setSelectedTeam(e.target.value)}
            value={selectedTeam}
            className="p-2 w-full bg-[#2F313B] rounded-xl"
          >
            <option value="">Все команды</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-[320px] overflow-y-auto">
        <table className="mt-4 min-w-full border border-gray-300">
          <thead>
            <tr className="bg-[#2F313B]">
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
    </div>
  );
};

export default StatsControl;

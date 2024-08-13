'use client'

import { useEffect, useState, useCallback } from "react";
import Select, { StylesConfig, SingleValue, MultiValue } from "react-select";

const StatsControl = () => {
  const getYesterdaysDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0]; // Возвращает дату в формате YYYY-MM-DD
  };

  const [teams, setTeams] = useState<ITeam[]>([]);
  const [filteredData, setFilteredData] = useState<IMember[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    getYesterdaysDate()
  );

  useEffect(() => {
    const fetchTeams = async () => {
      const params = new URLSearchParams();
      if (selectedTeam) {
        params.append("id", selectedTeam);
      }
      if (selectedMember) {
        params.append("memberId", selectedMember);
      }
      if (selectedDate) {
        params.append("date", selectedDate.split("-").reverse().join("-"));
      }

      const response = await fetch(`/api/stats/dashboard?${params.toString()}`);
      const data: ITeam[] = await response.json();
      setTeams(data);
    };

    fetchTeams();
  }, [selectedTeam, selectedMember, selectedDate]);

  const handleFilterChange = useCallback(() => {
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
          ? member.stats.some((stat: IStat) => {
              const statDate = new Date(stat.date).toISOString().split("T")[0]; 
              return statDate === selectedDate;
            })
          : true;

        return matchTeam && matchMember && matchDate;
      });

    setFilteredData(filteredMembers);
  }, [teams, selectedTeam, selectedMember, selectedDate]);

  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  const memberOptions: IMemberOption[] = [
    { value: 0, label: "Все менеджеры" },
    ...teams.flatMap((team) =>
      team.members.map((member) => ({
        value: member.id,
        label: member.name,
      }))
    ),
  ];

  const teamOptions: ITeamOption[] = [
    { value: 0, label: "Все команды" },
    ...teams.map((team) => ({
      value: team.id,
      label: team.title,
    })),
  ];

 const customStylesManager: StylesConfig<IMemberOption> = {
   menu: (provided) => ({
     ...provided,
     borderRadius: "0.75rem",
     backgroundColor: "#2F313B",
     position: "absolute",
   }),
   control: (provided, state) => ({
     ...provided,
     borderRadius: "0.75rem",
     backgroundColor: "#2F313B",
     borderColor: "transparent",
     boxShadow: state.isFocused ? "0 0 0 1px #A8B4CE" : "none",
     height: "42px",
     minHeight: "42px",
     "&:hover": {
       borderColor: state.isFocused ? "#A8B4CE" : "transparent",
     },
     color: "white",
   }),
   singleValue: (provided) => ({
     ...provided,
     color: "white",
   }),
   placeholder: (provided) => ({
     ...provided,
     color: "white",
   }),
   menuList: (provided) => ({
     ...provided,
     color: "white",
     padding: 0,
     borderRadius: "0.75rem",
   }),
   option: (provided, { isFocused, isSelected }) => ({
     ...provided,
     backgroundColor: isSelected
       ? "#A8B4CE"
       : isFocused
       ? "#3A3F47"
       : "#2F313B",
     color: "white",
     padding: "10px",
     borderBottom: "1px solid #4B5563",
     "&:last-child": {
       borderBottom: "none",
     },
     "&:hover": {
       backgroundColor: "#3A3F47",
     },
   }),
   input: (provided) => ({
     ...provided,
     color: "white",
   }),
 };

  const customStylesTeams: StylesConfig<ITeamOption> = {
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.75rem",
      backgroundColor: "#2F313B",
      position: "absolute",
    }),
    control: (provided, state) => ({
      ...provided,
      borderRadius: "0.75rem",
      backgroundColor: "#2F313B",
      borderColor: "transparent",
      boxShadow: state.isFocused ? "0 0 0 1px #A8B4CE" : "none",
      height: "42px",
      minHeight: "42px",
      "&:hover": {
        borderColor: state.isFocused ? "#A8B4CE" : "transparent",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    menuList: (provided) => ({
      ...provided,
      color: "white",
      padding: 0,
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      backgroundColor: isSelected
        ? "#A8B4CE"
        : isFocused
        ? "#3A3F47"
        : "#2F313B",
      color: "white",
      padding: "10px",
      borderBottom: "1px solid #4B5563",
      "&:last-child": {
        borderBottom: "none",
      },
      "&:hover": {
        backgroundColor: "#3A3F47",
      },
    }),
  };

  return (
    <div className="px-4">
      <div className="py-5">
        <div className="grid grid-cols-2 gap-2 mb-3">
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
          <Select<IMemberOption, false>
            options={memberOptions}
            onChange={(option: SingleValue<IMemberOption>) => {
              if (option) {
                if (option.value === 0) {
                  setSelectedMember("");
                } else {
                  setSelectedMember(option.value.toString());
                }
              }
            }}
            styles={customStylesManager}
            placeholder="Менеджер"
            className="rounded-xl"
            isSearchable={true}
          />
        </div>
        <div>
          <Select<ITeamOption, false>
            options={teamOptions}
            onChange={(option: SingleValue<ITeamOption>) => {
              if (option) {
                if (option.value === 0) {
                  setSelectedTeam("");
                } else {
                  setSelectedTeam(option.value.toString());
                }
              }
            }}
            styles={customStylesTeams}
            placeholder="Выберите команду"
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="h-[355px] overflow-y-auto bg-[#2F313B] rounded-xl">
        <table className="min-w-full">
          <thead className="bg-[#2F313B]">
            <tr>
              <th className="p-2 sticky top-0 bg-[#2F313B]">Менеджер</th>
              <th className="p-2 sticky top-0 bg-[#2F313B]">Депы</th>
              <th className="p-2 sticky top-0 bg-[#2F313B]">Додепы</th>
              <th className="p-2 sticky top-0 bg-[#2F313B]">Tir1</th>
              <th className="p-2 sticky top-0 bg-[#2F313B]">Tir2</th>
              <th className="p-2 sticky top-0 bg-[#2F313B]">Отчет</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((member) =>
                member.stats.map((stat) => (
                  <tr key={stat.id}>
                    <td className="p-2">{member.name}</td>
                    <td className="p-2">{stat.deposits}</td>
                    <td className="p-2">{stat.redeposits}</td>
                    <td className="p-2">{stat.tir1}</td>
                    <td className="p-2">{stat.tir2}</td>
                    <td className="p-2">{stat.comment}</td>
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

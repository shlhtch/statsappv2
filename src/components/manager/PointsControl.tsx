"use client";

import { useEffect, useState, useCallback } from "react";
import Select, { StylesConfig, SingleValue } from "react-select";

const PointsControl = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [filteredData, setFilteredData] = useState<IMember[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [hover, setHover] = useState<number | null>(null);

  const headers = [
    { title: "Менеджер", hoverText: "Менеджер"},
    { title: "№1", hoverText: "3 и более депов"},
    { title: "№2", hoverText: "Додепы = депы" },
    { title: "№3", hoverText: "Додепов в два раза больше депов"},
    { title: "№4", hoverText: "Tir1 > 150;Tir2 > 100"},
    { title: "№5", hoverText: "Больше всего депов за день" },
    {
      title: "№6",
      hoverText: "Бес-ок в СРМ",
    },
    {
      title: "№7",
      hoverText: "Нев-ые задачи",
    },
    {
      title: "№8",
      hoverText: "По согл-ию",
    },
    { title: "Итого", hoverText: "Итого"},
  ];

    const getYesterdaysDate = () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date.toISOString().split("T")[0];
    };
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
                className="p-2 w-full bg-[#2F313B] rounded-xl text-center font-medium text-[14px] text-white"
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
            className="rounded-xl text-center text-[14px] font-medium"
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
            className="rounded-xl text-center text-[14px] font-medium"
          />
        </div>
      </div>
      <div
        className={`overflow-y-auto bg-[#2F313B] rounded-xl ${
          filteredData.length <= 4 ? "h-auto" : "h-[335px]"
        }`}
      >
        <table className="min-w-full text-white">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`sticky top-0 bg-[#2F313B] py-6 text-left font-medium border-b border-gray-500 mx-3 transition-all duration-400 ease-in-out ${
                    index >= 1 && index <= 8 && hover === index
                      ? "text-[12px]"
                      : "text-[14px] px-2"
                  }`}
                  onMouseEnter={() =>
                    index >= 1 && index <= 8 ? setHover(index) : null
                  }
                  onMouseLeave={() =>
                    index >= 1 && index <= 8 ? setHover(null) : null
                  }
                >
                  {hover === index ? header.hoverText : header.title}{" "}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="py-4">
            {filteredData.length > 0 ? (
              filteredData.map((member) =>
                member.stats.map((stat) => (
                  <tr key={stat.id}>
                    <td className="px-2 py-2 border-b border-gray-500 text-left font-normal text-[15px]">
                      {member.name}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-500 text-center font-normal text-[15px]">
                      {stat.firstvalue}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-500 text-center font-normal text-[15px]">
                      {stat.secondvalue}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-500 text-center font-normal text-[15px]">
                      {stat.thirdvalue}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-500 text-center font-normal text-[15px]">
                      {stat.fourthvalue}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-500 text-center font-normal text-[15px]">
                      {stat.fifthvalue}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-500 text-center font-normal text-[15px] ">
                      {stat.firtsminus}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-500 text-center font-normal text-[15px]">
                      {stat.secondminus}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-500 text-center font-normal text-[15px]">
                      {stat.thirdminus}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-500 text-center font-normal text-[15px]">
                      {stat.totals}
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={10} className="border p-2 text-center">
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

export default PointsControl;

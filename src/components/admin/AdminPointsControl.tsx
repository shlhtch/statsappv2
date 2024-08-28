"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Select, { SingleValue, StylesConfig } from "react-select";

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
    backgroundColor: isSelected ? "#A8B4CE" : isFocused ? "#3A3F47" : "#2F313B",
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
    backgroundColor: isSelected ? "#A8B4CE" : isFocused ? "#3A3F47" : "#2F313B",
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

const AdminPoints = () => {
  const [teams, setTeams] = useState<IPointTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [editStatId, setEditStatId] = useState<number | null>(null);
  const [firtsminus, setFirtsminus] = useState<number | undefined>(undefined);
  const [secondminus, setSecondminus] = useState<number | undefined>(undefined);
  const [thirdminus, setThirdminus] = useState<number | undefined>(undefined);

  const getYesterdaysDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  };
  const [filterDate, setFilterDate] = useState<string>(getYesterdaysDate());

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const formattedDate = filterDate
        ? formatDateToDDMMYYYY(filterDate)
        : null;
      const response = await axios.get("/api/stats/admin/points", {
        params: {
          id: selectedTeam === "0" ? undefined : selectedTeam,
          memberId: selectedMember === "0" ? undefined : selectedMember,
          date: formattedDate,
        },
      });
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateToDDMMYYYY = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleUpdate = async () => {
    if (editStatId !== null) {
      try {
        const response = await axios.patch("/api/stats/admin/points", {
          id: editStatId,
          firtsminus,
          secondminus,
          thirdminus,
        });
        console.log("Updated stat:", response.data);
        fetchTeams();
        resetEditState();
      } catch (error) {
        console.error("Error updating stat:", error);
      }
    }
  };

  const resetEditState = () => {
    setEditStatId(null);
    setFirtsminus(undefined);
    setSecondminus(undefined);
    setThirdminus(undefined);
  };

  useEffect(() => {
    fetchTeams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam, selectedMember, filterDate]);

  const teamOptions: ITeamOption[] = [
    { value: 0, label: "Все команды" },
    ...teams.map((team) => ({
      value: team.id,
      label: team.title,
    })),
  ];

  const memberOptions: IMemberOption[] = [
    { value: 0, label: "Все менеджеры" },
    ...teams.flatMap((team) =>
      team.members.map((member) => ({
        value: member.id,
        label: member.name,
      }))
    ),
  ];

  return (
    <div className="px-4">
      <div className="py-5">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <input
              type="date"
              onChange={(e) => setFilterDate(e.target.value)}
              value={filterDate}
              className="p-2 w-full bg-[#2F313B] rounded-xl text-center"
            />
          </div>
          <div>
            <Select<IMemberOption, false>
              options={memberOptions}
              onChange={(option: SingleValue<IMemberOption>) => {
                if (option) {
                  setSelectedMember(option.value.toString());
                } else {
                  setSelectedMember("");
                }
              }}
              styles={customStylesManager}
              placeholder="Менеджер"
              className="rounded-xl text-center"
              isSearchable={true}
            />
          </div>
        </div>
        <div>
          <Select<ITeamOption, false>
            options={teamOptions}
            onChange={(option: SingleValue<ITeamOption>) => {
              if (option) {
                setSelectedTeam(option.value.toString());
              } else {
                setSelectedTeam("");
              }
            }}
            styles={customStylesTeams}
            placeholder="Выберите команду"
            className="text-center"
          />
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-y-auto max-h-[385px]">
          {teams.length === 0 ||
          !teams.some((team) =>
            team.members.some((member) => member.stats.length > 0)
          ) ? (
            <p className="text-gray-500 text-center">Нет данных</p>
          ) : (
            teams.map((team) => (
              <div
                key={team.id}
                className="mb-2 rounded-xl bg-[#2F313B] shadow-md"
              >
                {team.members.map((member) => {
                  const hasStats = member.stats && member.stats.length > 0;

                  return (
                    <div
                      key={member.id}
                      className="bg-[#2F313B] rounded-xl px-4 py-2 my-1"
                    >
                      <h3 className="text-[14px] font-bold">{member.name}</h3>
                      {hasStats ? (
                        member.stats.map((stat) => (
                          <div key={stat.id}>
                            <p className="text-[14px] font-bold">
                              {new Date(stat.date).toLocaleDateString()}
                            </p>
                            <div>
                              <div className="flex items-center py-2">
                                <label className="block mr-2 text-[14px] w-1/2">
                                  Беспорядок в СРМ
                                </label>
                                <input
                                  type="text"
                                  value={
                                    editStatId === stat.id
                                      ? firtsminus
                                      : stat.firtsminus
                                  }
                                 onChange={(e) => {
    const value = e.target.value;
    if (value === '' || /^-?\d*$/.test(value)) {
      const numberValue = value === '' ? undefined : parseInt(value, 10);
      setFirtsminus(numberValue);
    }
  }}
                                  className="bg-[#41434e] w-1/5 rounded-sm"
                                  disabled={editStatId !== stat.id}
                                />
                              </div>
                              <div className="flex items-center mt-2">
                                <label className="block mr-2 w-1/2 text-[14px]">
                                  Невыполненные задачи
                                </label>
                                <input
                                  type="number"
                                  value={
                                    editStatId === stat.id
                                      ? secondminus
                                      : stat.secondminus
                                  }
                                  onChange={(e) =>
                                    setSecondminus(parseInt(e.target.value))
                                  }
                                  className="bg-[#41434e] w-1/5 rounded-sm"
                                  disabled={editStatId !== stat.id}
                                />
                              </div>
                              <div className="flex items-center mt-2">
                                <label className="block mr-2 w-1/2 text-[14px]">
                                  По согласованию
                                </label>
                                <input
                                  type="number"
                                  value={
                                    editStatId === stat.id
                                      ? thirdminus
                                      : stat.thirdminus
                                  }
                                  onChange={(e) =>
                                    setThirdminus(parseInt(e.target.value))
                                  }
                                  className="bg-[#41434e] w-1/5 rounded-sm"
                                  disabled={editStatId !== stat.id}
                                />
                              </div>
                              {editStatId === stat.id ? (
                                <button
                                  onClick={handleUpdate}
                                  className="bg-green-500 text-white rounded-xl w-full mt-2 py-1"
                                >
                                  Применить
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditStatId(stat.id);
                                    setFirtsminus(stat.firtsminus);
                                    setSecondminus(stat.secondminus);
                                    setThirdminus(stat.thirdminus);
                                  }}
                                  className="bg-[#FF67DE] text-white rounded-xl w-full mt-2 py-1"
                                >
                                  Изменить
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center">Нет данных</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPoints;

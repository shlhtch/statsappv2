'use client'

import { useInitData } from '@telegram-apps/sdk-react';
import React, { useEffect, useState } from 'react';

const DetailStatsControl: React.FC = () => {
  const initData = useInitData();
  const id = initData?.user?.id;

  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userTeam, setUserTeam] = useState<string | null>(null);
  const [stats, setStats] = useState<IStat[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedStats, setEditedStats] = useState<IStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/stats/patcher/${id}`);
        if (!response.ok) throw new Error("Ошибка загрузки данных");
        const data = await response.json();

        const [name, role, team_id] = data.message.split(" | ");
        setUserName(name);
        setUserRole(role);
		setUserTeam(team_id);
        setStats(data.stats);
        setEditedStats(data.stats);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setWarnings([]);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedStats = [...editedStats];

    if (field === "comment") {
      updatedStats[index] = { ...updatedStats[index], [field]: value };
      setEditedStats(updatedStats);
      return;
    }

    if (!/^\d*$/.test(value)) {
      setWarnings((prev) =>
        prev.includes(
          `Поле '${field}' должно содержать только положительные числа или 0`
        )
          ? prev
          : [
              ...prev,
              `Поле '${field}' должно содержать только положительные числа или 0`,
            ]
      );
      return;
    }

    if (value === "") {
      updatedStats[index] = { ...updatedStats[index], [field]: 0 };
    } else if (["deposits", "redeposits", "tir1", "tir2"].includes(field)) {
      updatedStats[index] = { ...updatedStats[index], [field]: Number(value) };
    } else {
      updatedStats[index] = { ...updatedStats[index], [field]: value };
    }

    setEditedStats(updatedStats);
  };

  const handleSave = async (index: number) => {
    try {
      const statToUpdate = editedStats[index];
      const response = await fetch(`/api/stats/patcher/${statToUpdate.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statToUpdate),
      });
      if (!response.ok) throw new Error("Ошибка при сохранении изменений");

      const updatedStats = [...stats];
      updatedStats[index] = statToUpdate;
      setStats(updatedStats);
      setEditingIndex(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="text-white">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const bgColor = () => {
    switch (userTeam) {
      case "1":
        return "bg-[#CFA3F2]";
      case "2":
        return "bg-[#064040]";
      case "3":
        return "bg-[#904636]";
      case "4":
        return "bg-[#0052B3]";
      case "5":
        return "bg-[#8D7F7B]";
      default:
        return "bg-[#AE0900]";
    }
  };

  return (
    <div className="bg-[#2F313B] h-[500px] overflow-y-auto p-4 rounded-md">
      <h2 className="text-white text-lg mb-2">{userName}</h2>
      <h3 className="text-white text-md mb-4">{userRole}</h3>
      <ul className="space-y-2">
        {editedStats.map((stat, index) => (
          <li
            key={stat.id}
            className={`bg-[#3A3E47] p-4 rounded-md flex ${
              editingIndex === index ? "bg-[#5e636d]" : ""
            }`}
          >
            <div className="flex flex-col gap-2 pr-4 border-r border-gray-600">
              <div className="flex justify-between">
                <p className="text-white">
                  {new Date(stat.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-white">Депы:</p>
                <p className="text-white">
                  <input
                    type="number"
                    min={0}
                    value={
                      editingIndex === index ? stat.deposits : stat.deposits
                    }
                    onChange={(e) =>
                      handleChange(index, "deposits", e.target.value)
                    }
                    readOnly={editingIndex !== index}
                    className={`bg-[#3A3E47] text-white ${
                      editingIndex !== index ? "cursor-not-allowed" : ""
                    } px-1 w-16`}
                  />
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-white">Додепы:</p>
                <p className="text-white">
                  <input
                    type="number"
                    min={0}
                    value={
                      editingIndex === index ? stat.redeposits : stat.redeposits
                    }
                    onChange={(e) =>
                      handleChange(index, "redeposits", e.target.value)
                    }
                    readOnly={editingIndex !== index}
                    className={`bg-[#3A3E47] text-white ${
                      editingIndex !== index ? "cursor-not-allowed" : ""
                    } px-1 w-16`}
                  />
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-white">TIR1:</p>
                <p className="text-white">
                  <input
                    type="number"
                    min={0}
                    value={editingIndex === index ? stat.tir1 : stat.tir1}
                    onChange={(e) =>
                      handleChange(index, "tir1", e.target.value)
                    }
                    readOnly={editingIndex !== index}
                    className={`bg-[#3A3E47] text-white ${
                      editingIndex !== index ? "cursor-not-allowed" : ""
                    } px-1 w-16`}
                  />
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-white">TIR2:</p>
                <p className="text-white">
                  <input
                    type="number"
                    min={0}
                    value={editingIndex === index ? stat.tir2 : stat.tir2}
                    onChange={(e) =>
                      handleChange(index, "tir2", e.target.value)
                    }
                    readOnly={editingIndex !== index}
                    className={`bg-[#3A3E47] text-white ${
                      editingIndex !== index ? "cursor-not-allowed" : ""
                    } px-1 w-16`}
                  />
                </p>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <textarea
                className="w-full h-24 bg-[#3A3E47] text-white p-2 border-none resize-none"
                value={
                  editingIndex === index
                    ? stat.comment
                    : stat.comment || "Без отчета"
                }
                onChange={(e) => handleChange(index, "comment", e.target.value)}
                readOnly={editingIndex !== index}
              />
              {editingIndex === index ? (
                <button
                  onClick={() => handleSave(index)}
                  className="py-3 bg-green-600 text-white w-full px-4 rounded-xl hover:bg-green-500"
                >
                  Сохранить
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(index)}
                  className={`py-3 text-white w-full px-4 rounded-xl ${bgColor()} hover:bg-opacity-80`}
                >
                  Изменить
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {warnings.length > 0 && (
        <div className="text-red-500 mt-2">
          {warnings.map((warning, index) => (
            <p key={index}>{warning}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailStatsControl;
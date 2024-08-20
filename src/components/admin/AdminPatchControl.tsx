'use client'
import { statSync } from 'fs';
import { useEffect, useState } from "react";

interface MemberStat {
  id: number;
  date: string;
  deposits: number;
  fifthvalue?: number;
}

interface Member {
  id: number;
  name: string;
  stats: MemberStat[];
}

interface Team {
  id: number;
  title: string;
  members: Member[];
}

const AdminPatchControl = () => {
  const [date, setDate] = useState<string>(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const day = String(yesterday.getDate()).padStart(2, "0");
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const year = yesterday.getFullYear();
    return `${day}-${month}-${year}`;
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [editableStatId, setEditableStatId] = useState<number | null>(null);
  const [fifthvalue, setFifthValue] = useState<number | undefined>(undefined);

  const fetchTeams = async () => {
    const response = await fetch(`/api/stats/admin/patcher?date=${date}`);
    const data = await response.json();
    const allTeams = [...data.filteredTeams, data.filteredTeam5];
    setTeams(allTeams);
  };

  const handleEdit = (statId: number, fifthvalue: number | undefined) => {
    setEditableStatId(statId);
    setFifthValue(fifthvalue);
  };

  const handleApply = async (statId: number) => {
    if (fifthvalue === undefined) return;

    await fetch(`/api/stats/admin/patcher`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: statId, fifthvalue }),
    });

    // Fetch updated teams
    fetchTeams();
    setEditableStatId(null);
    setFifthValue(undefined);
  };

  useEffect(() => {
    if (date) {
      fetchTeams();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className="p-4">
      <input
        type="date"
        value={
          new Date(date.split("-").reverse().join("-"))
            .toISOString()
            .split("T")[0]
        }
        onChange={(e) => {
          const selectedDate = new Date(e.target.value);
          const formattedDate = `${String(selectedDate.getDate()).padStart(
            2,
            "0"
          )}-${String(selectedDate.getMonth() + 1).padStart(
            2,
            "0"
          )}-${selectedDate.getFullYear()}`;
          setDate(formattedDate);
        }}
        className="p-2 w-full bg-[#2F313B] rounded-xl text-center"
      />
      <div className="py-2">
        <div className="overflow-y-auto h-[440px] py-4">
          <div className="grid grid-cols-1 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="p-4 bg-[#2F313B] rounded-xl shadow">
                <div className="font-bold">{team.title}</div>
                {team.members.map((member) =>
                  member.stats.map((stat) => (
                    <div key={stat.id} className="flex flex-col mt-4">
                      <div>{new Date(stat.date).toLocaleDateString()}</div>
                      <div>{member.name}</div>
                      <div>Депы: {stat.deposits}</div>
                      <div className="mt-2 flex items-center">
                        <div>Балл для победителя:&nbsp;</div>
                        <div className="flex items-center ml-2">
                          {editableStatId === stat.id ? (
                            <input
                              type="number"
                              value={
                                fifthvalue !== undefined
                                  ? fifthvalue
                                  : stat.fifthvalue
                              }
                              onChange={(e) =>
                                setFifthValue(Number(e.target.value))
                              }
                              className="bg-[#41434e] w-16"
                            />
                          ) : (
                            <div className="ml-2">{stat.fifthvalue}</div>
                          )}
                        </div>
                      </div>
                      <div className="pt-2 w-full">
                        {editableStatId === stat.id ? (
                          <button
                            onClick={() => {
                              handleApply(stat.id);
                              setFifthValue(stat.fifthvalue);
                            }}
                            className="bg-green-500 text-white py-1 px-3 rounded-xl w-full"
                          >
                            Применить
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleEdit(stat.id, stat.fifthvalue);
                              setFifthValue(stat.fifthvalue);
                            }}
                            className="bg-[#FF67DE] text-white py-1 px-3 rounded-xl w-full"
                          >
                            Изменить
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminPatchControl;
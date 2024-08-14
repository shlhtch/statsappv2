'use client'

import { useInitData } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';
import styles from '@/app/manager/manager.module.css'
import { Icon } from '@iconify/react/dist/iconify.js';


export function TeamTotalStat() {
  const initData = useInitData();
  const id = initData?.user?.id;
  const [roleMessage, setRoleMessage] = useState<string>("");
  const [userTeam, setUserTeam] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [teamData, setTeamData] = useState<ITeamData | null>(null);
  const [totalsData, setTotalsData] = useState<ITotalsData[]>([]); // State for totals data

  useEffect(() => {
    const fetchUserRole = async () => {
      if (id) {
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();
        if (response.ok) {
          setRoleMessage(data.message);
          const [name, role, team] = data.message.split(" | ");
          setUserTeam(team);
        } else {
          setRoleMessage("Ошибка при загрузке данных");
        }
      } else {
        setRoleMessage("У вас нет доступа");
      }
      setLoading(false);
    };

    fetchUserRole();
  }, [id]);

  useEffect(() => {
    document.body.classList.remove(
      styles.managerbgTMNT,
      styles.managerbgDH,
      styles.managerbgHFM,
      styles.managerbgBMC,
      styles.managerbgPNX
    );

    if (userTeam === "1") {
      document.body.classList.add(styles.managerbgTMNT);
    } else if (userTeam === "3") {
      document.body.classList.add(styles.managerbgDH);
    } else if (userTeam === "2") {
      document.body.classList.add(styles.managerbgHFM);
    } else if (userTeam === "4") {
      document.body.classList.add(styles.managerbgBMC);
    } else if (userTeam === "5") {
      document.body.classList.add(styles.managerbgPNX);
    }
  }, [userTeam]);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (userTeam) {
        const response = await fetch(`/api/teams/${id}`);
        const data = await response.json();
        if (response.ok) {
          setTeamData(data.team);
        } else {
          setTeamData(null);
        }
      }
    };

    fetchTeamData();
  }, [id, userTeam]);

  // New effect to fetch totals data
  useEffect(() => {
    const fetchTotalsData = async () => {
      const response = await fetch(`/api/teams/totals/${id}`); // Fetch totals data
      const data = await response.json();
      if (response.ok) {
        // Extract name and totals from the response
        const totalsArray: ITotalsData[] = data.team.members.map(
          (member: IMember) => ({
            name: member.name,
            totals: member.stats[0]?.totals || 0, // Get totals or default to 0 if no stats
          })
        );
        setTotalsData(totalsArray); // Update the totals data state
      }
    };

    if (userTeam) {
      // Only fetch totals data if userTeam is available
      fetchTotalsData();
    }
  }, [userTeam, id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icon
          icon="material-symbols-light:poker-chip"
          width="64"
          height="64"
          className="text-[#8D7F7B] rotating-icon"
        />
      </div>
    );
  }

  return (
    <div>
      {teamData ? (
        <div className="py-5 font-montserratAlternates text-white">
          <div className="text-center font-extrabold text-[20px]">
            {teamData.previousDate}
          </div>
          <h1 className="px-5 mt-[134px] mb-1 font-semibold text-[20px]">
            {teamData.title}
          </h1>
          <ul>
            {teamData.members.map((member, index) => (
              <li key={index} className="px-5 mb-1 font-semibold text-[14px]">
                Тимлид: {member.name}
              </li>
            ))}
          </ul>
          <h1 className="px-5 mb-[15px] font-semibold text-[14px]">
            Менеджеры: {teamData.totalMembers}
          </h1>
          <div className="overflow-auto mt-[15px]" style={{ height: "210px" }}>
            <div className="grid gap-y-3 gap-x-4 grid-cols-2 pb-16 px-5 text-black">
              {totalsData.length > 0 ? (
                totalsData.map((total, index) => {
                  // Split the full name into first name and last name.
                  const [firstName, lastName] = total.name.split(" ");
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl ${bgColor()} w-[166px] h-[96px] flex flex-col justify-center p-3`}
                    >
                      <div className="text-left">
                        <div className="text-sm font-medium">{firstName}</div>
                        <div className="text-sm font-medium">{lastName}</div>
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        Итого: {total.totals}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  className={`rounded-2xl ${bgColor()} w-[166px] h-[96px] flex items-center justify-center`}
                >
                  <h1 className="text-sm">Нет данных</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <h1>Информация о команде недоступна</h1>
      )}
    </div>
  );
}
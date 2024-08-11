'use client'

import { useInitData } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';
import styles from '@/app/manager/manager.module.css'
import { Icon } from '@iconify/react/dist/iconify.js';

export function TeamTotalStat() {
  const initData = useInitData();
  const id = initData?.user?.id;
  const [roleMessage, setRoleMessage] = useState("");
  const [userTeam, setUserTeam] = useState("");
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<ITeamData | null>(null);

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
        <div className="mt-5 font-montserratAlternates">
          <h1 className="text-center font-extrabold text-[24px]">
            {teamData.previousDate}
          </h1>
          <h1 className="ml-5 mt-52 font-semibold text-[20px]">
            {teamData.title}
          </h1>
          <ul>
            {teamData.members.map((member, index) => (
              <li key={index} className="ml-5 mt-2 font-semibold text-[14px]">
                Тимлид: {member.name}
              </li>
            ))}
          </ul>
          <h1 className="ml-5 mt-1 font-semibold text-[14px]">
            Менеджеры: {teamData.totalMembers}
          </h1>
        </div>
      ) : (
        <h1>Информация о команде недоступна</h1>
      )}
    </div>
  );
}

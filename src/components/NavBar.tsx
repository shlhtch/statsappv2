/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link';
import { Icon } from "@iconify/react";
import useNavigation from '@/hooks/useNavifation';
import { useInitData } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';

export default function NavBar(){
	 const {
     isHomeActive,
     isExploreActive,
     isMessagesActive,
     isTeamsActive,
   } = useNavigation();
  
  const initData = useInitData();
  const id = initData?.user?.id;
  const [roleMessage, setRoleMessage] = useState("");
  const [userTeam, setUserTeam] = useState("");

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
    };

    fetchUserRole();
  }, [id]);
  
  const getClassName = (isActive: any) => {
    if (userTeam === "1") {
      return isActive ? "text-[#461799]" : "text-[#BAD7D6]";
    } else if (userTeam === "3") {
      return isActive ? "text-[#CB4E07]" : "text-[#BAD7D6]";
    } else if (userTeam === "2") {
      return isActive ? "text-[#29B298]" : "text-[#BAD7D6]";
    } else if (userTeam === "4") {
      return isActive ? "text-[#0052B3]" : "text-[#BAD7D6]";
    } else if (userTeam === "5") {
      return isActive ? "text-[#8D7F7B]" : "text-[#BAD7D6]";
    } else {
      return isActive ? "text-[#AE0900]" : "text-[#BAD7D6]";
    }
  };

  const getAddFormColor = () => {
    if (userTeam === "1") {
      return "#461799";
    } else if (userTeam === "3") {
      return "#CB4E07";
    } else if (userTeam === "2") {
      return "#29B298";
    } else if (userTeam === "4") {
      return "#0052B3";
    } else if (userTeam === "5") {
      return "#8D7F7B";
    } else {
      return "#AE0900";
    }
  };

	return (
    <div className="relative">
      <img
        src="/navbar.svg"
        alt="Navbar Background"
        // className="w-full h-auto"
      />
      <div className="absolute inset-0 flex justify-center items-center">
        <Link href="/manager/points" className="mx-4">
          <Icon
            icon="mage:gem-stone-fill"
            width="24"
            height="24"
            className={getClassName(isHomeActive)}
          />
        </Link>
        <Link href="/manager/stats" className="mx-4">
          <Icon
            icon="mage:stack-fill"
            width="24"
            height="24"
            className={getClassName(isExploreActive)}
          />
        </Link>
        <Link href="/manager/form" className="mx-4 mb-9">
          <Icon
            icon="lets-icons:add-ring-duotone"
            width="64"
            height="64"
            color={getAddFormColor()}
          />
        </Link>
        <Link href="/manager/totals" className="mx-4">
          <Icon
            icon="mage:trophy-star-fill"
            width="24"
            height="24"
            className={getClassName(isMessagesActive)}
          />
        </Link>
        <Link href="/manager/teams" className="mx-4">
          <Icon
            icon="mage:contact-book-fill"
            width="24"
            height="24"
            className={getClassName(isTeamsActive)}
          />
        </Link>
      </div>
    </div>
  );
}
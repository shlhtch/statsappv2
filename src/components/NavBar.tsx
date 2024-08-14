/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link';
import { Icon } from "@iconify/react";
import useNavigation from '@/hooks/useNavifation';
import { useInitData } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';
import useScrollingEffect from '@/hooks/useScroll';

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
  const scrollDirection = useScrollingEffect(); // Use the custom hook
  const navClass = scrollDirection === "up" ? "" : "opacity-25 duration-500";
  
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
      return isActive ? "text-[#904636]" : "text-[#BAD7D6]";
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

  const getFillColor = (userTeam: string) => {
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

 const fillColor = getFillColor(userTeam); 

	return (
    <div className="relative">
      <img
        src="/navbar.svg"
        alt="Navbar Background"
        className="w-full h-auto"
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
          <svg
            width="52"
            height="52"
            viewBox="0 0 56 56"
            fill={fillColor}
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto pb-2"
          >
            <circle cx="28" cy="28" r="28" fill={fillColor} />
            <path
              d="M16.4972 27.4717C16.4972 28.5802 17.3946 29.4776 18.5032 29.4776H25.8276V36.802C25.8276 37.8974 26.7118 38.808 27.8204 38.808C28.9289 38.808 29.8263 37.8974 29.8263 36.802V29.4776H37.1508C38.2461 29.4776 39.1435 28.5802 39.1435 27.4717C39.1435 26.3763 38.2461 25.4789 37.1508 25.4789H29.8263V18.1545C29.8263 17.0591 28.9289 16.1485 27.8204 16.1485C26.7118 16.1485 25.8276 17.0591 25.8276 18.1545V25.4789H18.5032C17.3946 25.4789 16.4972 26.3763 16.4972 27.4717Z"
              fill="white"
            />
          </svg>
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
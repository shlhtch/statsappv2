"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

const useNavigation = () => {
  const pathname = usePathname();
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isExploreActive, setIsExploreActive] = useState(false);
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);
  const [isMessagesActive, setIsMessagesActive] = useState(false);
  const [isTeamsActive, setIsTeamsActive] = useState(false);

  useEffect(() => {
    setIsHomeActive(false);
    setIsExploreActive(false);
    setIsNotificationsActive(false);
    setIsMessagesActive(false);
    setIsTeamsActive(false);

    switch (pathname) {
      case "/manager/points":
        setIsHomeActive(true);
        break;
      case "/manager/stats":
        setIsExploreActive(true);
        break;
      case "/manager/form":
        setIsNotificationsActive(true);
        break;
      case "/manager/totals":
        setIsMessagesActive(true);
        break;
      case "/manager/teams":
        setIsTeamsActive(true);
        break;
      default:
        break;
    }
  }, [pathname]);

  return {
    isHomeActive,
    isExploreActive,
    isNotificationsActive,
    isMessagesActive,
    isTeamsActive,
  };
};

export default useNavigation;

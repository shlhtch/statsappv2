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
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [isAdminStatsActive, setIsAdminStatsActive] = useState(false);
  const [isAdminPointsActive, setIsAdminPointsActive] = useState(false);
  const [isAdminTotalsActive, setIsAdminTotalsActive] = useState(false);
  const [isUsdActive, setIsUsdActive] = useState(false);

  useEffect(() => {
    setIsHomeActive(false);
    setIsExploreActive(false);
    setIsNotificationsActive(false);
    setIsMessagesActive(false);
    setIsTeamsActive(false);
    setIsAdminActive(false)
    setIsAdminStatsActive(false);
    setIsAdminPointsActive(false);
    setIsAdminTotalsActive(false);
    setIsUsdActive(false);

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
      case "/admin":
        setIsAdminActive(true);
        break;
      case "/admin/stats":
        setIsAdminStatsActive(true);
        break;
      case "/admin/points":
        setIsAdminPointsActive(true);
        break;
      case "/admin/totals":
        setIsAdminTotalsActive(true);
        break;
      case "/admin/usd":
        setIsUsdActive(true);
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
    isAdminActive,
    isAdminStatsActive,
    isAdminPointsActive,
    isAdminTotalsActive,
    isUsdActive,
  };
};

export default useNavigation;

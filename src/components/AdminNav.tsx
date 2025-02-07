/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import useNavigation from "@/hooks/useNavifation";
import { useInitData } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";

export default function AdminBar() {
  const {
    isAdminActive,
    isAdminStatsActive,
    isAdminPointsActive,
    isAdminTotalsActive,
    isUsdActive,
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
      return isActive ? "text-[#FF67DE]" : "text-[#BAD7D6]";
  }

  return (
    <div className={`relative`}>
      <img
        src="/adminbar.svg"
        alt="Admin Background"
        className="w-full h-auto"
      />
      <div className="absolute inset-0 flex justify-center items-center">
        <Link href="/admin" className="mx-4">
          <Icon
            icon="ant-design:file-text-filled"
            width="24"
            height="24"
            className={getClassName(isAdminActive)}
          />
        </Link>
        <Link href="/admin/points" className="mx-4">
          <Icon
            icon="ant-design:frown-filled"
            width="24"
            height="24"
            className={getClassName(isAdminPointsActive)}
          />
        </Link>
        {userTeam && (
          <>
            <Link href="/admin/totals" className="mx-4">
              <Icon
                icon="ant-design:smile-filled"
                width="24"
                height="24"
                className={getClassName(isAdminTotalsActive)}
              />
            </Link>
            <Link href="/admin/usd" className="mx-4">
              <Icon
                icon="ant-design:dollar-circle-filled"
                width="24"
                height="24"
                className={getClassName(isUsdActive)}
              />
            </Link>
          </>
        )}
      </div>
    </div>
  );

}

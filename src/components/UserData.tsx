'use client'

import { useEffect, useState } from "react";
import { useInitData, type User } from "@telegram-apps/sdk-react";
import Link from "next/link";
import { DisplayDataRow } from "@/components/DisplayData/DisplayData";
import { Icon } from '@iconify/react/dist/iconify.js';

export function UserData(user: User): DisplayDataRow[] {
  return [
    { title: "id", value: user.id.toString() },
    { title: "username", value: user.username },
    { title: "photo_url", value: user.photoUrl },
    { title: "last_name", value: user.lastName },
    { title: "first_name", value: user.firstName },
    { title: "is_bot", value: user.isBot },
    { title: "is_premium", value: user.isPremium },
    { title: "language_code", value: user.languageCode },
    { title: "allows_to_write_to_pm", value: user.allowsWriteToPm },
    { title: "added_to_attachment_menu", value: user.addedToAttachmentMenu },
  ];
}

export default function InitDataPage() {
  const initData = useInitData();
  const [roleMessage, setRoleMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const id = initData?.user?.id;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (id) {
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();
        if (data.message) {
          setRoleMessage(data.message);
          const [name, role] = data.message.split(" | ");
          setUserName(name);
          setUserRole(role);
        } else {
          setRoleMessage("Ошибка при загрузке данных");
        }
      } else {
        setRoleMessage("У вас нет доступа");
      }
    };

    fetchUserRole();
  }, [id]);

  if (!userRole && !userName) {
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
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center mb-4">
        <div className="font-montserratAlternates font-normal text-[20px] mb-2">
          {userName}
        </div>
        <div className="font-montserrat font-thin text-[20px] mb-4">
          {userRole}
        </div>
      </div>
      {userRole === "ADMIN" && (
        <Link href="/admin" legacyBehavior>
          <a className="text-white font-semibold font-montserratAlternates text-[14px] rounded-xl bg-[#18238B] w-[247px] h-[48px] flex items-center justify-center transition-all duration-300 hover:w-full">
            Начать
          </a>
        </Link>
      )}
      {(userRole === "MANAGER" || userRole === "TEAMLEAD") && (
        <Link href="/manager" legacyBehavior>
          <a className="text-white font-semibold font-montserratAlternates text-[14px] rounded-xl bg-[#18238B] w-[247px] h-[48px] flex items-center justify-center transition-all duration-300 hover:w-full">
            Начать
          </a>
        </Link>
      )}
    </div>
  );
}
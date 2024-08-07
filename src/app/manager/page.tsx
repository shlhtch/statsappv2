"use client";

import { useInitData } from "@telegram-apps/sdk-react";

// вынести все в компонент
export default function AdminPage() {
  
  const initData = useInitData();
  const id = initData?.user?.id;

  return (
    <div>
      <h1>Все приложение здесь</h1>
      <h1>Вы менеджер/teamlead, id {id}</h1>
    </div>
  );
}

"use client";

import { useInitData } from "@telegram-apps/sdk-react";

// вынести все в компонент
export default function AdminPage() {
  const initData = useInitData();
  const id = initData?.user?.id;
  const name = initData?.user?.firstName;

  return (
    <div>
      <h1>Админ панель здесь</h1>
      <h1>
        Вы {name}, ваш id - {id}
      </h1>
    </div>
  );
}

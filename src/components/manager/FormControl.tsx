"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";

const FormControl: React.FC = () => {
  const [date, setDate] = useState("");
  const [userId, setUserId] = useState(0);
  const [deposits, setDeposits] = useState(0);
  const [redeposits, setRedeposits] = useState(0);
  const [tir1, setTir1] = useState(0);
  const [tir2, setTir2] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const router = useRouter(); // Инициализация useRouter

  // Используем useEffect для установки сегодняшней даты по умолчанию
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setDate(formattedDate);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      date,
      user_id: userId,
      deposits,
      redeposits,
      tir1,
      tir2,
      comment,
    };

    try {
      const response = await fetch("/api/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response:", result);

      // Перенаправление на страницу /manager/stats после успешного создания
      router.push("/manager/stats");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="pb-20 px-5 py-7 rounded-xl">
      <form
        className="bg-[#2F313B] p-4 rounded-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-white text-center mb-4">
          Отчеты
        </h2>
        <div>
          <label className="block text-white mb-2">Дата:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded-md bg-[#2F313B] text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-white mb-2">User ID:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-[#2F313B] text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Депозиты:</label>
          <input
            type="number"
            value={deposits}
            onChange={(e) => setDeposits(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-[#2F313B] text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Редепозиты:</label>
          <input
            type="number"
            value={redeposits}
            onChange={(e) => setRedeposits(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-[#2F313B] text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-white mb-2">TIR 1:</label>
          <input
            type="number"
            value={tir1}
            onChange={(e) => setTir1(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-[#2F313B] text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-white mb-2">TIR 2:</label>
          <input
            type="number"
            value={tir2 === null ? "" : tir2}
            onChange={(e) =>
              setTir2(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2 rounded-md bg-[#2F313B] text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Комментарий:</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 rounded-md bg-[#2F313B] text-white border border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md transition hover:bg-blue-500"
        >
          Отправить
        </button>
      </form>
    </div>
  );
};

export default FormControl;

"use client";

import { useInitData } from '@telegram-apps/sdk-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";

const FormControl: React.FC = () => {
  const initData = useInitData();
  const id = initData?.user?.id;
  const [date, setDate] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [deposits, setDeposits] = useState<number | null>(null);
  const [redeposits, setRedeposits] = useState<number | null>(null);
  const [tir1, setTir1] = useState<number | null>(null);
  const [tir2, setTir2] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [inputErrors, setInputErrors] = useState({
    deposits: "",
    redeposits: "",
    tir1: "",
    tir2: "",
  });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/form/${id}`);
        const result = await response.json();
        setTeamMembers(result.team.members);
      } catch (error) {
        console.error("Ошибка получения участников команды:", error);
      }
    };

    fetchTeamMembers();
  }, [id]);

  const validateInputs = () => {
    const errors = {
      deposits: "",
      redeposits: "",
      tir1: "",
      tir2: "",
    };
    if (deposits !== null && deposits < 0)
      errors.deposits = "Только положительные числа и 0";
    if (redeposits !== null && redeposits < 0)
      errors.redeposits = "Только положительные числа и 0";
    if (tir1 !== null && tir1 < 0)
      errors.tir1 = "Только положительные числа и 0";
    if (tir2 !== null && tir2 < 0)
      errors.tir2 = "Только положительные числа и 0";

    setInputErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<number | null>>,
    value: string
  ) => {
    const numericValue = value === "" ? null : parseFloat(value);
    setter(numericValue);
    validateInputs();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setInputErrors({ deposits: "", redeposits: "", tir1: "", tir2: "" });
    if (!validateInputs()) {
      return;
    }

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
        const result = await response.json();
        if (response.status === 409) {
          setError(result.error || "Конфликт данных!");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Response:", result);
      router.push("/manager/teams");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="pb-24 px-4 sm:px-6 lg:px-8 py-7 rounded-xl max-w-3xl mx-auto">
      <form
        className="bg-[#2F313B] p-4 rounded-md space-y-4 h-[465px] overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl text-white text-center mb-4 font-montserratAlternates font-semibold text-[16px]">
          Отчет
        </h2>
        <div>
          <label className="block text-white font-montserratAlternates font-normal text-[14px]">
            Дата
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded-md bg-[#2F313B] text-gray-400 border border-gray-600 font-montserratAlternates font-medium text-[13px]"
          />
          {error && <p className="text-red-500 mt-1">{error}</p>}
        </div>
        <div>
          <label className="block text-white font-montserratAlternates font-normal text-[14px]">
            Менеджер
          </label>
          <select
            value={userId || ""}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-[#2F313B] text-gray-400 border border-gray-600 font-montserratAlternates font-medium text-[13px]"
          >
            <option value="" disabled>
              Выберите менеджера
            </option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white font-montserratAlternates font-normal text-[14px]">
            Количество депов
          </label>
          <input
            type="number"
            value={deposits === null ? "" : deposits}
            onChange={(e) => handleInputChange(setDeposits, e.target.value)}
            className={`w-full p-2 rounded-md bg-[#2F313B] text-white border ${
              inputErrors.deposits ? "border-red-500" : "border-gray-600"
            }`}
          />
          {inputErrors.deposits && (
            <p className="text-red-500 mt-1">{inputErrors.deposits}</p>
          )}
        </div>
        <div>
          <label className="block text-white font-montserratAlternates font-normal text-[14px]">
            Количество додепов
          </label>
          <input
            type="number"
            value={redeposits === null ? "" : redeposits}
            onChange={(e) => handleInputChange(setRedeposits, e.target.value)}
            className={`w-full p-2 rounded-md bg-[#2F313B] text-white border ${
              inputErrors.redeposits ? "border-red-500" : "border-gray-600"
            }`}
          />
          {inputErrors.redeposits && (
            <p className="text-red-500 mt-1">{inputErrors.redeposits}</p>
          )}
        </div>
        <div>
          <label className="block text-white font-montserratAlternates font-normal text-[14px]">
            Tir1
          </label>
          <input
            type="number"
            value={tir1 === null ? "" : tir1}
            onChange={(e) => handleInputChange(setTir1, e.target.value)}
            className={`w-full p-2 rounded-md bg-[#2F313B] text-white border ${
              inputErrors.tir1 ? "border-red-500" : "border-gray-600"
            }`}
          />
          {inputErrors.tir1 && (
            <p className="text-red-500 mt-1 font-montserratAlternates font-normal text-[14px]">
              {inputErrors.tir1}
            </p>
          )}
        </div>
        <div>
          <label className="block text-white font-montserratAlternates font-normal text-[14px]">
            Tir2
          </label>
          <input
            type="number"
            value={tir2 === null ? "" : tir2}
            onChange={(e) => handleInputChange(setTir2, e.target.value)}
            className={`w-full p-2 rounded-md bg-[#2F313B] text-white border ${
              inputErrors.tir2 ? "border-red-500" : "border-gray-600"
            }`}
          />
          {inputErrors.tir2 && (
            <p className="text-red-500 mt-1 font-montserratAlternates">
              {inputErrors.tir2}
            </p>
          )}
        </div>
        <div>
          <label className="block text-white font-montserratAlternates font-normal text-[14px]">
            Отчет
          </label>
          <textarea
            value={comment}
            placeholder="Сегодня я накосячил 3 раза. Сегодня я накосячил 3 раза. Сегодня я накосячил 3 раза."
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 rounded-md bg-[#2F313B] text-white border border-gray-600 font-montserratAlternates"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-[#461799] text-white w-full rounded-xl transition hover:bg-gray-600 font-montserratAlternates"
        >
          Добавить отчет
        </button>
      </form>
    </div>
  );
};

export default FormControl;

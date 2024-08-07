'use client';

import { useEffect, useState } from 'react';
import { useInitData, type User } from '@telegram-apps/sdk-react';
import Link from 'next/link';
import { DisplayDataRow } from '@/components/DisplayData/DisplayData';

// вынести все в компонент
function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: 'id', value: user.id.toString() },
    { title: 'username', value: user.username },
    { title: 'photo_url', value: user.photoUrl },
    { title: 'last_name', value: user.lastName },
    { title: 'first_name', value: user.firstName },
    { title: 'is_bot', value: user.isBot },
    { title: 'is_premium', value: user.isPremium },
    { title: 'language_code', value: user.languageCode },
    { title: 'allows_to_write_to_pm', value: user.allowsWriteToPm },
    { title: 'added_to_attachment_menu', value: user.addedToAttachmentMenu },
  ];
}

export default function InitDataPage() {
    const initData = useInitData();
    const [roleMessage, setRoleMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const id = initData?.user?.id;
  
    useEffect(() => {
      const fetchUserRole = async () => {
        if (id) {
          const response = await fetch(`/api/users/${id}`);
          const data = await response.json();
          if (data.message) {
            setRoleMessage(data.message);
            const [name, role] = data.message.split(' | ');
            setUserRole(role);
          } else {
            setRoleMessage('Ошибка при загрузке данных');
          }
        } else {
          setRoleMessage('У вас нет доступа');
        }
      };
  
      fetchUserRole();
    }, [id]);
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className='text-center mb-4 text-[#33d17a] font-bold'>{roleMessage}</div>
        {userRole === 'ADMIN' && (
          <Link href="/admin" className="rounded-sm bg-[#33d17a] w-1/5 h-[10%] flex items-center justify-center hover:w-full transition-all duration-300">
            <div className="text-white font-bold">Вход</div>
          </Link>
        )}
        {(userRole === 'MANAGER' || userRole === 'TEAMLEAD') && (
          <Link href="/manager" className="rounded-sm bg-[#33d17a] w-1/5 h-[10%] flex items-center justify-center hover:w-full transition-all duration-300">
            <div className="text-white font-bold">Вход</div>
          </Link>
        )}
      </div>
    );
  }
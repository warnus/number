import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { parseTicketUrl } from '../utils/crypto';

export default function TicketPage() {
  const location = useLocation();
  const { token: urlToken } = useParams<{ token?: string }>();
  const searchParams = new URLSearchParams(location.search);
  const queryToken = searchParams.get('token') || '';
  
  let ticketNum: number | null = null;
  try {
    // If token exists in URL params, use it directly
    if (urlToken) {
      ticketNum = parseTicketUrl(`?token=${urlToken}`);
    } else if (queryToken) {
      ticketNum = parseTicketUrl(location.search);
    }
  } catch (error) {
    console.error('Ticket parsing error:', error);
    ticketNum = null;
  }
  const currentNumber = React.useMemo(() =>
    Number(localStorage.getItem('currentNumber') || '0'),
    []
  );

  if (!ticketNum || ticketNum <= 0) {
    return <div className="p-6 max-w-md mx-auto mt-20 border rounded shadow">잘못된 접근입니다.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-4">번호표 확인</h1>
      <p className="mb-2 text-lg">내 번호: <span className="font-extrabold">#{ticketNum}</span></p>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">당신의 번호</h2>
        <p className="text-3xl font-bold text-blue-600">#{ticketNum}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">현재 처리 번호</h2>
        <p className="text-3xl font-bold text-blue-600">#{currentNumber}</p>
      </div>

      {ticketNum === currentNumber ? (
        <p className="text-green-600 font-semibold">곧 차례입니다!</p>
      ) : ticketNum < currentNumber ? (
        <p className="text-gray-500">이미 처리된 번호입니다.</p>
      ) : (
        <p className="text-blue-600">대기 중입니다.</p>
      )}
    </div>
  );
}

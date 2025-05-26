import { useLocation, useParams } from 'react-router-dom';
import { parseTicketUrl } from '../utils/crypto';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function TicketPage() {
  const location = useLocation();
  const { token: urlToken } = useParams<{ token?: string }>();

  let ticketInfo: { number: number | null, timestamp: number | null } = { number: null, timestamp: null };
  try {
    // If token exists in URL params, use it directly
    if (urlToken) {
      ticketInfo = parseTicketUrl(`?token=${urlToken}`);
    } else {
      ticketInfo = parseTicketUrl(location.search);
    }
  } catch (error) {
    console.error('Ticket parsing error:', error);
    ticketInfo = { number: null, timestamp: null };
  }

  const formattedTimestamp = ticketInfo.timestamp ? format(ticketInfo.timestamp, 'yyyy년 MM월 dd일 HH:mm:ss', { locale: ko }) : '발급 시간 정보 없음';

  if (!ticketInfo.number || ticketInfo.number <= 0) {
    return <div className="p-6 max-w-md mx-auto mt-20 border rounded shadow">잘못된 접근입니다.</div>;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-gray-200 relative overflow-hidden">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">번호표</h1>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-gray-100 to-transparent opacity-20"></div>
        </div>
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">고객님의 번호</h2>
            <div className="relative">
              <p className="text-6xl font-bold text-blue-700 mb-4">#{ticketInfo.number}</p>
            </div>
            <p className="text-lg text-gray-600 mb-6">기다려 주셔서 감사합니다.</p>
          </div>
          <div className="text-center">
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">발급 시간: {formattedTimestamp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">번호표 확인</h1>
        </div>
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">고객님의 번호</h2>
            <p className="text-5xl font-bold text-blue-600">#{ticketInfo.number}</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">발급 시간</h2>
            <p className="text-lg text-gray-600">{formattedTimestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

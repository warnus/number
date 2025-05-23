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

  if (!ticketNum || ticketNum <= 0) {
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
            <h2 className="text-xl font-semibold mb-2">당신의 번호</h2>
            <p className="text-5xl font-bold text-blue-600">#{ticketNum}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

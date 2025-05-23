import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { generateTicketUrl } from '../utils/crypto';

export default function AdminPage() {
  const navigate = useNavigate();
  const [currentNumber, setCurrentNumber] = React.useState<number>(() =>
    Number(localStorage.getItem('currentNumber') || '0')
  );
  const [lastIssuedNumber, setLastIssuedNumber] = React.useState<number>(() =>
    Number(localStorage.getItem('lastIssuedNumber') || '0')
  );

  const handleNextNumber = () => {
    setCurrentNumber(prev => {
      const next = prev + 1;
      localStorage.setItem('currentNumber', next.toString());
      return next;
    });
  };

  const handleIssueNumber = () => {
    setLastIssuedNumber(prev => {
      const next = prev + 1;
      localStorage.setItem('lastIssuedNumber', next.toString());
      return next;
    });
  };

  const qrUrl = generateTicketUrl(lastIssuedNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">현재 번호</h2>
          <p className="text-3xl font-bold text-blue-600">#{currentNumber}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">마지막 발급 번호</h2>
          <p className="text-3xl font-bold text-blue-600">#{lastIssuedNumber}</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleNextNumber}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            다음 번호 호출
          </button>
          <button
            onClick={handleIssueNumber}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            번호 발급
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('isAdmin');
              navigate('/');
            }}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            로그아웃
          </button>
        </div>
        {lastIssuedNumber > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">QR 코드</h2>
            <QRCodeSVG value={qrUrl} size={180} className="mx-auto" />
          </div>
        ) : (
          <p className="text-gray-500 mt-8">번호를 먼저 발급하세요.</p>
        )}
      </div>
    </div>
  );
}

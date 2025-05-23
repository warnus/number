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
  const [qrUrl, setQrUrl] = React.useState<string>('');

  React.useEffect(() => {
    const initialQrUrl = generateTicketUrl(lastIssuedNumber);
    setQrUrl(initialQrUrl);
  }, [lastIssuedNumber]);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">관리자 페이지</h1>
          <p className="text-xl text-gray-600">마지막 발급 번호: <span className="text-2xl font-bold text-blue-600">#{lastIssuedNumber}</span></p>
        </div>
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">현재 번호</h2>
            <p className="text-5xl font-bold text-blue-600">#{currentNumber}</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">마지막 발급 번호</h2>
            <p className="text-5xl font-bold text-blue-600">#{lastIssuedNumber}</p>
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <button
            onClick={() => {
              // Update current number (processing completed)
              const nextNumber = currentNumber + 1;
              if (nextNumber <= lastIssuedNumber) {
                localStorage.setItem('currentNumber', nextNumber.toString());
                setCurrentNumber(nextNumber);
              } else {
                alert('마지막 발급 번호를 초과할 수 없습니다.');
              }
            }}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
          >
            다음 번호 호출
          </button>
          <button
            onClick={() => {
              // Issue new number
              const newNumber = lastIssuedNumber + 1;
              localStorage.setItem('lastIssuedNumber', newNumber.toString());
              setLastIssuedNumber(newNumber);
              
              // Generate new QR code
              const qrUrl = generateTicketUrl(newNumber);
              setQrUrl(qrUrl);
            }}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-semibold"
          >
            번호 발급
          </button>
          <button
            onClick={() => {
              if (window.confirm('모든 번호를 초기화하시겠습니까?')) {
                localStorage.setItem('currentNumber', '0');
                localStorage.setItem('lastIssuedNumber', '0');
                setCurrentNumber(0);
                setLastIssuedNumber(0);
                setQrUrl('');
              }
            }}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            번호 초기화
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

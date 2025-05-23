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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const [tempCurrentNumber, setTempCurrentNumber] = React.useState<number | null>(currentNumber || null);
  const [tempLastIssuedNumber, setTempLastIssuedNumber] = React.useState<number | null>(lastIssuedNumber || null);

  React.useEffect(() => {
    setTempCurrentNumber(currentNumber);
    setTempLastIssuedNumber(lastIssuedNumber);
  }, [currentNumber, lastIssuedNumber]);

  React.useEffect(() => {
    const initialQrUrl = generateTicketUrl(lastIssuedNumber);
    setQrUrl(initialQrUrl);
  }, [lastIssuedNumber]);

  const handleSaveSettings = () => {
    if (tempCurrentNumber !== null && tempLastIssuedNumber !== null && tempCurrentNumber > tempLastIssuedNumber) {
      alert('현재 번호는 마지막 발급 번호보다 클 수 없습니다.');
      return;
    }
    
    if (tempCurrentNumber !== null && tempLastIssuedNumber !== null) {
      localStorage.setItem('currentNumber', tempCurrentNumber.toString());
      localStorage.setItem('lastIssuedNumber', tempLastIssuedNumber.toString());
    }
    if (tempCurrentNumber !== null && tempLastIssuedNumber !== null) {
      setCurrentNumber(tempCurrentNumber);
      setLastIssuedNumber(tempLastIssuedNumber);
    }
    setIsSettingsModalOpen(false);
  };

  const handleCancelSettings = () => {
    setIsSettingsModalOpen(false);
    setTempCurrentNumber(currentNumber);
    setTempLastIssuedNumber(lastIssuedNumber);
  };

  return (
    <>
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">관리자 페이지</h1>
              <p className="text-xl text-gray-600">마지막 발급 번호: <span className="text-2xl font-bold text-blue-600">#{lastIssuedNumber}</span></p>
            </div>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
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
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">번호 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">현재 번호</label>
                <input
                  type="number"
                  value={tempCurrentNumber ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setTempCurrentNumber(null);
                    } else {
                      setTempCurrentNumber(Number(value));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">마지막 발급 번호</label>
                <input
                  type="number"
                  value={tempLastIssuedNumber ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setTempLastIssuedNumber(null);
                    } else {
                      setTempLastIssuedNumber(Number(value));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancelSettings}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

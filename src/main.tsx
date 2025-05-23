// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './index.css';

const ADMIN_ID = 'admin';
const ADMIN_PW = 'admin1234';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function LoginPage() {
  const [id, setId] = React.useState('');
  const [pw, setPw] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (id === ADMIN_ID && pw === ADMIN_PW) {
      localStorage.setItem('isAdmin', 'true');
      // 로그인 성공하면 /admin으로 이동
      navigate('/admin');
    } else {
      alert('로그인 실패');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">관리자 로그인</h1>
      <input
        className="w-full p-2 border mb-3"
        placeholder="ID"
        value={id}
        onChange={e => setId(e.target.value)}
      />
      <input
        type="password"
        className="w-full p-2 border mb-3"
        placeholder="PW"
        value={pw}
        onChange={e => setPw(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        로그인
      </button>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const [currentNumber, setCurrentNumber] = React.useState(() =>
    Number(localStorage.getItem('currentNumber') || '0')
  );
  const [lastIssuedNumber, setLastIssuedNumber] = React.useState(() =>
    Number(localStorage.getItem('lastIssuedNumber') || '0')
  );

  React.useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      navigate('/login');
    }
  }, [navigate]);

  const issueNextNumber = () => {
    const next = lastIssuedNumber + 1;
    localStorage.setItem('lastIssuedNumber', String(next));
    setLastIssuedNumber(next);
  };

  const processNextNumber = () => {
    if (currentNumber < lastIssuedNumber) {
      const next = currentNumber + 1;
      localStorage.setItem('currentNumber', String(next));
      setCurrentNumber(next);
    }
  };

  const qrUrl = `${window.location.origin}/ticket?num=${lastIssuedNumber}`;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">관리자 페이지</h1>
      <div className="mb-4">
        <p>현재 처리 번호: <span className="font-bold">{currentNumber}</span></p>
        <p>마지막 배부 번호: <span className="font-bold">{lastIssuedNumber}</span></p>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={issueNextNumber}
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          다음 번호 발급
        </button>
        <button
          onClick={processNextNumber}
          className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
          disabled={currentNumber >= lastIssuedNumber}
          title={currentNumber >= lastIssuedNumber ? '더 이상 처리할 번호가 없습니다.' : ''}
        >
          다음 번호 처리
        </button>
      </div>
      <div className="mb-4">
        <p className="mb-2">마지막 배부된 번호 QR 코드:</p>
        {lastIssuedNumber > 0 ? (
          <QRCodeSVG value={qrUrl} size={180} />
        ) : (
          <p className="text-gray-500">번호를 먼저 발급하세요.</p>
        )}
      </div>
      <button
        onClick={() => {
          localStorage.removeItem('isAdmin');
          navigate('/login');
        }}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        로그아웃
      </button>
    </div>
  );
}

function TicketPage() {
  const query = useQuery();
  const num = Number(query.get('num'));
  const [currentNumber, setCurrentNumber] = React.useState(() =>
    Number(localStorage.getItem('currentNumber') || '0')
  );
  const [lastIssuedNumber] = React.useState(() =>
    Number(localStorage.getItem('lastIssuedNumber') || '0')
  );

  if (!num) {
    return <div className="p-6 max-w-md mx-auto mt-20 border rounded shadow">잘못된 접근입니다.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-4">번호표 확인</h1>
      <p className="mb-2 text-lg">내 번호: <span className="font-extrabold">{num}</span></p>
      <p className="mb-2">현재 처리 번호: <span>{currentNumber}</span></p>
      <p className="mb-4">마지막 배부 번호: <span>{lastIssuedNumber}</span></p>

      {num === currentNumber ? (
        <p className="text-green-600 font-semibold">곧 차례입니다!</p>
      ) : num < currentNumber ? (
        <p className="text-gray-500">이미 처리된 번호입니다.</p>
      ) : (
        <p className="text-blue-600">대기 중입니다.</p>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/ticket" element={<TicketPage />} />
        <Route path="*" element={<div className="p-6">페이지를 찾을 수 없습니다.</div>} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './index.css';

// Add types for URLSearchParams
interface URLSearchParams {
  get(key: string): string | null;
}

// Add types for React components
interface LoginPageState {
  id: string;
  pw: string;
}

const ADMIN_ID = 'admin' as const;
const ADMIN_PW = 'admin1234' as const;

function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

const LoginPage: React.FC = () => {
  const [state, setState] = React.useState<LoginPageState>({ id: '', pw: '' });
  const navigate = useNavigate();

  const handleLogin = (): void => {
    if (state.id === ADMIN_ID && state.pw === ADMIN_PW) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      alert('로그인 실패');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={state.id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="pw" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                id="pw"
                name="pw"
                value={state.pw}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const currentNumber = React.useMemo(() =>
    Number(localStorage.getItem('currentNumber') || '0'),
    []
  );
  const [lastIssuedNumber, setLastIssuedNumber] = React.useState<number>(() =>
    Number(localStorage.getItem('lastIssuedNumber') || '0')
  );

  React.useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleNextNumber = () => {
    localStorage.setItem('currentNumber', (currentNumber + 1).toString());
  };

  const handleIssueNumber = () => {
    setLastIssuedNumber(prev => {
      const next = prev + 1;
      localStorage.setItem('lastIssuedNumber', next.toString());
      return next;
    });
  };

  const qrUrl = `${window.location.origin}/ticket?num=${lastIssuedNumber}`;

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
        <div className="mt-8">
          {lastIssuedNumber > 0 ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">QR 코드</h2>
              <QRCodeSVG value={qrUrl} size={180} className="mx-auto" />
            </div>
          ) : (
            <p className="text-gray-500">번호를 먼저 발급하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};

function TicketPage() {
  const query = useQuery();
  const num = Number(query.get('num'));
  const currentNumber = React.useMemo(() =>
    Number(localStorage.getItem('currentNumber') || '0'),
    []
  );
  const lastIssuedNumber = React.useMemo(() =>
    Number(localStorage.getItem('lastIssuedNumber') || '0'),
    []
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
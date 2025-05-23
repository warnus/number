import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('isAdmin', 'true');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">로그인</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="관리자 ID"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

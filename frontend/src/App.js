import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPage from './Components/ChatPage';
import ErrorPage from './Components/ErrorPage';
import LoginPage from './Components/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* подстановочный путь */}
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<ChatPage />} />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
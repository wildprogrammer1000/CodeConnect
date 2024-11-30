import { Route, Routes } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import MyPage from "./MyPage";
import RegisterProjectPage from "./RegisterProjectPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-project" element={<RegisterProjectPage />} />
    </Routes>
  );
};

export default App;

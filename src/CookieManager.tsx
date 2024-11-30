import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SERVER_URL } from "./variables";
import { useUser } from "./context/UserContext";

const CookieManager = () => {
  const location = useLocation();
  const { setUser } = useUser();

  const checkCookie = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/user`, {
        withCredentials: true,
      });
      setUser(response.data.user); // 사용자 정보 상태 업데이트
    } catch (error) {
      console.error("사용자 정보 조회 오류:", error);
      setUser(null); // 사용자 상태 초기화
    }
  };
  useEffect(() => {
    checkCookie();
  }, [location]);
  return null;
};

export default CookieManager;

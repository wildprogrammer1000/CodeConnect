import { Container, Typography, Button, Box } from "@mui/material";
import { useUser } from "./context/UserContext"; // UserContext 사용
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./context/SnackbarContext";
import axios from "axios"; // Axios 추가
import { SERVER_URL } from "./variables"; // 서버 URL 가져오기
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const MyPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // 현재 사용자 정보와 setUser 가져오기
  const { showSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${SERVER_URL}/api/logout`,
        {},
        { withCredentials: true }
      ); // 로그아웃 API 호출
      setUser(null); // 사용자 상태 초기화
      showSnackbar("로그아웃 성공", "success");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      showSnackbar("로그아웃 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        <Button onClick={() => navigate(-1)}>
          <ChevronLeftIcon />
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1, textAlign: "left", ml: 2 }}>
          마이페이지
        </Typography>
      </Box>
      {user ? (
        <div>
          <Typography variant="h6">사용자 ID: {user.user_id}</Typography>
          <Typography variant="h6">닉네임: {user.nickname}</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      ) : (
        <Typography variant="h6">
          로그인 후 사용자 정보를 확인할 수 있습니다.
        </Typography>
      )}
    </Container>
  );
};

export default MyPage;

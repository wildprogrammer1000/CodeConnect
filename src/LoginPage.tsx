import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { useSnackbar } from "./context/SnackbarContext"; // SnackbarContext 가져오기
import axios from "axios"; // Axios 라이브러리 추가
import { SERVER_URL } from "./variables"; // variables 파일에서 SERVER_URL 가져오기

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { showSnackbar } = useSnackbar(); // 스낵바 사용

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 로그인 API 호출
      const response = await axios.post(
        `${SERVER_URL}/api/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      // 로그인 성공 시 사용자 정보 저장
      const user = response.data.user;
      setUser(user); // 글로벌 상태에 사용자 정보 저장

      // 스낵바 메시지 설정 및 열기
      showSnackbar("로그인에 성공했습니다!", "success");

      // 메인 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("로그인 오류:", error);
      showSnackbar("로그인에 실패했습니다.", "error"); // 오류 메시지 설정
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        로그인 페이지
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="사용자 아이디"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="비밀번호"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          로그인
        </Button>
        <Box mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/register")} // 회원가입 페이지로 이동
          >
            회원가입
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default LoginPage;

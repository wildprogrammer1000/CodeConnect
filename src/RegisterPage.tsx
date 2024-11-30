import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import axios from "axios"; // Axios 라이브러리 추가
import { SERVER_URL } from "./variables"; // variables 파일에서 SERVER_URL 가져오기
import { useSnackbar } from "./context/SnackbarContext";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false); // 아이디 중복 체크 상태
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [usernameError, setUsernameError] = useState(""); // 아이디 중복 오류 메시지 상태
  const [nicknameError, setNicknameError] = useState(""); // 닉네임 오류 메시지 상태
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 오류 메시지 상태
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 규칙 검사
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // 영문자와 숫자를 포함하고 8자 이상
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "비밀번호는 영문자와 숫자를 포함하여 8자 이상이어야 합니다."
      );
      return;
    } else {
      setPasswordError(""); // 비밀번호 오류 메시지 초기화
    }

    // 회원가입 API 호출
    try {
      const response = await axios.post(`${SERVER_URL}/api/register`, {
        username,
        password,
        nickname,
      });

      // 회원가입 성공 시 사용자 정보 저장
      const newUser = response.data.user;
      setUser(newUser); // 글로벌 상태에 사용자 정보 저장

      // Snackbar 메시지 설정 및 열기

      // 메인 페이지로 이동
      navigate("/");
      showSnackbar("회원가입 성공", "success");
    } catch (error) {
      console.error("회원가입 오류:", error);
      setUsernameError("회원가입에 실패했습니다."); // 오류 메시지 설정
    }
  };

  const validateUsername = (username: string) => {
    if (username.length < 8) {
      setUsernameError("아이디는 8자 이상이어야 합니다."); // 오류 메시지 설정
      setIsUsernameAvailable(false);
      return false;
    } else {
      setUsernameError(""); // 오류 메시지 초기화
      return true;
    }
  };

  const checkUsernameAvailability = () => {
    if (validateUsername(username)) {
      // 아이디 중복 체크 로직 (예: API 호출 등)
      const existingUsernames = ["existingUser1", "existingUser2"]; // 예시 기존 사용자 이름
      if (existingUsernames.includes(username)) {
        setIsUsernameAvailable(false);
        setUsernameError("이미 사용 중인 아이디입니다."); // 오류 메시지 설정
      } else {
        setIsUsernameAvailable(true);
        setUsernameError(""); // 오류 메시지 초기화
        alert("사용 가능한 아이디입니다.");
      }
    }
  };

  const checkNicknameAvailability = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/check-nickname`, {
        nickname,
      });
      if (response.data.available) {
        setIsNicknameAvailable(true);
        setNicknameError(""); // 오류 메시지 초기화
        alert(response.data.message);
      } else {
        setIsNicknameAvailable(false);
        setNicknameError(response.data.message); // 오류 메시지 설정
      }
    } catch (error) {
      console.error("닉네임 중복 체크 오류:", error);
      setNicknameError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        회원가입 페이지
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Box display="flex" alignItems="center">
            <TextField
              label="사용자 이름"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={checkUsernameAvailability} // 아이디 중복 체크
            >
              중복 확인
            </Button>
          </Box>
          {usernameError && (
            <Typography color="error" variant="body2">
              {usernameError}
            </Typography>
          )}
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
          <Typography variant="body2" color="textSecondary">
            비밀번호는 영문자와 숫자를 포함하여 8자 이상이어야 합니다.
          </Typography>
          {passwordError && (
            <Typography color="error" variant="body2">
              {passwordError}
            </Typography>
          )}
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="닉네임"
            variant="outlined"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={checkNicknameAvailability} // 닉네임 중복 체크
          >
            중복 확인
          </Button>
          {nicknameError && (
            <Typography color="error" variant="body2">
              {nicknameError}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!isUsernameAvailable || !isNicknameAvailable}
        >
          회원가입
        </Button>
      </form>
    </Container>
  );
};

export default RegisterPage;

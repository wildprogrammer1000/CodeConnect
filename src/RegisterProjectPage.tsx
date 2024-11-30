import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProjectForm } from "./types";
import { useUser } from "./context/UserContext";
import { useSnackbar } from "./context/SnackbarContext";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "./variables";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const RegisterProjectPage = () => {
  const { user } = useUser();
  const { showSnackbar } = useSnackbar();
  const [, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { projectId: number | null };
    if (state && state.projectId) {
      const fetchProject = async () => {
        try {
          const response = await axios.get(
            `${SERVER_URL}/api/projects/${state.projectId}`
          );
          const project = response.data.project;

          setTitle(project.title);
          setUrl(project.url);
          setDescription(project.description);
          setThumbnailPreview(project.thumbnail);
        } catch (error) {
          console.error("프로젝트 조회 오류:", error);
          showSnackbar("프로젝트를 불러오는 데 오류가 발생했습니다.", "error");
        }
      };
      fetchProject();
    }
  }, [location.state, showSnackbar]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const isValidURL = (url: string): boolean => {
    const urlPattern =
      /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
    return urlPattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showSnackbar("로그인이 필요합니다.", "warning");
      navigate("/login");
      return;
    }

    if (!isValidURL(url)) {
      showSnackbar("유효한 URL 형식이 아닙니다.", "error");
      return;
    }

    const newProject: ProjectForm = {
      id:
        location.state && location.state.projectId
          ? location.state.projectId
          : null,
      title,
      user_id: user.user_id,
      url,
      thumbnail: thumbnailPreview || "",
      description,
    };

    try {
      if (location.state && location.state.projectId) {
        // 수정 모드일 경우 PUT 요청
        await axios.put(
          `${SERVER_URL}/api/projects/${location.state.projectId}`,
          newProject
        );
        showSnackbar("프로젝트 수정 성공!", "success");
      } else {
        // 등록 모드일 경우 POST 요청
        await axios.post(`${SERVER_URL}/api/projects`, newProject);
        showSnackbar("프로젝트 등록 성공!", "success");
      }

      navigate("/");
    } catch (error) {
      console.error("프로젝트 등록/수정 오류:", error);
      showSnackbar("프로젝트 등록/수정 오류!", "error");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center" mb={2}>
        <Button onClick={() => navigate(-1)}>
          <ChevronLeftIcon />
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1, textAlign: "left", ml: 2 }}>
          프로젝트{" "}
          {location.state && location.state.projectId ? "수정" : "등록"}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="thumbnail-upload"
            type="file"
            onChange={handleThumbnailChange}
          />
          {thumbnailPreview && (
            <Avatar
              alt="썸네일 미리보기"
              src={thumbnailPreview}
              sx={{ width: 100, height: 100, mt: 2 }}
            />
          )}
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="이름"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="프로젝트 URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="프로젝트 설명"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          {location.state && location.state.projectId ? "수정" : "등록"}
        </Button>
      </form>
    </Container>
  );
};

export default RegisterProjectPage;
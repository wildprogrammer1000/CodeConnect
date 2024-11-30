import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Project } from "./types";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSnackbar } from "./context/SnackbarContext";
import { useUser } from "./context/UserContext";
import { SERVER_URL } from "./variables";
import axios from "axios";
import ProjectComment from "./components/ProjectComment";

const MainPage = () => {
  const { user } = useUser();
  const { showSnackbar } = useSnackbar();
  const [projects, setProjects] = useState<Project[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const navigate = useNavigate();

  // 댓글 입력 폼의 노출 상태를 관리하는 객체
  const [commentVisible, setCommentVisible] = useState<{
    [key: number]: boolean;
  }>({});

  // 프로젝트 목록을 가져오는 함수
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/projects`, {
        withCredentials: true,
      });
      setProjects(response.data.projects); // 프로젝트 목록 업데이트
    } catch (error) {
      console.error("프로젝트 목록 조회 오류:", error);
    }
  };
  const handleLike = async (projectId: number, liked: boolean) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/like`,
        {
          projectId,
          liked,
        },
        { withCredentials: true }
      );

      const project = response.data.project;

      // 요청 처리 성공 시 해당 프로젝트의 liked 상태 업데이트
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, liked: project.liked, like_count: project.like_count }
            : p
        )
      );
    } catch (error) {
      showSnackbar("로그인이 필요합니다.", "error");
      console.error("좋아요 토글 오류:", error);
    }
  };

  const toggleCommentInput = (projectId: number) => {
    setCommentVisible((prev) => ({
      ...prev,
      [projectId]: !prev[projectId], // 해당 프로젝트의 댓글 입력 폼 노출 상태 토글
    }));
  };
  // 컴포넌트가 마운트될 때 프로젝트 목록을 가져옴
  useEffect(() => {
    fetchProjects();
  }, []);

  // 메뉴 아이콘 클릭 시 메뉴 열기
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    projectId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(projectId);
  };

  // 메뉴 닫기
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  // 수정 버튼 클릭 시 처리
  const handleEdit = () => {
    if (selectedProject) {
      navigate(`/register-project`, {
        state: { projectId: selectedProject },
      });
    }
    handleClose();
  };

  // 삭제 버튼 클릭 시 처리
  const handleDelete = async () => {
    if (selectedProject) {
      try {
        await axios.delete(`${SERVER_URL}/api/projects/${selectedProject}`);
        // 프로젝트 목록을 다시 가져와서 상태 업데이트
        fetchProjects();
        showSnackbar("프로젝트를 삭제했어요.", "success");
      } catch (error) {
        console.error("프로젝트 삭제 오류:", error);
      }
    }
    handleClose();
  };

  // 프로젝트 정보 업데이트 함수
  const updateProjectData = async (projectId: number) => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/projects/${projectId}`,
        {
          withCredentials: true,
        }
      );
      const updatedProject = response.data.project;

      // 프로젝트 목록에서 해당 프로젝트 업데이트
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === updatedProject.id
            ? { ...p, comment_count: updatedProject.comment_count }
            : p
        )
      );
    } catch (error) {
      console.error("프로젝트 정보 업데이트 오류:", error);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Code Connect
        </Typography>
        <div className="buttons">
          {user ? (
            <Link to="/mypage">
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                마이페이지
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                로그인
              </Button>
            </Link>
          )}
          {user && (
            <Link to="/register-project">
              <Button variant="contained" color="secondary">
                프로젝트 등록
              </Button>
            </Link>
          )}
        </div>
      </Box>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={
                  project.thumbnail
                    ? project.thumbnail
                    : "https://placehold.co/600x400"
                }
                alt={`${project.title} 썸네일`}
              />
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Button
                      color="primary"
                      onClick={() => handleLike(project.id, project.liked)}
                      sx={{ borderRadius: "50%" }}
                    >
                      {project.liked ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                      {project.like_count}
                    </Button>
                    <Button
                      onClick={() => toggleCommentInput(project.id)}
                      startIcon={<CommentIcon />}
                    >
                      {project.comment_count}
                    </Button>
                  </Box>
                  {user?.user_id === project.user_id && (
                    <IconButton onClick={(e) => handleMenuClick(e, project.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="h6">{project.title}</Typography>
                <Typography color="textSecondary">
                  작성자: {project.nickname}
                </Typography>
                <Typography color="textSecondary">
                  날짜: {project.created_at}
                </Typography>
                {/* <Typography>댓글 수: {project.comments}</Typography> */}
              </CardContent>
              <CardContent>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => window.open(project.url, "_blank")}
                >
                  구경하기
                </Button>

                <Box mt={2}>
                  {commentVisible[project.id] && (
                    <ProjectComment
                      projectId={project.id}
                      onUpdateProject={() => updateProjectData(project.id)} // 콜백 전달
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedProject === project.id}
              onClose={handleClose}
            >
              <MenuItem onClick={handleEdit}>수정</MenuItem>
              <MenuItem onClick={handleDelete}>삭제</MenuItem>
            </Menu>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MainPage;

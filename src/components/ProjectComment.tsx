import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useSnackbar } from "../context/SnackbarContext";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { SERVER_URL } from "../variables";
import { useUser } from "../context/UserContext";
import SendIcon from "@mui/icons-material/Send";
import { Comment } from "../types";

interface ProjectCommentProps {
  projectId: number;
  onUpdateProject: () => void;
}

const ProjectComment: React.FC<ProjectCommentProps> = ({
  projectId,
  onUpdateProject,
}) => {
  const { user } = useUser();
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { showSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(
    null
  );

  // 댓글 목록 조회
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/comments/${projectId}`,
        {
          withCredentials: true,
        }
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("댓글 목록 조회 오류:", error);
      showSnackbar("댓글 목록을 가져오는 데 실패했습니다.", "error");
    }
  };

  // 댓글 추가
  const handleCommentSubmit = async () => {
    if (!user) return showSnackbar("로그인이 필요합니다.", "warning");
    if (!comment.trim()) {
      showSnackbar("댓글 내용을 입력하세요.", "warning");
      return;
    }
    if (comment.length > 300) {
      // 글자 수 제한 체크
      showSnackbar("댓글은 300자 이내로 작성해야 합니다.", "warning");
      return;
    }

    try {
      await axios.post(`${SERVER_URL}/api/comments`, {
        projectId,
        userId: user.user_id,
        content: comment,
      });
      setComment(""); // 입력 필드 초기화
      showSnackbar("댓글이 추가되었습니다.", "success");
      fetchComments(); // 댓글 추가 후 목록 조회
      onUpdateProject(); // 프로젝트 업데이트 호출
    } catch (error) {
      console.error("댓글 제출 오류:", error);
      showSnackbar("댓글 제출에 실패했습니다.", "error");
    }
  };

  // 댓글 삭제 함수
  const handleCommentDelete = (commentId: number) => {
    setCommentIdToDelete(commentId);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (commentIdToDelete === null) return;

    try {
      await axios.delete(`${SERVER_URL}/api/comments/${commentIdToDelete}`, {
        withCredentials: true,
      });
      showSnackbar("댓글이 삭제되었습니다.", "success");
      fetchComments(); // 댓글 삭제 후 목록 조회
      onUpdateProject(); // 프로젝트 업데이트 호출
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      showSnackbar("댓글 삭제에 실패했습니다.", "error");
    } finally {
      setOpenDialog(false);
      setCommentIdToDelete(null);
    }
  };

  // 컴포넌트 마운트 시 댓글 목록 조회
  useEffect(() => {
    fetchComments();
  }, [projectId]);

  // 시간 포맷 함수 추가
  const formatTimeElapsed = (createdAt: string) => {
    const createdTime = new Date(createdAt);
    const now = new Date();
    const elapsedSeconds = Math.floor(
      (now.getTime() - createdTime.getTime()) / 1000
    );

    if (elapsedSeconds < 60) {
      return `${elapsedSeconds}초 전`;
    } else if (elapsedSeconds < 3600) {
      const minutes = Math.floor(elapsedSeconds / 60);
      return `${minutes}분 전`;
    } else if (elapsedSeconds < 86400) {
      const hours = Math.floor(elapsedSeconds / 3600);
      return `${hours}시간 전`;
    } else {
      const days = Math.floor(elapsedSeconds / 86400);
      return `${days}일 전`;
    }
  };

  return (
    <Box mt={2}>
      <Box
        sx={{
          height: "200px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        {comments.map((c) => (
          <Box key={c.id} mb={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
            >
              {c.nickname}: {c.content}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatTimeElapsed(c.created_at)}
              {user?.user_id === c.user_id && ( // 댓글 작성자가 현재 사용자와 같은 경우
                <Button
                  color="secondary"
                  onClick={() => handleCommentDelete(c.id)} // 삭제 버튼 클릭 시 댓글 삭제
                >
                  <DeleteIcon />
                </Button>
              )}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box display={"flex"} alignItems={"center"} mt={2}>
        <TextField
          fullWidth
          label="댓글 입력"
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommentSubmit();
            }
          }}
          inputProps={{ maxLength: 300 }} // 최대 글자 수 설정
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
          sx={{ mt: 1, ml: 1 }}
        >
          <SendIcon />
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogContentText>댓글을 삭제하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            취소
          </Button>
          <Button onClick={confirmDelete} color="primary">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectComment;

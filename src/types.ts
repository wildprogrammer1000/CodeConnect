export type User = {
  id: number;
  user_id: string;
  nickname: string;
};

export type ProjectForm = {
  id?: number;
  title: string;
  user_id: string;
  url: string;
  thumbnail: string;
  description: string;
};
export type Project = {
  id: number;
  title: string;
  user_id: string;
  nickname: string;
  url: string;
  thumbnail: string;
  description: string;
  created_at: string;
  liked: boolean;
  like_count: number;
  comment_count: number;
};

export type SnackbarType = "success" | "error" | "warning" | "info";

export type Comment = {
  id: number;
  user_id: string;
  nickname: string;
  content: string;
  created_at: string;
};

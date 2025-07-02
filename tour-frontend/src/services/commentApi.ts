import api from './api';
import { Comment, CommentRequest } from '../types/comment';  

// 댓글 목록 조회
export async function getComments(threadId: number): Promise<Comment[]> {
  const response = await api.get(`/threads/${threadId}/comments`);  
  return response.data;
}

// 댓글 작성
export async function postComment(threadId: number, data: CommentRequest): Promise<Comment> {
  const response = await api.post(`/threads/${threadId}/comments`, data);  
  return response.data;
}
// 댓글 수정
export async function updateComment(threadId: number, commentId: number, data: CommentRequest): Promise<void> {
  await api.put(`/threads/${threadId}/comments/${commentId}`, data);
}

// 댓글 삭제
export async function deleteComment(threadId: number, commentId: number): Promise<void> {
  await api.delete(`/threads/${threadId}/comments/${commentId}`);
}
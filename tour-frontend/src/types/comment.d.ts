export interface Comment {
  commentId: number;         // 댓글 고유 ID (백엔드 기준으로 필드명이 commentId)
  threadId: number;          // 어떤 게시글(thread)에 속한 댓글인지
  author: string;            // 작성자 이름 (문자열)
  comment: string;           // 댓글 내용
  createDate: string;        // 생성일 (ISO 문자열로 전달됨)
  modifiedDate: string;      // 수정일 (수정된 경우)
}
// 댓글 작성 요청용 (POST 요청 body에 사용)
export interface CommentRequest {
  comment: string;           // 댓글 내용만 전송 (백엔드에서 작성자, threadId는 따로 처리)
}
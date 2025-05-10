import { Department } from ".";
import { UserRole } from "./user";

// ---------- Author ----------
export interface ThreadAuthor {
  id: number;
  username: string;
  name: string;
  photoPath?: string;
  role?: UserRole;
  isDeleted?: boolean;
  student?: null | {
    department: Department
  };
}

// ---------- Category ----------
export interface ThreadCategory {
  category_id: number;
  name: string;
  author_user_id: number | null;
}

export interface CategoryResponse {
  category_id: number;
  name: string;
}

// ---------- Votes ----------
export interface VoteCounts {
  up: number;
  down: number;
}

export interface FormattedVote {
  score: number;
  user_vote: 'UP' | 'DOWN' | null;
  counts: VoteCounts;
}

export interface VoteResponse {
  score: number;
  user_vote: 'UP' | 'DOWN' | null;
  counts: {
    up: number;
    down: number;
  };
}

// ---------- Comments ----------
export interface ThreadComment {
  comment_id: number;
  content: string;
  created_at: string;
  author: ThreadAuthor;
  votes?: FormattedVote;
}

export interface CreateCommentPayload {
  content: string;
}

// ---------- Main Thread ----------
export interface Thread {
  thread_id: number;
  category_id: number;
  author_user_id: number;
  title: string;
  content: string;
  thumbnail_url: string | null;
  created_at: string;
  author: ThreadAuthor;
  category: ThreadCategory;
  votes?: FormattedVote;
  bookmarked?: boolean;
  comments?: ThreadComment[];
  _count?: {
    comments: number;
    votes: number;
  };
}

// ---------- Payloads ----------
export interface CreateThreadPayload {
  title: string;
  content: string;
  category_id: number;
  thumbnail_url?: string | null;
}

export type UpdateThreadPayload = Partial<CreateThreadPayload>;

export interface CreateThreadResponse {
  thread_id: number;
}

// ---------- Vote Response ----------
export interface VoteResponse {
  score: number;
  user_vote: 'UP' | 'DOWN' | null;
  counts: VoteCounts;
}

// ---------- Category List ----------
export type ThreadCategoryList = ThreadCategory[];

// ---------- Minimal Thread ----------
export type ThreadMinimal = {
  thread_id: Thread['thread_id'];
  title: Thread['title'];
  created_at: Thread['created_at'];
  commentsCount: number;
  author: ThreadAuthor;
};

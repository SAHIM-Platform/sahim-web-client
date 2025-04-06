export interface Thread {
  thread_id: number;
  category_id: number;
  author_user_id: number;
  title: string;
  content: string;
  created_at: string;
  author: {
    id: number;
    username: string;
    name: string;
  };
  category: {
    category_id: number;
    name: string;
  };
  _count: {
    comments: number;
    votes: number;
  };
  votes: {
    score: number;
    user_vote: "UP" | "DOWN" | null;
    counts: {
      up: number;
      down: number;
    };
  };
  comments?: {
    comment_id: number;
    content: string;
    created_at: string;
    author: {
      id: number;
      username: string;
      name: string;
    };
    votes: {
      score: number;
      user_vote: "UP" | "DOWN" | null;
    };
  }[];
}

export type ThreadMinimal = {
  thread_id: Thread['thread_id'];
  title: Thread['title'];
  created_at: Thread['created_at'];
  commentsCount: Thread['_count']['comments'];
};

export interface ThreadResponse {
  data: Thread | Thread[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ThreadError {
  message: string;
  code?: string;
}

export interface ThreadResult {
  success: boolean;
  data?: ThreadResponse;
  error?: ThreadError;
}

export interface SingleThreadResult {
  success: boolean;
  data?: Thread;
  error?: ThreadError;
}
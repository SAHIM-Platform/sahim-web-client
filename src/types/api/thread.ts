export interface Thread {
  thread_id: number;
  category_id: number;
  author_user_id: number;
  title: string;
  content: string;
  created_at: string;
  thumbnail_url?: string;
  bookmarked?: boolean;
  author: {
    id: number;
    username: string;
    name: string;
    photoPath: string;
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
  authorName: Thread['author']['name']; 
  authorPhotoPath: Thread['author']['photoPath']; 
};

export interface ThreadResponse {
  data: Thread[];
  meta: {
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

export interface ApiSearchResult {
  id: number;
  title: string;
  createdAt: string;
  author: { id: number; name: string };
  commentsCount: number;
}

export interface SearchResult {
  id: string;
  title: string;
  timestamp: string;
  authorName: string;
  repliesCount: number;
}

export interface BookmarkedThreadsResult {
  success: boolean;
  data?: ThreadResponse;
  error?: ThreadError;
}

export interface Category {
  id: string;
  name: string;
}

export interface VoteResponse {
  success: boolean;
  votesCount: number;
  userVote: "UP" | "DOWN" | null;
}

export interface APIVoteResponse {
  success: boolean;
  updatedVotes: {
    score?: number;
    user_vote?: "UP" | "DOWN" | null;
  };
}

export interface CategoryResponse {
  data: {
    category_id: number;
    name: string;
  }[];
}

export type CommentResponse = {
  id: number;
  content: string;
  thread_id: number;
  author_user_id: number;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
    name: string | null;
  };
  votes: {
    score: number; // Upvotes - Downvotes
    user_vote: 'UP' | 'DOWN' | null; // The current user's vote
    counts: {
      up: number; // Number of upvotes
      down: number; // Number of downvotes
    };
  };
};

export interface DeleteThreadResult {
  success: boolean;
  error?: {
    message: string;
    code: string;
  };
}

export interface BookmarkResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface CreateThreadResult {
  success: boolean;
  data?: {
    thread_id: number;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface ThreadServiceResult {
  success: boolean;
  data?: {
    data: Thread[];
    meta: {
      page: number;
      totalPages: number;
    };
  };
  error?: {
    message: string;
    code: string;
  };
}
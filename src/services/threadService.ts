interface VoteResponse {
  success: boolean;
  votesCount: number;
  userVote: "UP" | "DOWN" | null;
}

export async function voteThread(threadId: string, voteType: "UP" | "DOWN"): Promise<VoteResponse> {
  try {
    console.log("threadId ", threadId)
    console.log("voteType ", voteType)
    const response = await fetch(`/threads/${threadId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vote_type: voteType }),
    });
    console.log("response ", response)

    if (!response.ok) {
      throw new Error('Vote request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error voting on thread:', error);
    throw error;
  }
} 
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
// import { useAuth } from "@/hooks/use-auth"; // To enable/disable based on auth state

interface VoteButtonProps {
  reportId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  // onVote: (voteType: 'up' | 'down') => void; // Callback for actual voting
}

export function VoteButtons({ reportId, initialUpvotes, initialDownvotes }: VoteButtonProps) {
  // const { user } = useAuth(); // TODO: Check if user is logged in to enable voting
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null); // Mock local vote state

  const handleVote = (voteType: 'up' | 'down') => {
    // if (!user) {
    //   // toast({ title: "Please log in to vote.", variant: "destructive" });
    //   return;
    // }

    if (voted === voteType) { // Undoing vote
      if (voteType === 'up') setUpvotes(prev => prev - 1);
      else setDownvotes(prev => prev - 1);
      setVoted(null);
    } else { // New vote or changing vote
      if (voted === 'up') setUpvotes(prev => prev - 1);
      if (voted === 'down') setDownvotes(prev => prev - 1);
      
      if (voteType === 'up') setUpvotes(prev => prev + 1);
      else setDownvotes(prev => prev + 1);
      setVoted(voteType);
    }
    // Call onVote(voteType) here for actual backend update
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={voted === 'up' ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote('up')}
        className="px-2 py-1 h-auto"
      >
        <ThumbsUp className={`mr-1 h-4 w-4 ${voted === 'up' ? '' : 'text-green-600'}`} /> 
        <span className="text-xs">{upvotes}</span>
      </Button>
      <Button
        variant={voted === 'down' ? "destructive" : "outline"}
        size="sm"
        onClick={() => handleVote('down')}
        className="px-2 py-1 h-auto"
      >
        <ThumbsDown className={`mr-1 h-4 w-4 ${voted === 'down' ? '' : 'text-red-600'}`} /> 
        <span className="text-xs">{downvotes}</span>
      </Button>
    </div>
  );
}

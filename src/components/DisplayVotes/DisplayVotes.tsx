import { getUsers, getVotesByStoryId } from "@/api";
import { PaginatedResponse, User, Vote } from "@/types";
import { Box, Typography } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React from "react";

interface DisplayVotesProps {}

const DisplayVotes: React.FC<DisplayVotesProps> = ({ voteId }) => {
  const { data: users, refetch: usersRefetch } = useQuery<PaginatedResponse<User>>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    placeholderData: keepPreviousData,
    enabled: false,
  });

  const { data: votes, refetch: votesRefetch } = useQuery<PaginatedResponse<Vote>>({
    queryKey: ["votes", "byVoteId", voteId],
    queryFn: () => getVotesByStoryId(voteId),
    placeholderData: keepPreviousData,
    enabled: false,
  });

  return (
    <Box>
      <Typography variant="h4">Players</Typography>
      <ul>
        {/*  Replace the following with a custom component */}
        <li>Player 1</li>
        <li>Player 2</li>
        <li>Player 3</li>
      </ul>
    </Box>
  );
};

export default DisplayVotes;

import { getStoriesByRoomId, getUsers, getVotesByStoryId } from "@/api";
import { PaginatedResponse, User, Story, VALID_VOTES, Vote } from "@/types";
import {
  Grid2 as Grid,
  Typography,
  Box,
  Button,
  Stack,
  ClickAwayListener,
} from "@mui/material";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import { CardList, StoryList } from "@/components";
import CreateStoryModal from "@/components/CreateStoryModal/CreateStoryModal";

const INITIAL_SECONDS = 60;

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const Room: React.FC = () => {
  let { id: roomId } = useParams();
  const [showModal, setShowModal] = useState(false);
  // const [timerSeconds, setTimerSeconds] = React.useState(INITIAL_SECONDS);

  function handleShow() {
    setShowModal(true);
  }
  function handleHide() {
    setShowModal(false);
  }

  const { data: stories } = useQuery<PaginatedResponse<Story>>({
    queryKey: ["stories", "byRoomId", roomId],
    queryFn: () => getStoriesByRoomId(roomId!),
    placeholderData: keepPreviousData,
  });

  const usersQuery = useQuery<PaginatedResponse<User>>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    placeholderData: keepPreviousData,
  });

  return (
    <Grid container spacing={2} columns={3}>
      {/*  1st column */}
      <Grid container size={2}>
        <CardList data={Array.from(VALID_VOTES)} />
        <Grid size={3}>
          <Typography variant="h4">Stories</Typography>
          <Button variant="outlined" size="small" onClick={handleShow}>
            Create new story
          </Button>
          {showModal && (
            <CreateStoryModal
              roomId={roomId}
              doClose={handleHide}
              open={showModal}
            />
          )}
          {stories && <StoryList data={stories.data}></StoryList>}
        </Grid>
      </Grid>

      {/*  2nd column */}
      <Grid container size={1}>
        <Box>
          <Typography>Timer: 00:45</Typography>
          <Stack spacing={2} direction="row">
            <Button variant="contained">Start</Button>
            <Button variant="outlined">Show results</Button>
          </Stack>
        </Box>
        <Box>
          <Typography variant="h4">Players</Typography>
          <ul>
            {/*  Replace the following with a custom component */}
            <li>Player 1</li>
            <li>Player 2</li>
            <li>Player 3</li>
          </ul>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Room;

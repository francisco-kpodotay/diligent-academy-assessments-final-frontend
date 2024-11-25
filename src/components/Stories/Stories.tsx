import React, { useState } from "react";
import { StoryList } from "../StoryList";
import { useParams } from "react-router-dom";
import { Grid2 as Grid, Typography, Button } from "@mui/material";
import CreateStoryModal from "../CreateStoryModal/CreateStoryModal";
import { SelectableListElement, Story } from "@/types";

interface StoriesProps {
  doSelectStory: (story: SelectableListElement)=>void
}

const Stories: React.FC<StoriesProps> = ({doSelectStory}) => {
  let { id: roomId } = useParams();
  const [showModal, setShowModal] = useState(false);

  function handleShow() {
    setShowModal(true);
  }
  function handleHide() {
    setShowModal(false);
  }

  return (
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
      <StoryList roomId={roomId} doSelectStory={doSelectStory} />
    </Grid>
  );
};

export default Stories;

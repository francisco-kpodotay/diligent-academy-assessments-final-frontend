import React, { useState } from "react";
import Timer from "@/components/Timer/Timer";
import { Grid2 as Grid } from "@mui/material";
import Stories from "@/components/Stories/Stories";
import CardList from "@/components/CardList/CardList";
import DisplayVotes from "@/components/DisplayVotes/DisplayVotes";
import { SelectableListElement, Story, VALID_VOTES } from "@/types";

const Room: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isCardSelectable, setIsCardSelectable] = useState(false);

  function handelIsCardSelectable(boolean: boolean) {
    setIsCardSelectable(boolean);
  }

  // TODO refactor: use context API insted of prop drilling
  function handelStorySelect(story: SelectableListElement) {
    if (story.selected) {
      setSelectedStory(null);
    } else {
      setSelectedStory(story.item as Story);
    }
  }

  return (
    <Grid container spacing={2} columns={3}>
      {/*  1st column */}
      <Grid container size={2}>
        <CardList
          data={Array.from(VALID_VOTES)}
          isSelectable={isCardSelectable}
        />
        <Stories doSelectStory={handelStorySelect} />
      </Grid>

      {/*  2nd column */}
      <Grid container size={1}>
        <Timer story={selectedStory} setRun={handelIsCardSelectable}/>
        <DisplayVotes />
      </Grid>
    </Grid>
  );
};

export default Room;

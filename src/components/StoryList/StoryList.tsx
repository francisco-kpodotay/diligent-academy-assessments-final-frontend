import List from "@mui/material/List/List";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectableListElement } from "../../types";
import ListItem from "@mui/material/ListItem/ListItem";
import IconButton from "@mui/material/IconButton/IconButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import { createNewSelectableList, handleSelectEvent } from "@/lib/utils";

export function StoryList({ data }: { data: string[] }) {
  const [storyList, setStoryList] = useState<SelectableListElement[] | null>(
    null
  );

  function handleClick(selected: SelectableListElement) {
    handleSelectEvent(setStoryList, selected);
  }

  useEffect(() => {
    createNewSelectableList(setStoryList, data);
  }, []);

  return (
    <List>
      {storyList &&
        storyList.map((element) => {
          return (
            <>
              <ListItem
                key={`story-${element.item}`}
                disablePadding
                secondaryAction={
                  element.selected && (
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemButton
                  selected={element.selected}
                  onClick={() => handleClick(element)}
                >
                  <ListItemText primary={element.item} />
                </ListItemButton>
              </ListItem>
            </>
          );
        })}
    </List>
  );
}

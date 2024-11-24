import {
  getListObject,
  handleSelectEvent,
  createNewSelectableList,
} from "@/lib/listComponentHelpers/utils";
import List from "@mui/material/List/List";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem/ListItem";
import { SelectableListElement, Story } from "../../types";
import IconButton from "@mui/material/IconButton/IconButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";

export function StoryList({ data }: { data: Story[] | undefined }) {
  const [storyList, setStoryList] = useState<SelectableListElement[] | null>(
    null
  );

  function handleClick(selected: SelectableListElement) {
    handleSelectEvent(setStoryList, selected);
  }

  useEffect(() => {
    if (data) {
      createNewSelectableList(setStoryList, data);
    } else {
      console.error(
        "Error: No data available. Unable to create the story list."
      );
    }
  }, [data]);

  return (
    <List>
      {storyList &&
        storyList.map((element) => {
          const listObj = getListObject(element);
          return (
            <ListItem
              key={`story-${listObj.id}`}
              disablePadding
              secondaryAction={
                listObj.selected && (
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemButton
                selected={listObj.selected}
                onClick={() => handleClick(element)}
              >
                <ListItemText primary={listObj.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
    </List>
  );
}

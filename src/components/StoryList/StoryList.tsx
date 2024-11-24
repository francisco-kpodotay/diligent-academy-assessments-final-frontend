import {
  getListObject,
  changeStatus,
  createNewSelectableList,
} from "@/lib/listComponentHelpers/utils";
import { deleteStory } from "@/api";
import List from "@mui/material/List/List";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem/ListItem";
import { SelectableListElement, Story } from "../../types";
import IconButton from "@mui/material/IconButton/IconButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";

export function StoryList({
  data,
  roomId,
}: {
  data: Story[] | undefined;
  roomId: string | undefined;
}) {
  const queryClient = useQueryClient();
  const [storyList, setStoryList] = useState<SelectableListElement[] | null>(
    null
  );

  const { mutateAsync: deletStoryMutation } = useMutation({
    mutationFn: (storyId: string) => {
      return deleteStory(storyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", "byRoomId", roomId],
      });
    },
  });

  function handleSelect(selected: SelectableListElement) {
    changeStatus(setStoryList, selected);
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
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deletStoryMutation(listObj.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemButton
                selected={listObj.selected}
                onClick={() => handleSelect(element)}
              >
                <ListItemText primary={listObj.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
    </List>
  );
}

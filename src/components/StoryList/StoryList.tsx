import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  changeStatus,
  getListObject,
  createNewSelectableList,
} from "@/lib/listComponentHelpers/utils";
import List from "@mui/material/List/List";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem/ListItem";
import { deleteStory, getStoriesByRoomId } from "@/api";
import IconButton from "@mui/material/IconButton/IconButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import { PaginatedResponse, SelectableListElement, Story } from "../../types";

interface StoryListProps {
  roomId: string | undefined;
  doSelectStory: (story: SelectableListElement) => void;
}

const StoryList: React.FC<StoryListProps> = ({ roomId, doSelectStory }) => {
  const queryClient = useQueryClient();
  const [storyList, setStoryList] = useState<SelectableListElement[] | null>(
    null
  );

  const { data: stories } = useQuery<PaginatedResponse<Story>>({
    queryKey: ["stories", "byRoomId", roomId],
    queryFn: () => getStoriesByRoomId(roomId!),
    placeholderData: keepPreviousData,
  });

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

  function handleSelect(story: SelectableListElement) {
    doSelectStory(story);
    changeStatus(setStoryList, story);
  }

  useEffect(() => {
    if (stories) {
      createNewSelectableList(setStoryList, stories.data);
    }
  }, [stories]);

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
};

export default StoryList;

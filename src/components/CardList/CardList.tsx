import {
  changeStatus,
  getListObject,
  createNewSelectableList,
} from "@/lib/listComponentHelpers/utils";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper/Paper";
import { SelectableListElement } from "@/types";
import Typography from "@mui/material/Typography/Typography";

export function CardList({ data }: { data: (string | number)[] }) {
  const [cardList, setCardList] = useState<SelectableListElement[] | null>(
    null
  );

  function handleClick(selected: SelectableListElement) {
    changeStatus(setCardList, selected);
  }

  useEffect(() => {
    createNewSelectableList(setCardList, data);
  }, []);

  return (
    <>
      {cardList &&
        cardList.map((element) => {
          const listObj = getListObject(element);
          return (
            <Paper
              key={`vote-${listObj.id}`}
              onClick={() => handleClick(element)}
              sx={{
                padding: 5,
                cursor: "pointer",
                backgroundColor: listObj.selected
                  ? "rgba(41, 121, 255, 0.08)"
                  : "white",
              }}
            >
              <Typography component="div" variant="h5">
                {listObj.text}
              </Typography>
            </Paper>
          );
        })}
    </>
  );
}

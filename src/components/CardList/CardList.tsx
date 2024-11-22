import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper/Paper";
import { SelectableListElement } from "@/types";
import Typography from "@mui/material/Typography/Typography";
import { createNewSelectableList, handleSelectEvent } from "@/lib/utils";

export function CardList({ data }: { data: (string | number)[] }) {
  const [cardList, setCardList] = useState<SelectableListElement[] | null>(
    null
  );

  function handleClick(selected: SelectableListElement) {
    handleSelectEvent(setCardList, selected);
  }

  useEffect(() => {
    createNewSelectableList(setCardList, data);
  }, []);

  return (
    <>
      {cardList &&
        cardList.map((element) => (
          <Paper
            key={`vote-${element.item}`}
            onClick={() => handleClick(element)}
            sx={{
              padding: 5,
              cursor: "pointer",
              backgroundColor:
                element.selected === true
                  ? "rgba(41, 121, 255, 0.08)"
                  : "white",
            }}
          >
            <Typography component="div" variant="h5">
              {element.item}
            </Typography>
          </Paper>
        ))}
    </>
  );
}

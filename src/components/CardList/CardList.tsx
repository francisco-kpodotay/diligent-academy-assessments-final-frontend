import {
  changeStatus,
  getListObject,
  createNewSelectableList,
} from "@/lib/listComponentHelpers/utils";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper/Paper";
import { SelectableListElement } from "@/types";
import Typography from "@mui/material/Typography/Typography";

interface CardListProps {
  data: (string | number)[];
  isSelectable: boolean;
}

const CardList: React.FC<CardListProps> = ({ data, isSelectable }) => {
  const [cardList, setCardList] = useState<SelectableListElement[] | null>(
    null
  );

  function handleClick(selected: SelectableListElement) {
    if (isSelectable) {
      changeStatus(setCardList, selected);
    }
  }

  useEffect(() => {
    createNewSelectableList(setCardList, data);
  }, [data]);

  // TODO refactor: when story context implemented
  /*  useEffect(()=>{
    changeStatus(setCardList) //deselect all card
  },[story])  */

  return (
    <>
      {cardList &&
        cardList.map((element) => {
          const listObj = getListObject(element);
          return (
            <Tooltip
              title={!isSelectable && "Timer needs to run to select card"}
              key={`vote-${listObj.id}`}
            >
              <Paper
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
            </Tooltip>
          );
        })}
    </>
  );
};

export default CardList;

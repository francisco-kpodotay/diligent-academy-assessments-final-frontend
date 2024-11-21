import Paper from "@mui/material/Paper/Paper";
import Typography from "@mui/material/Typography/Typography";
import { useEffect, useState } from "react";

interface Card {
  item: number | string;
  status: "active" | "inactive";
}

export function CardList({ data }: { data: (string | number)[] }) {
  const [cardList, setCardList] = useState<Card[] | null>(null);

  function handleClick(item: Card["item"]) {
    setCardList((prev) => {
      if (!prev) return null;

      return prev.map((element) => {
        if (element.item === item) {
          return {
            ...element,
            status: element.status === "active" ? "inactive" : "active",
          };
        } else {
          return { ...element, status: "inactive" };
        }
      });
    });
  }

  useEffect(() => {
    if (Array.isArray(data) ) {
      setCardList(
        data.map((item) => {
          const newElement: Card = { item: item, status: "inactive" };
          return newElement;
        })
      );
    } else {
      console.error("CardList prop needs to be an array");
    }
  },[]);

  return (
    <>
      {cardList &&
        cardList.map((element) => (
          <Paper
            key={`vote-${element.item}`}
            onClick={() => handleClick(element.item)}
            sx={{
              padding: 5,
              cursor: "pointer",
              backgroundColor:
                element.status === "active" ? "rgba(41, 121, 255, 0.08)" : "white",
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

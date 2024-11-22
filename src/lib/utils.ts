import { ListStateSetter, SelectableListElement } from "@/types";

export function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function createNewSelectableList(
  stateSetter: ListStateSetter,
  data: (string | number)[]
) {
  if (Array.isArray(data)) {
    stateSetter(
      data.map((item) => {
        const newElement = { item: item, selected: false };
        return newElement;
      })
    );
  } else {
    console.error("List prop needs to be an array");
  }
}

export function handleSelectEvent(
  stateSetter: ListStateSetter,
  selected: SelectableListElement
) {
  stateSetter((prev) => {
    if (!prev) return null;

    return prev.map((element) => {
      if (element.item === selected.item) {
        return {
          ...element,
          selected: element.selected === true ? false : true,
        };
      } else {
        return { ...element, selected: false };
      }
    });
  });
}

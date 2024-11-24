import { isStory } from "../utils";
import { ListStateSetter, SelectableListElement, Story } from "@/types";

export function getListObject(element: SelectableListElement): {
  text: string;
  id: string;
  selected: boolean;
} {
  const { item, selected } = element;

  if (typeof item === "string" || typeof item === "number") {
    return {
      text: String(item),
      id: String(item),
      selected,
    };
  } else if (isStory(item)) {
    return {
      text: item.name,
      id: item.id,
      selected,
    };
  } else {
    throw new Error("Invalid item type");
  }
}

export function createNewSelectableList(
  stateSetter: ListStateSetter,
  data: (string | number)[] | Story[]
) {
  if (Array.isArray(data)) {
    stateSetter(
      data.map((item) => {
        return {
          item: item,
          selected: false,
        };
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

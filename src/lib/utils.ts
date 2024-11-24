import { Story } from "@/types";

export function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function isStory(item: any): item is Story {
  return (
    item !== null &&
    typeof item === "object" &&
    "id" in item &&
    typeof item.id === "string" &&
    "name" in item &&
    typeof item.name === "string"
  );
}

export function toCamelCase(sentence: string): string {
  return sentence
    .toLowerCase()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join("");
}

import { parser } from "../src/parser/parser";
import { getFullData, getRandomData } from "./data/getter";

const result = getRandomData().filter((data) => {
  const parseResult = parser(data);
  console.log(data, "\n", parseResult.extension);
  if (parseResult.extension.parsedName === null) return true;
});

console.log("No Result:");
console.log(result);

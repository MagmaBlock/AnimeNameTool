import { parseFileName } from "../src/parser/parser";
import { getFullData, getRandomData } from "./data/getter";

getRandomData().forEach((data) => {
  const parseResult = parseFileName(data);
  console.log(data, "\n", parseResult.subtitle);
});

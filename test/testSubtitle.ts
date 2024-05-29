import { parser } from "../src/parser/parser";
import { getFullData, getRandomData } from "./data/getter";

getRandomData().forEach((data) => {
  const parseResult = parser(data);
  console.log(data, "\n", parseResult.subtitle);
});

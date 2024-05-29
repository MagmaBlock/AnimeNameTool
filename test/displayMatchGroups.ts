import chalk from "chalk";
import { parseFileName } from "../src/parser/parser";
import { getRandomData } from "./data/getter";

getRandomData().forEach((fileName) => {
  const result = parseFileName(fileName);

  let display = fileName;
  if (result.groupIndex !== null) {
    display =
      display.slice(0, result.groupIndex.index) +
      chalk.bgBlueBright(
        display.slice(
          result.groupIndex.index,
          result.groupIndex.index + result.groupIndex.length
        )
      ) +
      display.slice(result.groupIndex.index + result.groupIndex.length);
  }

  console.log(display);
});

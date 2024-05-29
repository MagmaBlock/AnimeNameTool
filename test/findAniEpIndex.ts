import aniep from "aniep";
import { getFullData, getRandomData } from "./data/getter";
import chalk from "chalk";
import { findAniEpIndex } from "../src/parser/findAniEpIndex";

getRandomData().forEach((name) => {
  const result = findAniEpIndex(name);
  if (result !== null) {
    if (1) {
      console.log(
        [
          result.content,
          " | ",
          name.slice(0, result.index),
          chalk.bgBlackBright(
            name.slice(result.index, result.index + result.length)
          ),
          name.slice(result.index + result.length),
        ].join("")
      );
    }
  } else {
    if (1) console.log(aniep(name), name);
  }
});

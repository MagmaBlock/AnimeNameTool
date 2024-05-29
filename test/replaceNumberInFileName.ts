import { replaceNumberInFileName } from "../src/parser/findAniEpIndex";
import { getFullData } from "./data/getter";

let errorCount = 0;

getFullData().forEach((name) => {
  const clearFileName = replaceNumberInFileName(name);
  if (clearFileName.length !== name.length) {
    console.log(clearFileName);
    console.log(name);
    errorCount++;
  }
});

console.log(`found ${errorCount} errors.`);

import { parser } from "../src/parser/parser";
import { getMiniData, getRandomData } from "./data/getter";

getRandomData(0.01).forEach((data) => {
  console.log(data, parser(data));
  console.log("----------------------------------------------------------");
});

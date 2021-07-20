import checkIfIsValidResult from "./utils/checkIfIsValidResult";
import scrape from "./utils/scrape";

const run = async () => {
  const promises = [];
  for (let i = 970; i < 1000; i++) {
    const searchString = `one piece ${i}`;
    const promise = new Promise(async () => {
      const searchRows = await scrape(searchString);

      console.log("Search string", searchString);
      console.log("Result", searchRows.join(", "));
      const isValidResult = checkIfIsValidResult(searchString, searchRows);
      if (isValidResult) {
        console.log("Is valid result");
      } else {
        console.log("Not a valid result");
      }
    });
    promises.push(promise);
  }

  await Promise.all(promises);
};

run();

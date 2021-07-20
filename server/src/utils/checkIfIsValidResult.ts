export default (searchString: string, resultRows: string[]): boolean => {
  const searchWords = searchString.split(/ +/);

  const regexes: RegExp[] = [];

  // Allow one char to be between characters of keywords
  // For example for search string "one piece 980" result "on e piece - 980" would pass
  searchWords.forEach((it) => {
    regexes.push(new RegExp(`${it.split("").join(".?")}`, "i"));
  });

  let returnValue = false;

  console.log("Regexes: ", regexes.join(", "));

  resultRows.forEach((it) => {
    if (regexes.every((regex) => it.match(regex))) {
      returnValue = true;
    }
  });

  return returnValue;
};

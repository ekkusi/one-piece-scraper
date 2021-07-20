import config from "../config.json";

export default (searchParams: string): URL => {
  return new URL(`${config.scrapeBaseUrl}/search/${searchParams}/1/`);
};

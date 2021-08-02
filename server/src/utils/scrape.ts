import cheerio from "cheerio";
import formatUrl from "./formatUrl";
import fetch from "node-fetch";

export default async (searchParams: string) => {
  const url = formatUrl(searchParams);
  const response = await fetch(url.href);
  const html = await response.text();
  const $ = cheerio.load(html);
  const searchTable = $("table td.name a:last-child");

  const rows: string[] = [];

  searchTable.each((index, element) => {
    rows.push($(element).text());
  });

  return rows;
};

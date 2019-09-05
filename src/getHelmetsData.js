const fs = require('fs');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const toMaybe = x => x === undefined ? { textContent: null } : x;

const getHelmetStats = async () => {
  const raw_page = await fetch('https://darksouls3-jp.wiki.fextralife.com/%E5%85%9C');
  const text_based_page = await raw_page.text();
  const page_dom = new JSDOM(text_based_page);
  const table_dom = page_dom.window.document.querySelector('.wiki_table');
  const helmet_dom = table_dom.querySelector('tbody').querySelectorAll('tr');

  return Array.from(helmet_dom).map(row_dom => ({
    name: Array.from(toMaybe(row_dom.querySelectorAll('td')[0]).textContent).filter(x => x !== " ").join(""),
    toughness: toMaybe(row_dom.querySelectorAll('td')[13]).textContent,
    weight: toMaybe(row_dom.querySelectorAll('td')[14]).textContent,
  }));
};
const getHelmetsData = async (path) => {
    const helmets = await getHelmetStats();
    fs.writeFileSync(path, JSON.stringify(helmets));
}

export default getHelmetsData;

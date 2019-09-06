const fs = require('fs');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const toMaybe = x => x === undefined ? { textContent: null } : x;

const getArmorsStat = async (url) => {
  const raw_page = await fetch(url);
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

const getArmorsData = async (dist_path) => {
    const helmets = await getArmorsStat('https://darksouls3-jp.wiki.fextralife.com/%E5%85%9C');
    fs.writeFileSync(`${dist_path}/helmets.json`, JSON.stringify(helmets));

    const garments = await getArmorsStat('https://darksouls3-jp.wiki.fextralife.com/%E9%8E%A7');
    fs.writeFileSync(`${dist_path}/garments.json`, JSON.stringify(garments));

    const backs = await getArmorsStat('https://darksouls3-jp.wiki.fextralife.com/%E6%89%8B%E7%94%B2');
    fs.writeFileSync(`${dist_path}/backs.json`, JSON.stringify(backs));

    const boots = await getArmorsStat('https://darksouls3-jp.wiki.fextralife.com/%E8%B6%B3%E7%94%B2');
    fs.writeFileSync(`${dist_path}/boots.json`, JSON.stringify(boots));
}

export default getArmorsData;

const fs = require('fs');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const toMaybe = x => x === undefined ? { textContent: null } : x;

const getWeaponsStats = async () => {
  const raw_page = await fetch('https://darksouls3-jp.wiki.fextralife.com/%E6%AD%A6%E5%99%A8');
  const text_based_page = await raw_page.text();
  const page_dom = new JSDOM(text_based_page);
  const weapon_tables_dom = page_dom.window.document.querySelectorAll('.wiki_table');

  return Array.from(weapon_tables_dom).map((type_separated_weapon_dom, i) => {
    const weapons_dom = type_separated_weapon_dom.querySelector('tbody').querySelectorAll('tr');

    return Array.from(weapons_dom).map(row_dom => ({
      name: toMaybe(row_dom.querySelectorAll('td')[0].querySelectorAll('p')[1]).textContent,
      requirement: {
        str: toMaybe(row_dom.querySelectorAll('td')[8].querySelectorAll('p')[0]).textContent,
        dex: toMaybe(row_dom.querySelectorAll('td')[9].querySelectorAll('p')[0]).textContent,
        int: toMaybe(row_dom.querySelectorAll('td')[10].querySelectorAll('p')[0]).textContent,
        fai: toMaybe(row_dom.querySelectorAll('td')[11].querySelectorAll('p')[0]).textContent,
      },
      weight: toMaybe(row_dom.querySelectorAll('td')[12].querySelectorAll('p')[1]).textContent,
    }));
  });
};

const getWeaponsData = async (path) => {
    const weapons = await getWeaponsStats();
    fs.writeFileSync(`${path}/weapons.json`, JSON.stringify(weapons, null, 2));
}

getWeaponsData('dist');

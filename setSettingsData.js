/**
 * @fileoverview update this themes settings_data.json with the settings data from another theme. 
 * 
 * Run this in a deployment pipeline with environmental variables for the theme and store you want copy settings from.
 *  - PRODUCTION_THEME_ID 
 *  - ADMIN_API_PASSWORD
 *  - STORE_DOMAIN
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const { PRODUCTION_THEME_ID, ADMIN_API_PASSWORD, STORE_DOMAIN } = process.env;
const outputFilePath = path.resolve(__dirname, './dist/config/settings_data.json');
const encoding = 'utf8';

// only run if we have the env variables set
if(!PRODUCTION_THEME_ID || !ADMIN_API_PASSWORD || !STORE_DOMAIN) return;

const headers = {
  'X-Shopify-Access-Token': ADMIN_API_PASSWORD,
}
const url = `https://${STORE_DOMAIN.replace(/\/$/, '')}/admin/api/2020-01/themes/${PRODUCTION_THEME_ID}/assets.json?asset[key]=config/settings_data.json`;


fetch(url, {headers})
  .then(res => res.json())
  .then(json => {
    const { value } = json.asset;
    fs.writeFileSync(outputFilePath, value, { encoding });
  })


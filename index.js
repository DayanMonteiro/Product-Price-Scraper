const puppeteer = require("puppeteer");
const fs = require("fs");

const config = require("./config.json");
const url = config.url;

if (!url) {
  console.error("Erro: Você precisa fornecer a URL do produto!");
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  const nameSelector = "#productTitle";
  await page.waitForSelector(nameSelector);
  const name = await page.$eval(nameSelector, (el) => el.innerText.trim());

  const priceSelector = "span.a-price-whole";
  await page.waitForSelector(priceSelector);
  const price = await page.$eval(priceSelector, (el) => el.innerText.trim());

  const productData = {
    url,
    name,
    price,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync("product_price.json", JSON.stringify(productData, null, 2));

  console.log("Nome e preço salvos com sucesso!", productData);

  await browser.close();
})();

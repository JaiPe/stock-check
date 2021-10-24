import puppeteer, { Browser, EvaluateFn, Page } from "puppeteer";

type Store = {
  title: string;
  url: string;
  selector: string;
  addToCart: EvaluateFn<Promise<boolean>>;
  isInStock: (el: string | null) => boolean;
  isPageValid: (el: string) => boolean;
};

type Stockist = Store & { image: string; page: Page };

const search: Store[] = [
  {
    title: "John Lewis",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    url: "https://www.johnlewis.com/sony-playstation-5-console-with-dualsense-controller/p5115192",
    selector: ".add-to-basket-summary-and-cta .u-centred",
    isPageValid(el) {
      return el.includes("#button--add-to-basket-out-of-stock");
    },
    isInStock(el) {
      return el !== null && el.match(/Currently in stock online/) !== null;
    },
  },
  {
    title: "Amazon",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    url: "https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452",
    selector: "#add-to-cart-button",
    isPageValid(el) {
      return el.includes("Currently unavailable.");
    },
    isInStock(el) {
      return el !== null && el.includes("Add to Basket");
    },
  },
  {
    title: "Smyths Toys",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    url: "https://www.smythstoys.com/uk/en-gb/video-games-and-tablets/playstation-5/playstation-5-consoles/playstation-5-console/p/191259",
    selector:
      ".AddToCart-AddToCartAction #customAddToCartForm > #addToCartButton",
    isPageValid(el) {
      return el.includes('id="#hdNotAvailable"');
    },
    isInStock(el) {
      return el !== null;
    },
  },
  {
    title: "Smyths Toys (Digital Edition)",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    url: "https://www.smythstoys.com/uk/en-gb/video-games-and-tablets/playstation-5/playstation-5-consoles/playstation-5-digital-edition-console/p/191430",
    selector:
      ".AddToCart-AddToCartAction #customAddToCartForm > #addToCartButton",
    isPageValid(el) {
      return el.includes('id="#hdNotAvailable"');
    },
    isInStock(el) {
      return el !== null;
    },
  },
  {
    url: "https://www.shopto.net/en/ps5hw01-playstation-5-console-p191472/",
    title: "Shop-to",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    selector: ".itemcard_order_submit_button:not(:disabled)",
    isPageValid(el) {
      return el.includes("Sold out");
    },
    isInStock(el) {
      return el !== null;
    },
  },
  {
    url: "https://www.box.co.uk/CFI-1015B-Sony-PlayStation-5-Digital-Edition-Conso_3199692.html",
    title: "Box (Digital Edition)",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    selector: "[data-procedure='Add to Basket']",
    isPageValid(el) {
      return el.includes("Coming Soon") && el.includes("Request Stock Alert");
    },
    isInStock(el) {
      return el !== null;
    },
  },
  {
    url: "https://www.box.co.uk/CFI-1015A-Sony-Playstation-5-Console_3199689.html",
    title: "Box",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    selector: "[data-procedure='Add to Basket']",
    isPageValid(el) {
      // TODO: Add check for page validity
      return el.includes("Coming Soon") && el.includes("Request Stock Alert");
    },
    isInStock(el) {
      return el !== null;
    },
  },
  {
    url: "https://www.board-game.co.uk/product/playstation-5/",
    title: "Board Game",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    isInStock: (el: string | null) => {
      return el !== null;
    },
    selector: ".single_add_to_cart_button",
    isPageValid(el) {
      return el.includes("5 is currently unavailable.");
    },
  },
  {
    url: "https://www.board-game.co.uk/product/playstation-5-digital-edition/",
    title: "Board Game (Digital Edition)",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    isInStock: (el: string | null) => {
      return el !== null;
    },
    selector: ".single_add_to_cart_button",
    isPageValid(el) {
      return el.includes("5 is currently unavailable.");
    },
  },
  {
    title: "Argos",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    url: "https://www.argos.co.uk/product/6795199",
    selector: "[data-test='add-to-trolley-button-button']",
    isPageValid(el) {
      return el.includes("Sorry, PlayStation®5 is currently unavailable.");
    },
    isInStock(el) {
      return el !== null;
    },
  },
  {
    title: "Argos (Digital Edition)",
    async addToCart() {
      // TODO: Add to basket
      console.warn("Missing `addToCart` function!");
    },
    url: "https://www.argos.co.uk/product/6795151",
    selector: "[data-test='add-to-trolley-button-button']",
    isPageValid(el) {
      return el.includes("Sorry, PlayStation®5 is currently unavailable.");
    },
    isInStock(el) {
      return el !== null;
    },
  },
];

async function hasStock(
  page: Page,
  { selector, isPageValid, isInStock }: Store
) {
  const { selection, body } = await page.evaluate(
    (pageSelector): { selection: string | null; body: string | undefined } => {
      const node = pageSelector && document.querySelector(pageSelector);

      return {
        selection: node ? node.outerHTML : node,
        body: document.querySelector("body")?.outerHTML,
      };
    },
    selector || null
  );

  if (isInStock(selection)) {
    return true;
  }
  if (body !== undefined && isPageValid(body)) {
    return false;
  }
  throw new Error("Page invalid - maybe a CAPTCHA?");
}

async function createPage(url: string, browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.isNavigationRequest()) {
      return request.continue();
    }
    request.abort();
  });
  await page.goto(url);

  return page;
}

async function getStockists(browser: Browser) {
  const stockists: Stockist[] = [];
  for (let descriptor of search) {
    try {
      const page = await createPage(descriptor.url, browser);
      const result = await hasStock(page, descriptor);
      if (result) {
        const imagePath = `./.tmp/${
          descriptor.title
        }-${new Date().getTime()}.png`;
        await page.screenshot({
          path: imagePath,
        });
        stockists.push({
          ...descriptor,
          page,
          image: imagePath,
        });
      } else {
        const imagePath = `./.tmp/fail-${descriptor.title}.png`;
        await page.screenshot({
          path: imagePath,
        });
        page.close();
      }
    } catch (e) {
      console.error(`Skipping ${descriptor.title}: ${e}`);
    }
  }
  return stockists;
}

async function addToCarts(stockists: Stockist[]) {
  for (const stockist of stockists) {
    const { addToCart, page } = stockist;
    try {
      if (addToCart) {
        await page.evaluate(addToCart);
      }
      await page.close();
    } catch (e) {
      console.log(e);
    }
  }
}

async function poll() {
  const browser = await puppeteer.launch();
  console.log("Checking stock...");
  const stockists = await getStockists(browser);
  if (stockists.length) {
    await addToCarts(stockists);
  }

  stockists.forEach(async ({ page }) => await page.close());

  await browser.close();
  return stockists;
}

async function report(stockists: Stockist[]) {
  if (stockists.length) {
    console.log(
      `In stock at:\n\n${stockists
        .map(
          ({ title, url, image }: Stockist) =>
            `${title} (${image})\n===========\n${url}`
        )
        .join("\n")}`
    );
  } else {
    console.log("No stock yet...");
  }
}

(async function (interval: number = 30) {
  await report(await poll());
  if (interval > 0) {
    console.log(`Retrying again in ${interval} minute(s)...`);
    setInterval(async () => {
      report(await poll());
      console.log(`Retrying again in ${interval} minute(s)...`);
    }, interval * 60000);
  }
})(5);

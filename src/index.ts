import puppeteer, { Browser, EvaluateFn, Page } from "puppeteer";

type Store = {
  title: string;
  url: string;
  selector?: string;
  addToCart?: EvaluateFn<Promise<boolean>>;
  queryStock: (el: string | null, url: string) => boolean;
};

type Stockist = Store & { image: string; page: Page };

const search: Store[] = [
  {
    title: "John Lewis",
    url:
      "https://www.johnlewis.com/sony-playstation-5-console-with-dualsense-controller/p5115192",
    selector: "#button--add-to-basket-out-of-stock",
    queryStock: (el: string | null) => el !== null && !/Out of stock/.test(el),
  },
  {
    title: "Amazon",
    url:
      "https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452",
    selector: "#outOfStock",
    queryStock: (el: string | null) => !el
  },
  {
    title: "Smyths Toys",
    url:
      "https://www.smythstoys.com/uk/en-gb/video-games-and-tablets/playstation-5/playstation-5-consoles/playstation-5-console/p/191259",
    selector: "#hdNotAvailable",
    queryStock: (el: string | null) =>
      el === null || !el.includes('value="true"'),
  },
  {
    title: "Smyths Toys (Digital Edition)",
    url:
      "https://www.smythstoys.com/uk/en-gb/video-games-and-tablets/playstation-5/playstation-5-consoles/playstation-5-digital-edition-console/p/191430",
    selector: "#hdNotAvailable",
    queryStock: (el: string | null) =>
      el === null || !el.includes('value="true"'),
  },
  {
    url: "https://www.shopto.net/en/ps5hw01-playstation-5-console-p191472/",
    title: "Shop-to",
    selector: "#itemcard_order_button_form_std > .not_available",
    queryStock: (el: string | null) => el === null,
  },
  {
    url:
      "https://www.box.co.uk/CFI-1015B-Sony-PlayStation-5-Digital-Edition-Conso_3199692.html",
    title: "Box (Digital Edition)",
    selector: "[data-procedure='Add to Basket']",
    queryStock: (el: string | null) => el !== null,
  },
  {
    url:
      "https://www.box.co.uk/CFI-1015A-Sony-Playstation-5-Console_3199689.html",
    title: "Box",
    selector: "[data-procedure='Add to Basket']",
    queryStock: (el: string | null) => el !== null,
  },
  {
    url: "https://www.board-game.co.uk/product/playstation-5/",
    title: "Board Game",
    queryStock: (_el: string | null, url: string) => {
      return !url.endsWith("ps5-update/");
    },
  },
  {
    url: "https://www.board-game.co.uk/product/playstation-5-digital-edition/",
    title: "Board Game (Digital Edition)",
    queryStock: (_el: string | null, url: string) => {
      return !url.endsWith("ps5-update/");
    },
  },
  {
    title: "Argos",
    url: "https://www.argos.co.uk/product/6795199",
    selector: "#h1title",
    queryStock: (el: string | null) =>
      el === null ||
      !el.includes("Sorry, PlayStation®5 is currently unavailable."),
  },
  {
    title: "Argos (Digital Edition)",
    url: "https://www.argos.co.uk/product/6795151",
    selector: "#h1title",
    queryStock: (el: string | null) =>
      el === null ||
      !el.includes("Sorry, PlayStation®5 is currently unavailable."),
  },
];

async function hasStock(page: Page, { selector, queryStock }: Store) {
  const selection = await page.evaluate((pageSelector): string | null => {
    const node = pageSelector && document.querySelector(pageSelector);

    return node ? node.outerHTML : node;
  }, selector || null);

  if (queryStock(selection, page.url())) {
    return true;
  }
  return false;
}

async function createPage(url: string, browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (!request.isNavigationRequest()) {
      request.continue();
      return;
    }
    // Add a new header for navigation request.
    const headers = request.headers();
    request.continue({
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "method": "GET",
        ["sec-ch-ua"]:
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        ["User-Agent"]:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36",
      },
    });
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
        const imagePath = `./.tmp/fail-${
          descriptor.title
        }.png`;
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

async function poll() {
  const browser = await puppeteer.launch();
  console.log("Checking stock...");
  const stockists = await getStockists(browser);
  stockists.forEach(async (descriptor) => {
    const { addToCart, page } = descriptor;
    if (addToCart) {
      await page.evaluate(addToCart);
    }
    page.close();
  });
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

(async function (interval: number = 60) {
  await report(await poll());
  if (interval > 0) {
    console.log(`Retrying again in ${interval} seconds...`);
    setInterval(async () => {
      report(await poll());
      console.log(`Retrying again in ${interval} seconds...`);
    }, interval * 1000);
  }
})(60);

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = __importDefault(require("puppeteer"));
var search = [
    {
        title: "John Lewis",
        url: "https://www.johnlewis.com/sony-playstation-5-console-with-dualsense-controller/p5115192",
        selector: ".add-to-basket-summary-and-cta .u-centred",
        isPageValid: function (el) {
            return el.includes("#button--add-to-basket-out-of-stock");
        },
        isInStock: function (el) {
            return el !== null && el.match(/Currently in stock online/) !== null;
        },
    },
    {
        title: "Amazon",
        url: "https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452",
        selector: "#add-to-cart-button",
        isPageValid: function (el) {
            return el.includes("Currently unavailable.");
        },
        isInStock: function (el) {
            return el !== null && el.includes("Add to Basket");
        },
    },
    {
        title: "Smyths Toys",
        url: "https://www.smythstoys.com/uk/en-gb/video-games-and-tablets/playstation-5/playstation-5-consoles/playstation-5-console/p/191259",
        selector: ".AddToCart-AddToCartAction #customAddToCartForm > #addToCartButton",
        isPageValid: function (el) {
            return el.includes('id="#hdNotAvailable"');
        },
        isInStock: function (el) {
            return el !== null;
        },
    },
    {
        title: "Smyths Toys (Digital Edition)",
        url: "https://www.smythstoys.com/uk/en-gb/video-games-and-tablets/playstation-5/playstation-5-consoles/playstation-5-digital-edition-console/p/191430",
        selector: ".AddToCart-AddToCartAction #customAddToCartForm > #addToCartButton",
        isPageValid: function (el) {
            return el.includes('id="#hdNotAvailable"');
        },
        isInStock: function (el) {
            return el !== null;
        },
    },
    {
        url: "https://www.shopto.net/en/ps5hw01-playstation-5-console-p191472/",
        title: "Shop-to",
        selector: ".itemcard_order_submit_button:not(:disabled)",
        isPageValid: function (el) {
            return el.includes("Sold out");
        },
        isInStock: function (el) {
            return el !== null;
        },
    },
    {
        url: "https://www.box.co.uk/CFI-1015B-Sony-PlayStation-5-Digital-Edition-Conso_3199692.html",
        title: "Box (Digital Edition)",
        selector: "[data-procedure='Add to Basket']",
        isPageValid: function (el) {
            return el.includes("Coming Soon") && el.includes("Request Stock Alert");
        },
        isInStock: function (el) {
            return el !== null;
        },
    },
    {
        url: "https://www.box.co.uk/CFI-1015A-Sony-Playstation-5-Console_3199689.html",
        title: "Box",
        selector: "[data-procedure='Add to Basket']",
        isPageValid: function (el) {
            // TODO: Add check for page validity
            return el.includes("Coming Soon") && el.includes("Request Stock Alert");
        },
        isInStock: function (el) {
            return el !== null;
        },
    },
    {
        url: "https://www.board-game.co.uk/product/playstation-5/",
        title: "Board Game",
        isInStock: function (el) {
            return el !== null;
        },
        selector: ".single_add_to_cart_button",
        isPageValid: function (el) {
            return el.includes("5 is currently unavailable.");
        },
    },
    {
        url: "https://www.board-game.co.uk/product/playstation-5-digital-edition/",
        title: "Board Game (Digital Edition)",
        isInStock: function (el) {
            return el !== null;
        },
        selector: ".single_add_to_cart_button",
        isPageValid: function (el) {
            return el.includes("5 is currently unavailable.");
        },
    },
    {
        title: "Argos",
        url: "https://www.argos.co.uk/product/6795199",
        selector: "[data-test='add-to-trolley-button-button']",
        isPageValid: function (el) {
            return el.includes("Sorry, PlayStation®5 is currently unavailable.");
        },
        isInStock: function (el) {
            return el !== null;
        },
    },
    {
        title: "Argos (Digital Edition)",
        url: "https://www.argos.co.uk/product/6795151",
        selector: "[data-test='add-to-trolley-button-button']",
        isPageValid: function (el) {
            return el.includes("Sorry, PlayStation®5 is currently unavailable.");
        },
        isInStock: function (el) {
            return el !== null;
        },
    },
];
function hasStock(page, _a) {
    var selector = _a.selector, isPageValid = _a.isPageValid, isInStock = _a.isInStock;
    return __awaiter(this, void 0, void 0, function () {
        var _b, selection, body;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.evaluate(function (pageSelector) {
                        var _a;
                        var node = pageSelector && document.querySelector(pageSelector);
                        return {
                            selection: node ? node.outerHTML : node,
                            body: (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.outerHTML,
                        };
                    }, selector || null)];
                case 1:
                    _b = _c.sent(), selection = _b.selection, body = _b.body;
                    if (isInStock(selection)) {
                        return [2 /*return*/, true];
                    }
                    if (body !== undefined && isPageValid(body)) {
                        return [2 /*return*/, false];
                    }
                    throw new Error("Page invalid - maybe a CAPTCHA?");
            }
        });
    });
}
function createPage(url, browser) {
    return __awaiter(this, void 0, void 0, function () {
        var page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, browser.newPage()];
                case 1:
                    page = _a.sent();
                    return [4 /*yield*/, page.setRequestInterception(true)];
                case 2:
                    _a.sent();
                    page.on("request", function (request) {
                        if (request.isNavigationRequest()) {
                            return request.continue();
                        }
                        request.abort();
                    });
                    return [4 /*yield*/, page.goto(url)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, page];
            }
        });
    });
}
function getStockists(browser) {
    return __awaiter(this, void 0, void 0, function () {
        var stockists, _i, search_1, descriptor, page, result, imagePath, imagePath, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stockists = [];
                    _i = 0, search_1 = search;
                    _a.label = 1;
                case 1:
                    if (!(_i < search_1.length)) return [3 /*break*/, 11];
                    descriptor = search_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 9, , 10]);
                    return [4 /*yield*/, createPage(descriptor.url, browser)];
                case 3:
                    page = _a.sent();
                    return [4 /*yield*/, hasStock(page, descriptor)];
                case 4:
                    result = _a.sent();
                    if (!result) return [3 /*break*/, 6];
                    imagePath = "./.tmp/" + descriptor.title + "-" + new Date().getTime() + ".png";
                    return [4 /*yield*/, page.screenshot({
                            path: imagePath,
                        })];
                case 5:
                    _a.sent();
                    stockists.push(__assign(__assign({}, descriptor), { page: page, image: imagePath }));
                    return [3 /*break*/, 8];
                case 6:
                    imagePath = "./.tmp/fail-" + descriptor.title + ".png";
                    return [4 /*yield*/, page.screenshot({
                            path: imagePath,
                        })];
                case 7:
                    _a.sent();
                    page.close();
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    e_1 = _a.sent();
                    console.error("Skipping " + descriptor.title + ": " + e_1);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11: return [2 /*return*/, stockists];
            }
        });
    });
}
function poll() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, stockists;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1.default.launch()];
                case 1:
                    browser = _a.sent();
                    console.log("Checking stock...");
                    return [4 /*yield*/, getStockists(browser)];
                case 2:
                    stockists = _a.sent();
                    stockists.forEach(function (descriptor) { return __awaiter(_this, void 0, void 0, function () {
                        var addToCart, page;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    addToCart = descriptor.addToCart, page = descriptor.page;
                                    if (!addToCart) return [3 /*break*/, 2];
                                    return [4 /*yield*/, page.evaluate(addToCart)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    page.close();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, browser.close()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, stockists];
            }
        });
    });
}
function report(stockists) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (stockists.length) {
                console.log("In stock at:\n\n" + stockists
                    .map(function (_a) {
                    var title = _a.title, url = _a.url, image = _a.image;
                    return title + " (" + image + ")\n===========\n" + url;
                })
                    .join("\n"));
            }
            else {
                console.log("No stock yet...");
            }
            return [2 /*return*/];
        });
    });
}
(function (interval) {
    if (interval === void 0) { interval = 10; }
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = report;
                    return [4 /*yield*/, poll()];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                case 2:
                    _b.sent();
                    if (interval > 0) {
                        console.log("Retrying again in " + interval + " minutes...");
                        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = report;
                                        return [4 /*yield*/, poll()];
                                    case 1:
                                        _a.apply(void 0, [_b.sent()]);
                                        console.log("Retrying again in " + interval + " minutes...");
                                        return [2 /*return*/];
                                }
                            });
                        }); }, interval * 60000);
                    }
                    return [2 /*return*/];
            }
        });
    });
})(5);

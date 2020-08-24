import express from "express";
import compression from "compression";
import { readFileSync } from "fs";
import { renderStatic } from "glamor/server";
import puppeteer from "puppeteer";
import React from "react";
import { renderToString } from "react-dom/server";

import { App } from "../client/App";
// import { getData, modifyAnswerUpvotes } from './database';

const app = new express();
const port = 7777;

// app.use(compression());
app.use(express.static("dist"));

// app.get("/data", async (_req, res) => {

//     res.json(await getData());

// });

// app.get("/vote/:answerId", (req, res) => {

//     const { query, params } = req;
//     modifyAnswerUpvotes(params.answerId, parseInt(query.increment));

// });

app.get("/", async (_req, res) => {
  // const { questions, answers } = await getData();

  const rendered = renderToString(<App />); // this could potentially be all we need to provide to an
  // renderToStaticMarkup may be better as it removes react-specific markup that we would not need for a static im

  const index = readFileSync(`public/index.html`, `utf8`);

  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    /** <script
  crossorigin
  src="https://unpkg.com/react@16/umd/react.development.js"
></script>
<script src="client.js"></script> */
    await page.addScriptTag({
      url: "https://unpkg.com/react@16/umd/react.development.js",
    });
    console.log();
    console.log(`Current directory: ${process.cwd()}`);
    await page.addScriptTag({ url: "/dist/client.js" });
    await page.evaluate(
      (index, rendered) => {
        const body = document.createElement("body");
        body.innerHTML = index.replace("{{rendered}}", rendered);
        document.body = body;
      },
      index,
      rendered
    );

    // // Remove scripts and html imports. They've already executed.
    // await page.evaluate(() => {
    // 	const elements = document.querySelectorAll('script, link[rel="import"]');
    // 	elements.forEach(e => e.remove());
    // });

    await page.screenshot({ path: "screenshot.png" });

    // Close the page we opened here (not the browser).
    await page.close();
  } catch (e) {
    const html = e.toString();
    console.warn({ message: `URL Failed with message: ${html}` });
    return { html, status: 500 };
  }

  res.send(index.replace("{{rendered}}", rendered));
});

app.listen(port);
console.info(`App listening on port ${port}`);

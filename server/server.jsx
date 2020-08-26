import express from 'express';
import compression from 'compression';
import { readFileSync } from 'fs';
import { renderStatic } from 'glamor/server';
import puppeteer from 'puppeteer';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { App } from '../client/App';

const app = new express();
const port = 7777;

// app.use(compression());
app.use(express.static('dist'));

// app.get("/data", async (_req, res) => {

//     res.json(await getData());

// });

// app.get("/vote/:answerId", (req, res) => {

//     const { query, params } = req;
//     modifyAnswerUpvotes(params.answerId, parseInt(query.increment));

// });

app.get('/', async (_req, res) => {
  // const { questions, answers } = await getData();
  const data = { name: 'bob' };
  const { html, css, ids } = renderStatic(() =>
    renderToString(<App {...data} />)
  );
  // renderToStaticMarkup may be better as it removes react-specific markup that we would not need for static rendering

  //   console.log("css, ids", css, ids);
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
      url: 'https://unpkg.com/react@16/umd/react.development.js',
    });
    console.log(`Current directory: ${process.cwd()}`);
    // await page.addScriptTag({ url: "/dist/client.js" });
    // await page.setContent(html);
    const style = await page.evaluate(
      (index, html, css) => {
        const head = document.createElement('head');
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.append(style);

        // Create our shared stylesheet:
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);

        // Apply the stylesheet to a document:
        document.adoptedStyleSheets = [sheet];

        const body = document.createElement('body');
        body.innerHTML = index.replace('{{rendered}}', html);
        document.body = body;
      },
      index,
      html,
      css
    );
    console.log('style', style);
    // // Remove scripts and html imports. They've already executed.
    // await page.evaluate(() => {
    // 	const elements = document.querySelectorAll('script, link[rel="import"]');
    // 	elements.forEach(e => e.remove());
    // });
    await page.screenshot({ path: 'public/screenshot.png' });
    const puppeteerHTML = await page.content();
    console.log('puppeteerHTML', puppeteerHTML);
    // Close the page we opened here (not the browser).
    await page.close();
    res.send(puppeteerHTML);
  } catch (e) {
    const html = e.toString();
    console.warn({ message: `URL Failed with message: ${html}` });
    return { html, status: 500 };
  }
});

app.listen(port);
console.info(`App listening on port ${port}`);

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

app.use(express.static('dist'));

// TODO: implement a test API call
// app.get("/data", async (_req, res) => {

//     res.json(await getData());

// });

app.get('/', async (_req, res) => {
  const data = { name: 'bb' };
  const { html, css, ids } = renderStatic(() =>
    renderToString(<App {...data} />)
  );
  console.log('css', css.toString());
  // renderToStaticMarkup may be better as it removes react-specific markup that we would not need for static rendering

  const index = readFileSync(`public/index.html`, `utf8`);

  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    // await page.addStyleTag({
    //   url: 'https://cloud.typography.com/6966154/6397212/css/fonts.css',
    // }); // Failing with 403, is something else needed?
    await page.addStyleTag({
      path: `node_modules/@pluralsight/ps-design-system-core/dist/index.css`,
    });
    await page.addStyleTag({
      content: css.toString(),
    });
    await page.addScriptTag({
      url: 'https://unpkg.com/react@16/umd/react.development.js',
    });

    // await page.

    await page.evaluate(
      (index, html) => {
        const body = document.createElement('body');
        body.innerHTML = index.replace('{{rendered}}', html);
        document.body = body;
      },
      index,
      html
      // css
      // psdsCss
    );

    await page.screenshot({ path: 'public/screenshot.png' });
    const puppeteerHTML = await page.content();

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

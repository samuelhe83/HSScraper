'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const db = require('./db/index.js');
const app = express();

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// app.use((req, res, next) => {});

app.get('/api/data', (req, res) => {
  db.connection.query('SELECT * FROM cards', (err, result, field) => {
    if (!err) {
      res.send(result);
    }
  });
});

app.get('/scraper', (req, res) => {
  // const config = {
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  //   }
  // };
  const url = 'http://wiki.teamliquid.net/hearthstone/List_of_Basic_Cards';
  request(url, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);

      const cardText = $('tbody')
        .find('tr')
        .text();
      let cards = cardText.split('\n');
      // console.log(cards[cards.length - 123]);
      let counter = 0;
      let card = [];
      let totalCards = [];

      for (let i = 10; i < cards.length - 123; i++) {
        // console.log(cards[i], counter);

        if (counter > 0) {
          if (counter === 6) {
            card.push(Number(cards[i]));
          } else {
            card.push(`"${cards[i]}"`);
          }
        }
        counter++;
        if (counter > 9) {
          counter = 0;
          let cardText = card.join(', ');
          let effect = card[8];
          // console.log(cardText);
          let queryStr = `INSERT INTO cards (name, rarity, class, type, subtype, cost, attack, hp, effect) VALUES (${cardText}) ON DUPLICATE KEY UPDATE effect=${effect}`;
          console.log(queryStr);
          card = [];
          db.connection.query(queryStr, function(err, results) {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    }
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

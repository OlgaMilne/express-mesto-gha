/* eslint-disable no-console */
const express = require('express');

const mongoose = require('mongoose');

const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Подключили'))
  .catch(() => console.log('Не подключили'));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6486c56e1a604befd0d6ce38',
  };
  next();
});

app.use(router);

app.listen(PORT, () => console.log(`Слушаю порт: ${PORT}`));

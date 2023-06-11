/* eslint-disable no-console */
const express = require('express');

const mongoose = require('mongoose');

const router = require('./routes');

const { PORT = 3002 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Подключили'))
  .catch(() => console.log('Не подключили'));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6484a2731724e606b05eb4de',
  };
  next();
});

app.use(router);

app.listen(PORT, () => console.log(`Слушаю порт: ${PORT}`));

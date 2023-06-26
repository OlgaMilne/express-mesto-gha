/* eslint-disable no-console */
const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');

const errorsHandler = require('./middlewares/errorsHandler');

const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Подключили'))
  .catch(() => console.log('Не подключили'));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => console.log(`Слушаю порт: ${PORT}`));

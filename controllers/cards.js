const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({
      message: 'Internal Server Error',
      error: err.message,
      stack: err.stack,
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user,
  })
    .then((card) => res.status(201).send({
      data: card,
      message: 'Карточка создана!',
    }))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Вы ввели некорректные данные!' });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          error: err.message,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({
      data: card,
      message: 'Карточку лайкнули!',
    }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Такая карточка не найдена!',
        });
      } else if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Вы ввели некорректные данные!' });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          error: err.message,
          stack: err.stack,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({
      data: card,
      message: 'Карточку дизлайкнули!',
    }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Такая карточка не найдена!',
        });
      } else if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Вы ввели некорректные данные!' });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          error: err.message,
          stack: err.stack,
        });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({
      data: card,
      message: 'Карточка удалена',
    }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Такая карточка не найдена!',
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          error: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};

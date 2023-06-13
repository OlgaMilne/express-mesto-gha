const Card = require('../models/card');

const {
  NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BAD_REQUEST_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
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
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({
          message: `Вы ввели некорректные данные: ${err.message}`,
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.send({
      data: card,
      message: 'Карточку лайкнули!',
    }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Такая карточка не найдена!',
        });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Вы ввели некорректные данные!',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.send({
      data: card,
      message: 'Карточку дизлайкнули!',
    }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Такая карточка не найдена!',
        });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Вы ввели некорректные данные!',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
        });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.send({
      data: card,
      message: 'Карточка удалена',
    }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Такая карточка не найдена!',
        });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Вы ввели некорректные данные!',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'На сервере произошла ошибка',
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

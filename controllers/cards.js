const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create(
    {
      name,
      link,
      owner: req.user,
    },
    { new: true, runValidators: true },
  )
    .then((card) => res.status(201).send({
      data: card,
      message: 'Карточка создана!',
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Вы ввели некорректные данные: ${err.message}`));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Такая карточка не найдена!'))
    .then((card) => res.send({
      data: card,
      message: 'Карточку лайкнули!',
    }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Такая карточка не найдена!'))
    .then((card) => res.send({
      data: card,
      message: 'Карточку дизлайкнули!',
    }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findOne(req.params.cardid)
    .orFail(() => new NotFoundError('Такая карточка не найдена!'))
    .then((card) => {
      if (card.owner === req.user) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => res.send({
            data: deletedCard,
            message: 'Карточка удалена',
          }));
      } else {
        return Promise.reject(new ForbiddenError('У Вас нет прав на удаление карточки!'));
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};

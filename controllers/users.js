const User = require('../models/user');

const {
  NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BAD_REQUEST_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Такой пользователь не найден!',
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

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send({
      data: user,
      message: 'Профиль пользователя создан!',
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

const updateUserProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => {
      res.send({
        data: user,
        message: 'Профиль пользователя обновлен!',
      });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Такой пользователь не найден!',
        });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Вы ввели некорректные данные!',
        });
      } else if (err.name === 'ValidationError') {
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

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => {
      res.send({
        data: user,
        message: 'Аватар пользователя обновлен!',
      });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND_ERROR).send({
          message: 'Такой пользователь не найден!',
        });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: 'Вы ввели некорректные данные!',
        });
      } else if (err.name === 'ValidationError') {
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};

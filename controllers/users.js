const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({
      message: 'Internal Server Error',
      error: err.message,
      stack: err.stack,
    }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Такой пользователь не найден!',
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

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send({
      data: user,
      message: 'Профиль пользователя создан!',
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

const updateUserProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true })
    .orFail(() => new Error('Not found'))
    .then((user) => {
      res.status(200).send({
        data: user,
        message: 'Профиль пользователя обновлен!',
      });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Такой пользователь не найден!',
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

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .orFail(() => new Error('Not found'))
    .then((user) => {
      res.status(200).send({
        data: user,
        message: 'Аватар пользователя обновлен!',
      });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Такой пользователь не найден!',
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};

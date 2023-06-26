const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const ForbiddenError = require('../errors/forbidden-err');

const login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcryptjs.compare(req.body.password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ForbiddenError('Неправильные почта или пароль'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        'some-secret-key',
        {
          expiresIn: 3600 * 24 * 7,
        },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 23 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .end();
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Такой пользователь не найден!'))
    .then((user) => res.send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError('Такой пользователь не найден!'))
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return Promise.reject(new ConflictError('Такой пользователь уже существует!'));
      }
      return bcryptjs.hash(String(req.body.password), 10)
        .then((hash) => {
          User.create({
            ...req.body,
            password: hash,
          })
            .then((newUser) => {
              const {
                _id,
                name,
                about,
                avatar,
                email,
              } = newUser;
              res.status(201).send({
                data: {
                  _id,
                  name,
                  about,
                  avatar,
                  email,
                },
                message: 'Профиль пользователя создан!',
              });
            })
            .catch((err) => {
              next(err);
            });
        });
    })
    .catch((err) => {
      next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true },
  )
    .orFail(() => new NotFoundError('Такой пользователь не найден!'))
    .then((user) => {
      res.send({
        data: user,
        message: 'Профиль пользователя обновлен!',
      });
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Такой пользователь не найден!'))
    .then((user) => {
      res.send({
        data: user,
        message: 'Аватар пользователя обновлен!',
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Вы ввели некорректные данные!'));
      } else if (err.message.includes('Validation failed')) {
        next(new BadRequestError('Некорректный URL!'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};

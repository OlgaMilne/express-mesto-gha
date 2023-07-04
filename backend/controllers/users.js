const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const logIn = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcryptjs.compare(req.body.password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    })
    .then((passedUser) => {
      const token = jwt.sign(
        {
          _id: passedUser._id,
        },
        NODE_ENV === 'production' ? JWT_SECRET_KEY : 'some-secret-key',
        {
          expiresIn: 3600 * 24 * 7,
        },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 23 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: NODE_ENV === 'production',
      });
      res.send({
        _id: passedUser._id,
        email: passedUser.email,
        name: passedUser.name,
        about: passedUser.about,
        avatar: passedUser.avatar,
      });
    })
    .catch(next);
};

const logOut = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Пользователь вышел' });
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
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Вы ввели некорректный запрос!'));
      } else {
        next(err);
      }
    });
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
            email: req.body.email,
            password: hash,
            name: req.body.name,
            about: req.body.about,
            avatar: req.body.avatar,
          })
            .then((newUser) => {
              res.status(201).send({
                _id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                about: newUser.about,
                avatar: newUser.avatar,
              });
            })
            .catch((err) => {
              if (err.name === 'ValidationError') {
                next(new BadRequestError('Вы ввели некорректные данные!'));
              } else {
                next(err);
              }
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
    {
      name: req.body.name,
      about: req.body.about,
    },
    { new: true },
  )
    .orFail(() => new NotFoundError('Такой пользователь не найден!'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Вы ввели некорректные данные!'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Такой пользователь не найден!'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Вы ввели некорректный запрос!'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный URL!'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  logIn,
  logOut,
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};

const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, getCurrentUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;

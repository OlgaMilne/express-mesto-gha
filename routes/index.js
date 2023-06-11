const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('/*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует.' });
});

module.exports = router;

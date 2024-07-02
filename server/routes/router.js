const Router = require('express');
const router = Router();

const authorRouter = require('./authorRouter');
const bookRouter = require('./bookRouter');
const genreRouter = require('./genreRouter');
const reviewRouter = require('./reviewRouter');
const userRouter = require('./userRouter');

router.use('/author', authorRouter);
router.use('/book', bookRouter);
router.use('/genre', genreRouter);
router.use('/review', reviewRouter);
router.use('/user', userRouter);

module.exports = router;
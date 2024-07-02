const Router = require('express');
const router = Router();

const BookController = require('../controllers/bookController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', checkRoleMiddleware("ADMIN"), BookController.create);
router.get('/', BookController.getAll);
router.get('/:id', BookController.getOne);
router.post('/all-info', BookController.getBooksForHomepage);
router.post('/get-by-ganres', BookController.getBooksByGenres);
router.get('/details-by-id/:id', BookController.getBookDetailsById);

router.get('/:id/reviews', BookController.getBookReviews);

module.exports = router;
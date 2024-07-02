const Router = require('express');
const router = Router();

const ReviewController = require('../controllers/reviewController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', checkRoleMiddleware("USER"), ReviewController.create);
router.get('/', ReviewController.getAll);
router.get('/:id', ReviewController.getOne);

module.exports = router;
const Router = require('express');
const router = Router();

const GenreController = require('../controllers/genreController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', checkRoleMiddleware("ADMIN"), GenreController.create);
router.get('/', GenreController.getAll);
router.get('/:id', GenreController.getOne);

module.exports = router;
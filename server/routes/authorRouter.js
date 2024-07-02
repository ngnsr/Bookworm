const Router = require('express');
const router = Router();

const AuthorController = require('../controllers/authorController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');


router.post('/', checkRoleMiddleware("ADMIN"), AuthorController.create);
router.get('/', AuthorController.getAll);
router.get('/:id', AuthorController.getOne);
router.post('/find-by-name/', AuthorController.findByName);
router.get('/:id/details', AuthorController.getAuthorDetailsById)
router.get('/get-genres/:id', AuthorController.getGenres)

module.exports = router;
const { Genre} = require('../db/models');
const ApiError = require('../errors/ApiError');

class GenreController {

    async create(req, res, next) {
        try {
            const { name } = req.body;

            if (!name) {
                throw new Error('Не всі обов\'язкові поля заповнені.');
            }

            const genre = await Genre.findOrCreate({
                where: {name}
            });
            return res.json(genre[0]);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const genres = await Genre.findAll();
        return res.json(genres);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const room = await Genre.findByPk(id);
        return res.json(room);
    }
}

module.exports = new GenreController();
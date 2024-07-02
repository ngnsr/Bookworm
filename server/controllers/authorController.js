const ApiError = require('../errors/ApiError');
const {Author, Book, Genre} = require("../db/models");
const {Sequelize} = require("sequelize");

class AuthorController {

    async create(req, res, next) {
        try {
            const { firstName, lastName, biography } = req.body;
            if (!firstName || !lastName || !biography) {
                throw new Error('Не всі обов\'язкові поля заповнені.');
            }

            const author = await Author.create({firstName, lastName, biography });
            return res.json(author);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const authors = await Author.findAll({attributes: ['id', 'first_name', 'last_name']});
        return res.json(authors);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const author = await Author.findByPk(id);
        return res.json(author);
    }

    async findByName(req, res, next){
        try {
            const { name } = req.query;
            let authors;
            if (name) {
                authors = await Author.findAll({
                    where: {
                        [Sequelize.Op.or]: [
                            { firstName: { [Sequelize.Op.iLike]: `%${name}%` } },
                            { lastName: { [Sequelize.Op.iLike]: `%${name}%` } }
                        ]
                    },
                    attributes: ['id', 'first_name', 'last_name']
                });
            } else {
                authors = await Author.findAll();
            }
            res.json(authors);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAuthorDetailsById(req, res, next){
        try {
            const id = req.params.id;
            const author = await Author.findByPk(id, {
                include: [Book],
                attributes: ['id', 'first_name', 'last_name', 'biography']}
            );

            if (!author) {
                return res.status(404).json({ error: 'Автор не знайдений' });
            }

            return res.json(author);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getGenres(req, res, next){
        try {
            const id = req.params.id;
            const author = await Author.findByPk(id, {
                include: [{model: Book, include: Genre}],
                attributes: []
                }
            );

            if (!author) {
                return res.status(404).json({ error: 'Автор не знайдений' });
            }
            console.log(author);
            const authorGenres = [];

            author.Books.forEach(book => {
                book.Genres.forEach(genre => {
                    if (!authorGenres.some(g => g.id === genre.id)) {
                        authorGenres.push(genre);
                    }
                });
            });

            return res.json(authorGenres);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }

    }
}

module.exports = new AuthorController();
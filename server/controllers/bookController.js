const { Book, BookGenre, Author, Genre, Review, User} = require('../db/models');
const ApiError = require('../errors/ApiError');
const {Sequelize} = require("sequelize");

class BookController {

    async create(req, res, next) {
        try {
            const { title, year, description, author_id, genre_ids } = req.body;

            if (!title || !year || !description || !author_id || !genre_ids || !Array.isArray(genre_ids) || genre_ids.length === 0) {
                throw new Error('Не всі обов\'язкові поля заповнені.');
            }

            const book = await Book.create({ title, year, description, AuthorId : author_id });

            const bookGenreData = genre_ids.map(id => ({ BookId: book.id, GenreId: id }));

            await BookGenre.bulkCreate(bookGenreData);

            return res.json(book);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const books = await Book.findAll();
        return res.json(books);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const book = await Book.findByPk(id);
        return res.json(book);
    }

    async getBooksForHomepage(req, res, next) {
        try {
            const books = await Book.findAll({
                include: [
                    {
                        model: Author,
                        attributes: ['first_name', 'last_name'],
                    },
                    {
                        model: Genre,
                        attributes: ['name'],
                        through: { attributes: [] },
                    },
                ],
                attributes: ['id', 'title', 'year', 'rating']
            });
            res.json(books);
        } catch (error) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getBooksByGenres(req, res, next){
        try {
            const genreIds = req.body.genre_ids;
            const options = {
                include: [
                    {
                        model: Author,
                        attributes: ['first_name', 'last_name'],
                    },
                    {
                        model: Genre,
                        attributes: ['name'],
                        through: { attributes: [] },
                    },
                ],
            };

            if (genreIds && genreIds.length > 0) {
                options.include[1].where = { id: genreIds};
            }

            const books = await Book.findAll(options);
            res.json(books);
        } catch (error) {
            next(error);
        }
    }

    async getBookDetailsById(req, res, next){
        try {
            const bookId = req.params.id;
            const book = await Book.findByPk(bookId, { include: ['Author', 'Genres'] });

            if (!book) {
                return res.status(404).json({ error: 'Книга не знайдена' });
            }

            return res.json(book);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getBookReviews(req, res, next){
        try {
            const id = req.params.id;
            const reviews = await Review.findAll({
                where: { book_id: id },
                include: [{ model: User, attributes: ['email', 'role']}]
            });
            return res.json(reviews);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}


module.exports = new BookController();
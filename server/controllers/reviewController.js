const ApiError = require('../errors/ApiError');
const { Review, Book} = require('../db/models');
const jwt = require("jsonwebtoken");
const sequelize = require('../db/db');

class ReviewController {

    async create(req, res, next) {
        let transaction = await sequelize.transaction();

        try {
            const { text, rating, book_id } = req.body;

            const token = req.cookies.access_token;
            if (!token) {
                throw new Error('Токен відсутній.');
            }

            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const user_id = decodedToken.id;

            if (!text || !rating || !book_id || !user_id) {
                throw new Error('Не всі обов\'язкові поля заповнені.');
            }

            const review = await Review.create({ text, rating, BookId: book_id, UserId: user_id });

            // const reviewsNumber = await Review.count({where: {BookId:book_id}})

            // TODO: fix avg rating
            const book = await Book.findByPk(book_id, { transaction });

            const newRating = parseFloat(book.rating) + parseFloat(rating);
            let averageRating = newRating / 2;

            if(parseFloat(book.rating) === 0){
                averageRating = parseFloat(rating);
            }

            await book.update({
                rating: averageRating,
            }, { transaction });

            await transaction.commit();

            return res.json(review);
        } catch (e) {
            await transaction.rollback();
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const reviews = await Review.findAll();
        return res.json(reviews);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        return res.json(review);
    }
}

module.exports = new ReviewController();
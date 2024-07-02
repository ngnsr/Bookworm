const sequelize = require('./db');

const {DataTypes} = require('sequelize');

const Book = sequelize.define('Book', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    year: {type: DataTypes.INTEGER, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    rating: {type: DataTypes.DECIMAL, defaultValue: 0}
});

const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, validate: {isEmail: true}, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "USER", allowNull: false}
});

const Review = sequelize.define('Review', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.TEXT, allowNull: false},
    rating: {type: DataTypes.DECIMAL, defaultValue: 0, validate: {min: 0, max: 5}, allowNull: false}
});

const Author = sequelize.define('Author', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    biography: {type: DataTypes.TEXT}
});

const Genre = sequelize.define('Genre', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true}
});

const BookGenre = sequelize.define('BookGenre', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const UserWishlist = sequelize.define('UserWishlist', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

Review.belongsTo(Book);
Book.hasMany(Review);

Review.belongsTo(User);
User.hasMany(Review);

Author.hasMany(Book);
Book.belongsTo(Author);

Book.belongsToMany(Genre, { through: 'BookGenre' });
Genre.belongsToMany(Book, { through: 'BookGenre' });

Book.belongsToMany(User, { through: 'UserWishlist' });
User.belongsToMany(Book, { through: 'UserWishlist' });

module.exports = {
    User,
    Book,
    Author,
    Genre,
    Review,
    BookGenre,
    UserWishlist
};
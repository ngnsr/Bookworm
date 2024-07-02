const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const apiError = require('../errors/ApiError');
const {User} = require('../db/models');

const generateJWT = (id, email, role) => {
    return jwt.sign(
        {id: id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );
}

class UserController {
    async registration(req, res, next) {
        try {
            const {email, password} = req.body;
            let {role} = req.body;

            if (!email || !password) {
                return next(apiError.badRequest("Пустий імейл або пароль"));
            }

            if (!role) {
                role = "USER";
            }

            const candidate = await User.findOne({where: {email}});

            if (candidate) {
                return next(apiError.badRequest("Користувач з таким ім'ям вже існує"));
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const user = await User.create({email, password: hashPassword, role});

            const token = generateJWT(user.id, user.email, user.role);
            return res
                .cookie("access_token", token, {
                    httpOnly: true,
                    sameSite: true
                })
                .status(200)
                .json({message: "Registration is successful 😊 👌"});
        } catch (e) {
            return next(apiError.badRequest(e.message));
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({where: {email}});
            if (!user) {
                return next(apiError.forbidden("Неправильний пароль або логін"));
            }

            let comparePassword = bcrypt.compareSync(password, user.password);

            if (!comparePassword) {
                return next(apiError.forbidden("Неправильний пароль або логін"));
            }

            const token = generateJWT(user.id, user.email, user.role);

            return res
                .cookie("access_token", token, {
                    httpOnly: true,
                    sameSite: true
                })
                .status(200)
                .json({message: "Logged in successfully 😊 👌"});
        } catch (e) {
            return next(apiError.badRequest(e.message));
        }
    }

    async check(req, res, next) {
        return res.sendStatus(200);
    }

    async getRole(req, res, next) {
        const token = req.cookies.access_token;
        if (!token) {
            return res.sendStatus(401);
        }
        try {
            req.user = jwt.verify(token, process.env.SECRET_KEY);

            return res.json({role: req.user.role});
        } catch {
            return res.sendStatus(401);
        }
    }

    async logout(req, res, next) {
        return res
            .clearCookie("access_token")
            .status(200)
            .json({message: "Successfully logged out 😏 🍀"});
    }
}

module.exports = new UserController();
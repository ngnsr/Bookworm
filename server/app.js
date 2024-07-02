require('dotenv').config();

const express = require('express');
const path = require('path');
const sequelize = require('./db/db');
const cookieParser = require('cookie-parser');
const router = require('./routes/router');
const PORT = process.env.PORT || 8888;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/api", router);

app.use(express.static(path.join(__dirname, '../client/public')));

(async () => {
    try{
        await sequelize.sync({force: false});
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })
    }catch(e){
        console.log(e);
    }
})();

module.exports = app;

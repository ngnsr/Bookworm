# 📚 Bookworm

This is the backend part of the **Bookworm** project built with Node.js, Express, and PostgreSQL.

## ⚙️ Quick Start

1. **Clone the repository** and navigate to the server directory:

   ```bash
   git clone https://github.com/ngnsr/Bookworm
   cd bookworm/server
   ```

2. **Create a `.env` file** inside `bookworm/server` with the following content:

   ```
   DB_NAME=bookworm
   DB_USER=user
   DB_PASSWORD=password
   DB_HOST=localhost
   DB_PORT=5432

   PORT=3333
   SECRET_KEY=secret
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Install PostgreSQL**  
   Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/). This is a very quick setup — just a few clicks.

5. **Create the database**  
   Use pgAdmin or a terminal to create a new database named:

   ```
   bookworm
   ```

   Make sure the database user and password match those in your `.env` file (`user` / `password`).

## 👤 How to create an admin user

To create an admin account:

1. Temporarily modify the code to assign the `admin` role during user registration.
2. Register a new user (this will become the admin).
3. Revert the code back to its original state.

## 🚀 Run the server

```bash
npm start
```

The server will run at `http://localhost:3333`.

## 📝 Notes

- The `.env` file should never be committed to the repository.
- Frontend use hardcoded port 3333!
---

Feel free to contribute or customize the setup as needed!

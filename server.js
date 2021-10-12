import express from "express";
import mysql from "mysql";
import cors from 'cors';

const port = 3000;
const app = express();

const corsOptions = {
    origin: "http://localhost:4200"
};

const dbConfig = {
    host: "localhost",
    user: "gedaspupa",
    password: "gedaspupa123",
    database: "books",
    multipleStatements: false,

};

const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
});

connection.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

app.use(cors(corsOptions));
app.use(express.json());

app.get("/test-conn", (req, res) => {
    connection.query("SELECT 1 + 1 AS solution", (err, rows, fields) => {
        if (err) throw err;
        console.log("The solution is: ", rows[0].solution);
        res.status(200).send({ solution: rows[0].solution });
    });
});

app.get("/records-sum", (req, res) => {
    connection.query("SELECT count(*) as total_records FROM books_table", (err, rows, fields) => {
        if (err) throw err;
        console.log("Books total records: ", rows[0].total_records);
        res.status(200).send({ total_records: rows[0].total_records });
    });
});

// app.get("/milk-sum", (req, res) => {
//     connection.query("SELECT sum(total_milk) as total_milk_sum FROM books_table", (err, rows, fields) => {
//         if (err) throw err;
//         console.log("Milk total sum: ", rows[0].total_milk_sum);
//         res.status(200).send({ total_milk_sum: rows[0].total_milk_sum });
//     });
// });

app.get("/books", (req, res) => {
    connection.query("SELECT * FROM books_table", (err, rows, fields) => {
        if (err) throw err;
        res.status(200).send(rows);
    });
});

app.get("/books/:id", (req, res) => {
    connection.query(
        "SELECT * FROM books_table WHERE id = ?",
        req.params.id,
        (err, rows, fields) => {
            if (err) throw err;
            res.status(200).send(rows);
        }
    );
});

app.post("/books", (req, res) => {
    connection.query(
        "INSERT INTO books_table (`title`, `author`, `category`, `pages`) VALUES (?, ?, ?, ?)",
        [
            req.body.title,
            req.body.author,
            req.body.category,
            req.body.pages,
        ],
        // TODO :: check if this can be simplify
        // "INSERT INTO Cows VALUES (?)",
        // req.body,
        (err, rows, field) => {
            if (err) throw err;
            console.log("created: ", { id: rows.insertId, ...req.body });
            res.status(201).send({ id: rows.insertId, ...req.body });
        }
    );
});

app.put("/books/:id", (req, res) => {
    connection.query(
        "UPDATE books_table SET title = ?, author = ?, category = ?, pages = ? WHERE id = ?",
        [
            req.body.title,
            req.body.author,
            req.body.category,
            req.body.pages,
            req.params.id,
        ],
        (err, rows, field) => {
            if (err) throw err;
            console.log("updated: ", { rows });
            res.status(201).send({id: parseInt(req.params.id), ...req.body});
        }
    ); 
});

app.delete("/books/:id", (req, res) => {
    // console.log(req.params.id);
    connection.query(
        "DELETE FROM books_table WHERE id=?",
        req.params.id,
        (err, rows, field) => {
            if (err) throw err;
            console.log("deleted: ", rows);
            // TODO :: should we return 204 when there affectedRows:0
            res.status(204).send();
        }
    );
});

app.listen(port, () =>
    console.log(`Port: ${port}!`)
);



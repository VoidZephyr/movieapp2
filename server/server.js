const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movies_db',
    password: 'your_new_password',
    port: 5432,
});


app.use(cors());
app.use(bodyParser.json());

// Get movies route
app.get('/movies/search', async (req, res) => {
    try {
        const searchTerm = req.query.q.toLowerCase(); // Get the query parameter
        const result = await pool.query(
            'SELECT * FROM movies WHERE LOWER(title) LIKE $1',
            [`%${searchTerm}%`]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).send('Error searching movies');
    }
});


app.post('/movies', async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO movies (title, is_user_added) VALUES ($1, $2) RETURNING *',
            [title, true]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).send('Error adding movie');
    }
});


app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM movies WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).send('Error deleting movie');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

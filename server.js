const express = require('express');
const axios = require('axios');
const { connection } = require("./config/db");
const { Repository } = require('./model/github.model');

const app = express();

app.use(express.json());

// Save GitHub Data to MongoDB
app.post('/github', async (req, res) => {
    try {
        const { url } = req.body;

        // Fetch GitHub data
        const response = await axios.get(url);
        const githubData = response.data;

        // Save data to MongoDB
        for (const repo of githubData) {
            const {
                id,
                name,
                html_url,
                description,
                created_at,
                open_issues,
                watchers, 
                owner,
            } = repo;

            // Use the Mongoose model to create or update
            const result = await Repository.findOneAndUpdate(
                { id },
                {
                    $set: {
                        id,
                        name,
                        html_url,
                        description,
                        created_at,
                        open_issues,
                        watchers,
                        owner,
                    },
                },
                { upsert: true, new: true } // new: true returns the updated document
            );

            console.log(`Repository ${name} saved or updated: ${result.id}`);
        }
        res.status(200).json({ message: `GitHub data has been saved to MongoDB` });
    } catch (error) {
        console.error('Error on saving GitHub data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve GitHub Data from MongoDB
app.get('/github/:id', async (req, res) => {
    try {
        const repositoryId = parseInt(req.params.id);
        const repository = await Repository.findOne({ id: repositoryId });

        if (!repository) {
            res.status(404).json({ error: 'Repository not found' });
            return;
        }

        res.status(200).json(repository);
    } catch (error) {

        console.error('Error retrieving GitHub data:', error.message);

        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/github", async (req, res) => {
    try {
        const repository = await Repository.find();

        res.status(200).json(repository);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (err) {
        console.log(err);
        console.log("Error connecting to the database");
    }
    console.log(`Server listening on port ${PORT}`);
});


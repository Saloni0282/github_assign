const mongoose = require('mongoose');

// Define the Mongoose schema for the owner
const ownerSchema = new mongoose.Schema({
    id: Number,
    avatar_url: String,
    html_url: String,
    type: String,
    site_admin: Boolean,
});

// Define the Mongoose schema for the collection
const repositorySchema = new mongoose.Schema({
    id: Number,
    name: String,
    html_url: String,
    description: String,
    created_at: Date,
    open_issues: Number,
    watchers: Number,
    owner: ownerSchema, // Use the nested schema for the owner
});

// Create the Mongoose model
const Repository = mongoose.model('Repository', repositorySchema);

module.exports = { Repository };
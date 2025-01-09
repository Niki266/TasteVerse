# TasteVerse - Recipe Recommendation System 🍴

TasteVerse is a group project that offers a personalized recipe recommendation system. The project is built to simplify meal planning and enhance user experiences with curated recipes.

## 🚀 Features
- Personalized recipe recommendations based on user preferences.
- Integration with a curated recipe database.
- User-friendly interface powered by EJS templates.
- Robust backend using Node.js and SQLite.

## 🛠️ Setup Instructions

### CSV File Information
- The provided CSV file includes an added `id` column, making it slightly different from the original Kaggle dataset.

### Troubleshooting Guide
1. **If the website fails to run**, ensure the following packages are installed via `npm`:
   ```bash
   npm install express-flash express-session bcrypt sqlite3 passport passport-local ejs date-fns body-parser express
   ```

2. **If no images or recipe names are displayed**, run the following commands:
   ```bash
   sqlite3 database.db
   .mode csv
   import "path/to/Allrecipes.csv" recipes
   ```
   - Ensure to replace any `\` with `/` in the path to `Allrecipes.csv`.

## 📂 Project Structure
```
TasteVerse-main
├── assets                     # Contains images and other assets
├── public                     # Frontend public files
├── views                      # EJS templates for rendering pages
├── routes                     # Application routes
├── database.db                # SQLite database
├── app.js                     # Main server file
└── package.json               # Node.js dependencies
```

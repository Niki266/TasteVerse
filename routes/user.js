const express = require("express");
const router = express.Router();
const assert = require('assert');
const passport=require('passport')
const session=require('express-session')
const bcrypt= require('bcrypt');

const {ifAuthenticated}=require('./auth.js') 


// Protected route - dashboard  TO ADD BACK
router.get('/main',ifAuthenticated, (req, res) => {
    res.render('main');
  }
);


// var shoppingList=[];


/**
 * @desc Renders to shoppinglist page WORKING
 */
router.get('/list', ifAuthenticated, (req, res) => { //WORKING DO NOT DELETE 
  db.all('SELECT * FROM shoppingRecord', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }

    res.render('shoppinglist', { shoppingList: rows });
  });
});


/**
 * @desc When a new item is added to the shopping list  WORKING
 */
router.post('/list', (req, res) => { //WORKING DO NOT DELETE
  const newItem = req.body.item;
  const quantity = req.body.quantity;

  if (newItem.trim() !== '') {
    db.run('INSERT INTO shoppingRecord (shopping_item, shopping_quantity) VALUES (?, ?)', [newItem, quantity], (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Internal Server Error');
      }

      res.redirect('/user/list');
    });
  } else {
    // Handle empty item name, if needed.
    res.redirect('/user/list');
  }
});



/**
 * @desc handles the checkboxes in shoppinglist page WORKING
 */
router.post('/handle-checkboxes', (req, res) => { //WORKING DO NOT DELETE
  const checkedIndexes = req.body.done;

  if (checkedIndexes) {
    checkedIndexes.forEach((index) => {
      db.run('DELETE FROM shoppingRecord WHERE shopping_id = ?', [index], (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send('Internal Server Error');
        }
      });
    });
  }

  res.redirect('/user/list');
});


/**
 * @desc Renders to myRecipe page WORKING
 */
router.get('/myRecipe',ifAuthenticated, (req,res) => {
  global.db.all("SELECT * FROM recipePage",function(err,data){
    if(err){
      console.log("error in myRecipe")
    }
    else{
      res.render("myRecipe.ejs",{myRecipe:data})
    }
  })
});



/**
 * @desc Renders to mealplanner page WORKING
 */
router.get('/planner',ifAuthenticated, (req, res) => {
  const today = new Date();

  let year = parseInt(req.query.year) || today.getFullYear();
  let month = parseInt(req.query.month) || today.getMonth();
  
  if (month < 0) {
    month = 11; // Wrap to December of the previous year
    year--;
  } else if (month > 11) {
    month = 0; // Wrap to January of the next year
    year++;
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selectedDate = req.query.date || null;

  res.render('mealplanner', { year, month, firstDay, daysInMonth, selectedDate });
});




/**
 * @desc When a user saves data for the calendar, saves into table and redirects back to planner WORKING
 */
router.post('/save-calendar-data', (req, res) => {
  const user_id = req.user_id;
  const date = req.body.date;
  const breakfast = req.body.breakfast;
  const breakfastCalories = parseInt(req.body.breakfast_calories) || 0;
  const lunch = req.body.lunch;
  const lunchCalories = parseInt(req.body.lunch_calories) || 0;
  const dinner = req.body.dinner;
  const dinnerCalories = parseInt(req.body.dinner_calories) || 0;

  const totalCalories = breakfastCalories + lunchCalories + dinnerCalories;

  // Insert the data into the calendar table
  db.run(
    "INSERT OR REPLACE INTO calendar (user_id, date, breakfast, breakfast_calories, lunch, lunch_calories, dinner, dinner_calories, total_calories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [user_id, date, breakfast, breakfastCalories, lunch, lunchCalories, dinner, dinnerCalories, totalCalories],
    function (err) {
      if (err) {
        console.error('Error saving calendar data:', err);
        res.status(500).send('Error saving calendar data');
      } else {
        // res.status(200).send('Calendar data saved successfully');
        res.redirect('/user/planner');
      }
    }
  );
});

































///////////////////////////////////////////// HELPERS ///////////////////////////////////////////

// /**
//  * @desc A helper function to generate a random string
//  * @returns a random lorem ipsum string
//  */
// function generateRandomData(numWords = 5) {
//   const str =
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

//   const words = str.split(" ");

//   let output = "";

//   for (let i = 0; i < numWords; i++) {
//     output += choose(words);
//     if (i < numWords - 1) {
//       output += " ";
//     }
//   }

//   return output;
// }

// /**
//  * @desc choose and return an item from an array
//  * @returns the item
//  */
// function choose(array) {
//   assert(Array.isArray(array), "Not an array");
//   const i = Math.floor(Math.random() * array.length);
//   return array[i];
// }



module.exports = router;

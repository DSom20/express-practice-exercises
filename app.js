const express = require('express');
const ExpressError = require('./expressError')

const app = express();

app.get("/mean", function(req, res, next) {
  try {
    if (!req.query.nums) throw new ExpressError(`nums are required`, 400);
    let numsArray = req.query.nums.split(",").map((val) => {
      let num = parseInt(val);
      if (isNaN(num)) throw new ExpressError(`${val} is not a number`, 400);
      return num;
    });
    let sum = numsArray.reduce((acc, val) => acc + val);
    let mean = sum / numsArray.length;
  
    return res.json({ response : {
      operation: "mean",
      value: mean
    }})
  } catch (err) {
    return next(err);
  }


});

app.get("/median", function(req, res) {
  try {
    let numsArray = req.query.nums.split(",").map(val => parseInt(val));
    let sortedAsc = numsArray.sort((a, b) => a - b);
    let midpoint = numsArray.length / 2;
    let median;
    if (numsArray.length % 2 === 0) {
      median = (sortedAsc[midpoint - 1] + sortedAsc[midpoint]) / 2;
    } else {
      median = sortedAsc[Math.floor(midpoint)]
    }

    return res.json({ response : {
      operation: "median",
      value: median
    }})
  } catch (err) {
    return next(err);
  }
  
});

app.get("/mode", function(req,res) {
  let frequencyCounter = {};
  let numsArray = req.query.nums.split(",").map(val => parseInt(val));
  for (num of numsArray) {
    frequencyCounter[num] = frequencyCounter[num] || 0;
    frequencyCounter[num] = frequencyCounter[num] + 1;
  }
  let maxFrequency = 0;
  for (key in frequencyCounter) {
    if (frequencyCounter[key] > maxFrequency) {
      maxFrequency = frequencyCounter[key];
    }
  }
  let modeArray = [];
  for (key in frequencyCounter) {
    if (frequencyCounter[key] === maxFrequency) {
      modeArray.push(key);
    }
  }

  return res.json({ response : {
    operation: "mode",
    value: modeArray
  }})
})


app.use(function(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: { message, status }
  });
});








app.listen(3000, function() {
  console.log("Server listening on port 3000");
})
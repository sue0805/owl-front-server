const express = require('express');
const path = require('path');
const router = express.Router();

router.post('*', (req, res, next) => {
  res.status(404).send("경로 에러");
});

router.get('*', (req, res, next) => {
  res.status(404).send("경로 에러");
});

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
});

module.exports = router;
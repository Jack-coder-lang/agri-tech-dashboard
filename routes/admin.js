const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/auth');

router.get('/dashboard', verifyAdmin, (req, res) => {
  res.json({ message: 'Bienvenue Admin !' });
});

module.exports = router;

const express = require('express')

const router = express.Router()
const salaryController = require('../controllers/salaryController');
const auth = require('../middlewares/auth');

router.get("/",auth, salaryController.getAll);
router.post("/",auth, salaryController.addSalary);

module.exports = router
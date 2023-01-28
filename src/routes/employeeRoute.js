const express = require('express')

const router = express.Router()
const employeeController = require('../controllers/employeeContoller');
const auth = require('../middlewares/auth');

router.get("/",auth, employeeController.getAll);
router.post("/",auth, employeeController.createEmployee);
router.patch("/:id",auth, employeeController.updateEmplyee);
router.delete("/:id",auth, employeeController.deleteEmplyee);

module.exports = router
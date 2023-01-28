const { Op } = require("sequelize");
const db = require("../../models");

exports.getAll = (req, res) => {
  const currentmonth = new Date().getMonth();

  db.Salary.findAll({}).then(resp => {
    let totalWorkingDays = resp.reduce((prev, curr) => {
      return (Number(prev?.total_working_days ? prev.total_working_days : prev) + Number(curr.total_working_days ? curr.total_working_days : curr))
    })

    let totalLeavesTaken = resp.reduce((prev, curr) => {
      if (typeof prev === 'object') {
        return prev.total_leaves_taken + curr.total_leaves_taken
      } else {
        return prev + curr.total_leaves_taken
      }
    })

    let previousMonth;
    if (currentmonth === 0) {
      previousMonth = 11
    } else {
      previousMonth = currentmonth + 1
    }

    console.log(previousMonth)

    db.Employee.findAll({})
      .then((data) => {
        res.send({ result: data, this_month_attendence: (totalLeavesTaken * 100) / totalWorkingDays });
      })
      .catch((err) => {
        res.send({ error: err });
      });

  })
};

exports.createEmployee = (req, res) => {
  db.Employee.create({
    name: req.body.name,
    email: req.body.email,
    mobile: Number(req.body.mobile),
    address: req.body.address,
    base_salary: req.body.base_salary,
  })
    .then((response) => {
      db.Salary.create({
        employee_id: response.id,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        total_working_days: 1,
        total_leaves_taken: 0,
        overtime: 0,
        total_salary_made: 0,
        is_salary_calculated: false,
      })
        .then(() => {
          res.send({ status: "success", message: "Employee Added Successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.send({ status: "error", error: err });
        });
    })
    .catch((err) => {
      console.log("error::", err);
      res.status(400).send({ status: "error", error: err });
    });
};

exports.updateEmplyee = (req, res) => {
  db.Employee.update(req.body)
    .then(() => {
      res.send({ message: "Employee Updated Successfully" });
    })
    .catch((err) => res.send(err));
};

exports.deleteEmplyee = (req, res) => {
  db.Employee.destroy({
    where: {
      email: {
        [Op.eq]: req.params.id,
      },
    },
  })
    .then(() => {
      res.send({ message: "Employee Updated Successfully" });
    })
    .catch((err) => res.send(err));
};

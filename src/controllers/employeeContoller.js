const { Op } = require("sequelize");
const db = require("../../models");

exports.getAll = (req, res) => {
  const currentmonth = new Date().getMonth();
  let previousMonth;
  let year = new Date().getFullYear();

  if (currentmonth === 0) {
    previousMonth = 11
    year = new Date().getFullYear() - 1
  } else {
    previousMonth = currentmonth - 1
  }

  db.Salary.findAll({
    where:{
      month:currentmonth,
      year:new Date().getFullYear()
    }
  }).then(resp => {
    const totalWorkingDays = resp.reduce((prev, curr) => {
      if (typeof prev === 'object') {
        return prev.total_working_days + curr.total_working_days
      } else {
        return prev + curr.total_working_days
      }
    }, 0)

    const totalLeavesTaken = resp.reduce((prev, curr) => {
      if (typeof prev === 'object') {
        return prev.total_leaves_taken + curr.total_leaves_taken
      } else {
        return prev + curr.total_leaves_taken
      }
    }, 0)


    db.Salary.findAll({
      where: {
        month: previousMonth,
        year
      }
    }).then(response => {
      const PreviousTotalWorkingDays = response.reduce((prev, curr) => {
        if (typeof prev === 'object') {
          return prev.total_working_days + curr.total_working_days
        } else {
          return prev + curr.total_working_days
        }
      }, 0)

      const previousTotalLeavesTaken = response.reduce((prev, curr) => {
        if (typeof prev === 'object') {
          return prev.total_leaves_taken + curr.total_leaves_taken
        } else {
          return prev + curr.total_leaves_taken
        }
      }, 0)

      db.Employee.findAll({})
        .then((data) => {
          res.send({
            result: data,
            this_month_attendence: (totalLeavesTaken * 100) / totalWorkingDays,
            last_month_attendence: (previousTotalLeavesTaken * 100) / PreviousTotalWorkingDays
          });
        })
        .catch((err) => {
          res.send({ error: err });
        });
    })


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
  db.Employee.update(req.body,{where:{id:req.params.id}})
    .then(() => {
      res.send({status:'success', message: "Employee Updated Successfully" });
    })
    .catch((err) => res.send({status:'error',error:err}));
};

exports.deleteEmployee = (req, res) => {
 
  db.Salary.destroy({
    where:{
      employee_id: req.params.id,
    }
  }).then(()=>{
    db.Employee.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(() => {
        res.send({status:'success', message: "Employee Deleted Successfully" });
      })
      .catch((err) => res.send({status:'error',error:err}));
  }).catch(err=>{
    res.send({status:'error',error:err})
  })
};

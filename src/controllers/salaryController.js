const db = require("../../models");
const nodemailer = require("nodemailer");
const paginate = require("jw-paginate");

exports.getAll = (req, res) => {
  db.Salary.findAll({
    include: [{ model: db.Employee }],
  })
    .then((data) => {
      // get page from query params or default to first page
      const page = parseInt(req.query.page) || 1;
      // get pager object for specified page
      const pager = paginate(data.length, page);
      // get page of items from items array
      const areMorePages = pager.currentPage === pager.totalPages;
      const pageOfItems = data.slice(pager.startIndex, pager.endIndex + 1);

      res.send({
        status: "success",
        result: pageOfItems,
        areMorePages: !areMorePages,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: err });
    });
};

exports.addSalary = (req, res) => {
  db.Salary.findOne({
    include: [{ model: db.Employee }],
    where: {
      employee_id: req.body.employee_id,
    },
  }).then((response) => {
    if (response.is_salary_calculated) {
      res.send({
        status: "error",
        message: "Error : Salary already processed for this selected month",
      });
    } else {
      db.Salary.update(req.body, {
        where: {
          employee_id: req.body.employee_id,
        },
      })
        .then(() => {
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "yashgupta61969@gmail.com", // generated ethereal user
              pass: "wdvcboxzajzzbpzz", // generated ethereal password
            },
          });
          transporter.sendMail(
            {
              from: "securesally@gmail.com",
              to: response.Employee.email,
              subject: "Salary Processed",
              text: "Your Salary Has Been Processed",
            },
            (error) => {
              if (error) {
                res.send({ status: "error", error });
              } else {
                res.send({
                  status: "success",
                  message: "Salary Added Successfully",
                });
              }
            }
          );
        })
        .catch((err) => {
          console.log("/////////////", err);
          res.send({ status: "error", error: err });
        });
    }
  });
};

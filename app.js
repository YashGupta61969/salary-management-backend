require("dotenv").config();
const db = require("./models");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const adminRoute = require("./src/routes/adminRoute");
const employeeRoute = require("./src/routes/employeeRoute");
const salaryRoute = require("./src/routes/salaryRoute");
const cron = require("node-cron");
const nodemailer = require('nodemailer')

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

cron.schedule("* * 1 * *",()=>{
  db.Salary.findAll({})
  .then((response)=>{
    response.map(res=>{
      db.Salary.update({
        month:res.month + 1,
        is_salary_calculated: 0,
        total_salary_made:0
      },{
        where:{
          employee_id:res.employee_id
        }
      }).then(()=>{
        console.log('updated')
      }).catch(err=>{
        console.log(err)
      })
    })
  })
})

cron.schedule("* * 2 * *", () => {
  db.Salary.findAll({
    include:[{ model: db.Employee }],
    where: {
      is_salary_calculated: 0,
    }
  })
    .then((res) => {
      res.map(response=>{
        if (response.is_salary_calculated) {
          console.log('Salary already Processed')
        } else {
          db.Salary.update({
            base_salary:response.Employee.base_salary,
            is_salary_calculated:true
          },{
            where:{
              employee_id: response.employee_id,
            }
          })
            .then(() => {
              let transporter = nodemailer.createTransport({
                service:'gmail',
                auth: {
                  user: 'yashgupta61969@gmail.com', // generated ethereal user
                  pass: 'wdvcboxzajzzbpzz', // generated ethereal password
                },
              });
              transporter.sendMail({
                from:'securesally@gmail.com',
                to:response.Employee.email,
                subject:'Salary Processed',
                text:'Your Salary Has Been Processed'
              },(error,info)=>{
                if(error){
                  console.log(error)
                }else{
                  console.log('Salary ADDED')
                }
              })
            })
            .catch((err) => {
              console.log('/////////////',err);
            });
        }
      })
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoute);
app.use("/employee", employeeRoute);
app.use("/salary", salaryRoute);

app.listen(port, () => {
  console.log(`listening at Port ${port}`);
});

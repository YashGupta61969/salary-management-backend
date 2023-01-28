const db = require('../../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken')

exports.signup = (req,res)=>{
    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };
    
    if (!req.body.email || !req.body.password) {
        res.status(400).send({status:'error', message: !req.body.email ? 'Please Enter Your Email' : 'Please Enter Your Password' })
    }else if(!validateEmail(req.body.email)){
        res.status(401).send({status:'error', message:'Please Enter A Valid Email'})
    }else if(req.body.password.length < 6){
        res.status(401).send({status:'error', message:'Password Should Be At lEast 6 Letters Long'})
    }else {
        // find the emails in the db if exists
        db.Admin.findAll({
            where: {
                email: {
                    [Op.eq]: req.body.email
                }
            }
        }).then(data => {
            if (!data.length) {
                // creates the hash for the password provided
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    }
                    else {
                        db.Admin.create({name:req.body.name, email: req.body.email, password: hash }).then(() => {
                            res.send({status:'success', message: 'User Created Successfully' })
                        }).catch(err => {
                            res.status(400).send({status:'error', message:err})
                        })
                    }
                })
            } else {
                res.status(401).send({status:'error', message: 'Email Already Exists' })
            }
        }).catch(err => {
            console.log(err)
            res.send({error:err})
        })
    }
}

exports.login = (req,res)=>{
    // find a single user in the db if esists
    db.Admin.findOne({where: { email: req.body.email } }).then(user => {  
        if (!user) {
            return res.status(404).send({status:'error', message: 'Email Not Found' })
        } else {
            // compares the password provided with the hash
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                        res.status(401).json({
                        status:'error',
                        message: "Auth failed",
                        error: err
                    });
                }
                if (result) {
                    // creates jwt signature token 
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user.id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                        res.status(200).send({
                        message: 'Auth Successful',
                        token: token,
                        id: user.id,
                        email: user.email
                    })
                } else {
                    res.status(401).send({status:'error', message: 'Passwords Do Not Match' })
                }
            })
        }
    })
}
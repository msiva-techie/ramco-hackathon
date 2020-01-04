import express from 'express'
const router = express.Router();
const jwt  = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
import {User} from './../db/model'

function sendError(err,res){
	console.log('Error.....',err);
	return res.jsonp({
		err,
		user:0,
		message:'Error occured...'
	});
};

router.post('/signup', function (req,res) {

	User.findOne({userName:req.body.userName},function(err,user){
		if(err){
			sendError(err,res)
		}
		if(!user){
			User.findOne({emailId:req.body.emailId},function(err,user){
				if(err){
					sendError(err,res);
				}
				if(!user){
					const user = new User({
						userName:req.body.userName,
						password:req.body.password,
						dateOfBirth:req.body.dateOfBirth,
						fullName:req.body.fullName,
						emailId:req.body.emailId,
						gender:req.body.gender
					});
					user.save(function (err, user) {
						if (err) { 
							sendError(err,res)
						}
						console.log('user inserted....', user);
						return res.jsonp({
							err:null,
							user:1,
							message:'User created successfully!'
						})
					});
				} else {
					return res.jsonp({
						err:null,
						user:0,
						message:'Email ID already exists'
					})
				}
			})
		} else {
			return res.jsonp({
				err:null,
				user:0,
				message:'User name already exists'
			})
		}
	});
})

router.post('/login',function(req, res) {

	User.findOne({emailId:req.body.emailId},function(err, user){
		if (err) {
			sendError(err,res)
		}
		if (!user){
			console.log('User not found');
			return res.jsonp({
				err:null,
				user:0,
				message:'User not found'
			});
		}
		if (user.password !== req.body.password){
			console.log('Password mismatch');
			return res.jsonp({
				err:null,
				user:0,
				message:'Username/Password mismatch'
			});
		}
		const uuid = uuidv1();
		let obj = {
			id:user._id,
			emailId:user.emailId,
			userName:user.userName,
			token:uuid
		}
		const token = jwt.sign(obj, 'tokenBasedAuthentication');
		res.cookie('jwt', token, { 
			signed: true,
			httpOnly: true
		//	secure:true   // use this for https
		})
		res.cookie('token', uuid, { 
			httpOnly: false
		//	secure:true   // use this for https
		})
		res.jsonp({
			err:null,
			user:1,
			message:'Login successful!'
		})
	});
});

const verifyUser = function(req,res,next){
	if(req.signedCookies.jwt){
		jwt.verify(req.signedCookies.jwt, 'tokenBasedAuthentication', function(err, decoded) {
			console.log('req.headers.token', req.headers.token);
			if(decoded.token === req.headers.token){
				return next();
			}
			return res.jsonp({
				err,
				success:0,
				message:'User verification failed'
			});
		});
	}
	return res.jsonp({
		success:0,
		message:'User verification failed'
	});
}

router.get('/test',verifyUser,function(req,res){

	console.log('cookies....',req.cookies);
	console.log('signed cookies....',req.signedCookies);	
	res.jsonp({
		message:'Welcome! you are successfully logged in.'
	})
})

router.post('/logout',verifyUser,function(req,res){
	res.clearCookie('jwt');
	res.clearCookie('token');
	res.jsonp({
		message:'You are logged out.'
	})
})

module.exports = router;

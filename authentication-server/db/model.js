import mongoose from 'mongoose';
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/social-media', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Database connected successfull!');
});

const UserSchema = new Schema({
	userName: { 
		type: String, 
		index: true,
		required:true,
		unique: true
	},
	password: { 
		type: String, 
		min: 8,
		required:true
	},
	dateOfBirth: { 
		type: Date,
		required:true
	},
	fullName: { 
		type: String,
		required:true 
	},
	emailId: {
		type:String, 
		index: true,
		required:true,
		unique: true
	},
	gender: {
		type:String,
		required:true
	},
	dateOfCreation: { 
		type: Date, 
		default: Date.now
	}
  });

//   UserSchema.path('email').validate(function (email) {
// 	let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
// 	return emailRegex.test(email); 
//  });


export const User = mongoose.model('User',UserSchema);
   
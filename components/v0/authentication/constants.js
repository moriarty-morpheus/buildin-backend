const constants = {};
const forgotPasswordLink = 'http://103.75.56.120:3000/api/v0/auth/reset_password?id=TOKEN';
constants.messages = {
	registerAdmin: {
		sub: "User Registered",
		msg: "Hi Admin, \n\t USER_NAME has just registered on our application and is waiting for your approval. \nPlease check and do the needful."
	},
	registerUser: {
		sub: "User Registered",
		msg: "Hi USER_NAME, \n\t Thanks for registering on our application. Your account approval is pending for approval. \n\tYou will receive an email on the account status. \nThank You!"
	},
  forgotPassword: {
    sub: "Forgot Password",
    msg: "Hi USER_NAME, \n\t To reset you password please click the below link. \n\t" + forgotPasswordLink+". \n\t"+
         "The Link expires in 24hrs. Please hurry up and reset your password."
  }
}

module.exports = constants;

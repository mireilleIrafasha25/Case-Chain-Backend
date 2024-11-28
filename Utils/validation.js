import {body} from 'express-validator';

export const forgotpasswordValidation=[
    body("Email","Email is required").not().isEmpty(),
];

export const resetPasswordValidation=[

    body("Password","Password is required").not().isEmpty(),
    body("Password","Password  should contain atleast 8 characters,uppercase and lower case letters,numbers and symbols").isStrongPassword(),
    body("confirmPassword","confirmPassword is required ").not().isEmpty()
];
export const otpValidation=[

    body("otp","otp is required").not().isEmpty()
];

export const signUpValidation=[
    body("FullName","FullName is required").not().isEmpty(),
    body("Telephone","Telephone is required").not().isEmpty(),
    body("Province","Province is required").not().isEmpty,
    body("District","District is required").not().isEmpty,
    body("Sector","Sector is required").not().isEmpty,
    body("Cell","Cell is required").not().isEmpty,
    body("Village","Village is required").not().isEmpty,
    body("Email","Email is required").not().isEmpty(),
    body("Email","Invalid email").isEmail(),
    body("Password","Password is required").not().isEmpty(),
    body("Password","Password  should contain atleast 8 characters,uppercase and lower case letters,numbers and symbols").isStrongPassword(),
    body("confirmPassword","confirmPassword is required ").not().isEmpty(),
  //  body("confirmpassword","confirmPassword  should contain atleast 8 characters,uppercase and lower case letters,numbers and symbols").isStrongPassword(),
];

export const signInValidation=[
    
    body("Email","Email is required").not().isEmpty(),
    body("Email","Invalid email").isEmail(),
    body("Password","Password is required").not().isEmpty(),
    body("Password","Invalid password").isStrongPassword()
];

export const testValidation = [
    body("serviceName","the name of the service is required").not().isEmpty()
   
];
export const addnewMessageValidation = [
    body("name", "name is required").not().isEmpty(),
    body("email", "email is required").not().isEmpty(),
    body("message", "message is required").not().isEmpty()
]

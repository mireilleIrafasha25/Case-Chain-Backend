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
  body("Province","Province is required").not().isEmpty(),
  body("District","District is required").not().isEmpty(),
  body("Sector","Sector is required").not().isEmpty(),
  body("Cell","Cell is required").not().isEmpty(),
  body("Village","Village is required").not().isEmpty(),
  body("Email","Email is required").not().isEmpty(),
  body("Email","Invalid email").isEmail(),
  body("Password","Password is required").not().isEmpty(),
  body("Password","Invalid password").isStrongPassword(),
  body("confirmPassword","confirmPassword is required ").not().isEmpty(),
];

export const signInValidation=[
    
    body("Email","Email is required").not().isEmpty(),
    body("Email","Invalid email").isEmail(),
    body("Password","Password is required").not().isEmpty(),
    body("Password","Invalid password").isStrongPassword()
];

export const addnewMessageValidation = [
    body("name", "name is required").not().isEmpty(),
    body("email", "email is required").not().isEmpty(),
    body("message", "message is required").not().isEmpty()
]

// case validation

export const validateNewCase = [
    body('caseTitle')
        .notEmpty().withMessage('Case title is required')
        .isString().withMessage('Case title must be a string'),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string'),
    body('caseOuner')
        .notEmpty().withMessage('Case owner (National ID) is required')
        .isString().withMessage('Case owner must be a string'),
    body('currentLevel')
        .notEmpty().withMessage('Current level is required')
        .isIn(['mutwara sibo', 'mudugudu', 'umukuru w\'akagali']).withMessage('Invalid current level'),
    body('expected_resolution_date')
        .optional()
        .isISO8601().withMessage('Expected resolution date must be a valid date')

];

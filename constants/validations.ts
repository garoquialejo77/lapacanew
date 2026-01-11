export const validationsNewProduct = [
  { step: 1, validations: {field:"images",rules:[{rule: "required", condition: true}]}},
  { step: 2, validations: {field:"card",rules:[{rule: "required", condition: true},{rule: "minLength", condition: 3}]}},
  { step: 3, validations: {field:"title",rules:[{rule: "required", condition: true},{rule: "minLength", condition: 3}]}},
  { step: 4, validations: {field:"description",rules:[{rule: "required", condition: true}]}},
  { step: 5, validations: {field:"price",rules:[{rule: "required", condition: true}]}}
];

export const validationsNewUser = [
  { validations: {field:"name",rules:[{rule: "required", condition: true},{rule: "minLength", condition: 6},{rule: "maxLength", condition: 255}]}},
  { validations: {field:"email",rules:[{rule: "required", condition: true},{rule: "minLength", condition: 6},{rule: "maxLength", condition: 255},{rule: "isEmail", condition: true}]}},
  { validations: {field:"password",rules:[{rule: "required", condition: true},{rule: "minLength", condition: 6}]}},
];

export const validationsLogin = [
  { validations: {field:"email",rules:[{rule: "required", condition: true},{rule: "minLength", condition: 6},{rule: "maxLength", condition: 255},{rule: "isEmail", condition: true}]}},
  { validations: {field:"password",rules:[{rule: "required", condition: true},{rule: "minLength", condition: 6}]}},
];

interface Validations {
  field: string;
  rules: string[];
}

interface Rule{
    rule: string,
    value: string | boolean
}
export const validate = (data: any, validations: any) => {
  let validate = true
  const rules = validations?.rules as string[];
  if (rules) {
    rules.forEach((item: any) => {
      const {rule,condition} = item 
      const fn = functions[rule as keyof typeof functions];
      validate = validate && fn(data, condition)
    });
  }
  return validate
 
};

const functions = {
  required: (data: any, condition:any) => {
    console.log("la data",data)
    console.log("la condicionnnnnnn", condition)
    return data?.value?.length ? true : false
  },
  minLength: (data: any, condition:any)=>{
    return data?.value?.length >= condition
  },
  maxLength: (data: any, condition:any)=>{
    return data?.value?.length <= condition
  },
  isEmail: (data: any, condition:any)=>{
    if(condition){
      const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return expresion.test(String(data .value).toLowerCase());
    }
    return true
   
  }
};

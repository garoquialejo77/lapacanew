export const sendRegister = async(name:string,email: string, password: string)=>{
    let url = `${process.env.EXPO_PUBLIC_HOST}/api/register/`;
    try {
        const response = await fetch(
           url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
            },
            body: JSON.stringify({
                name,
                email,
                password
              }),
          }
        )
          .then((response) => response.json())
          .then((json) => json);
  
        return response;
      } catch (error) {
        throw "Error";
      }
  }

  export const sendLogin = async(email: string, password: string)=>{
    let url = `${process.env.EXPO_PUBLIC_HOST}/api/login/`;
    try {
        const response = await fetch(
           url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
            },
            body: JSON.stringify({
                email,
                password
              }),
          }
        )
          .then((response) => response.json())
          .then((json) => json);
  
        return response;
      } catch (error) {
        throw "Error";
      }
  }

  export const sendMe=async(token: string)=>{
    let url = `${process.env.EXPO_PUBLIC_HOST}/api/me/`;
    try {
        const response = await fetch(
           url,
           
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
            
          }
        )
          .then((response) => response.json())
          .then((json) => json);
  
        return response;
      } catch (error) {
        throw "Error";
      }
  }
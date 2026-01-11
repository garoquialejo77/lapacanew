export const sendMessage = async(message: string, to: string, from: string, product:string)=>{
  let url = `${process.env.EXPO_PUBLIC_HOST}/api/conversation/`;
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
              message: message,
              to,
              from,
              product
            }),
        }
      )
        .then((response) => response.json())
        .then((json) => console.log("la resúestaaa", json));

      return response;
    } catch (error) {
      throw "Error";
    }
}

export const getMessages = async (page = 1, search="") => {
  let url = `${process.env.EXPO_PUBLIC_HOST}/api/conversation?page=${page}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
try {
  const response = await fetch(
     url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      },
    }
  )
    .then((response) => response.json())
    .then((json) => json);
  return response;
} catch (error) {
  throw "Error";
}
};

export const getMessagesDetail = async (page = 1, search="") => {
  let url = `${process.env.EXPO_PUBLIC_HOST}/api/conversationdetailid?page=${page}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
try {
  const response = await fetch(
     url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      },
    }
  )
    .then((response) => response.json())
    .then((json) => json);
  return response;
} catch (error) {
  throw "Error";
}
};

export const sendAnswer = async(conversation_id: string, message: string, to: string, from: string)=>{
  let url = `${process.env.EXPO_PUBLIC_HOST}/api/conversationdetail/`;
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
            conversation_id,
            message,
            to,
            from              
            }),
        }
      )
        .then((response) => response.json())
        .then((json) => console.log("la resúestaaa", json));

      return response;
    } catch (error) {
      throw "Error";
    }
}
export const sendMessage = async(message: string, to: string, from: string, product:string, token:string)=>{
  let url = `${process.env.EXPO_PUBLIC_HOST}/api/conversation/`;
  try {
      const response = await fetch(
         url,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
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
        .then((json) => json);

      return response;
    } catch (error) {
      throw "Error";
    }
}

export const getMessages = async (page = 1, search="", token:string ) => {
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
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
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

export const getMessagesDetail = async (page = 1, search="",token: string) => {
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
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
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

export const sendAnswer = async(conversation_id: string, message: string, to: string, from: string, token: string)=>{
  let url = `${process.env.EXPO_PUBLIC_HOST}/api/conversationdetail/`;
  try {
      const response = await fetch(
         url,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"
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
        .then((json) => json);

      return response;
    } catch (error) {
      throw "Error";
    }
}
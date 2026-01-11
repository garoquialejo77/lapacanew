import { Platform } from "react-native";

export const newProduct = async (product: any, token:string): Promise<any> => {
  const formData = new FormData();
  const images = product.find((prod: any) => prod.key === "images").value;

  if (Platform.OS === "web") {
    images.forEach((image: any, index: any) => {
      formData.append(`image${index + 1}`, image.file);
    });

    formData.append(
      "category",
      product.find((prod: any) => prod.key === "category").value
    );
    formData.append(
      "title",
      product.find((prod: any) => prod.key === "title").value
    );
    formData.append(
      "description",
      product.find((prod: any) => prod.key === "description").value
    );
    formData.append(
      "price",
      product.find((prod: any) => prod.key === "price").value
    );
    formData.append("user", '1');
    images.forEach((image: any, index: any) => {
      console.log("uriiiii web ", image.uri)
      formData.append("file", {
        uri: image.uri,
        name: image.file.name,
        type: image.file.type,
      } as any);

      formData.append(`image${index + 1}`, image.file.name);
    });
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_HOST}/api/product/`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`, 
          },
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((json) => json);
      return response;
    } catch (error) {
      console.log("el error", error);
      throw "Error";
    }
  } else {
    formData.append(
      "category",
      product.find((prod: any) => prod.key === "category").value
    );

    formData.append(
      "title",
      product.find((prod: any) => prod.key === "title").value
    );
    formData.append(
      "description",
      product.find((prod: any) => prod.key === "description").value
    );
    formData.append(
      "price",
      product.find((prod: any) => prod.key === "price").value
    );
    formData.append("user", "1");
    images.forEach((image: any, index: any) => {
      console.log("uriiiii", image.uri)
      formData.append("file", {
        uri: image.uri,
        name: image.file.name,
        type: image.file.type,
      } as any);

      formData.append(`image${index + 1}`, image.file.name);
    });
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_HOST}/api/product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((json) => json);

      return response;
    } catch (error) {
      console.log("el error", error);
      throw "Error";
    }
  }
};

export const getProducts = async (page = 1, search="") => {
    let url = `${process.env.EXPO_PUBLIC_HOST}/api/product?page=${page}`;
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

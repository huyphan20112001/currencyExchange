const myHeaders = new Headers();
myHeaders.append("apikey", "Jfht2uZVx4c3PrY8H1C0CtK8RQnEr4Z9");

const requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

const exchange = async (from, to, amount) => {
  const currency = await fetch(
    `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      return data.result;
    })
    .catch((error) => console.log("error", error));

  return currency;
};

export default exchange;

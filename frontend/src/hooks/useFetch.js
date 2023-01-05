import { useState, useEffect } from "react";

const useFetch = (url, method, body) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, [url]);
  return [data];
};
export default useFetch;

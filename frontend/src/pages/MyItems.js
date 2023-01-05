import { useEffect, useState } from "react";
import ShopItemCard from "../components/ShopItemCard";

function MyItems(props) {
  const [itemsOnSale, setItemsOnSale] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  // For some reason which I could not ascrertain this component would not rerender
  // after state updates of the above states in the useEffect below. The rerender state is used
  // to forcibly rerender the component and display the items once the fetch promises have been resolved
  const [rerender, setRerender] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [itemCreationSuccesful, setItemCreationSuccesful] = useState(false);
  const [itemCreationFailure, setItemCreationFailure] = useState(false);

  useEffect(() => {
    setItemsOnSale([]);
    setSoldItems([]);
    setPurchasedItems([]);
    fetch("http://127.0.0.1:8000/api/v1/useritems/", {
      method: "GET",
      headers: { Authorization: "Token " + props.userToken },
    })
      .then((res) => res.json())
      .then((data) => {
        data.forEach((element) => {
          if ("id" in element) {
            if (element.seller == props.userId && element.buyer == null) {
              setItemsOnSale((prevList) => {
                prevList.push(element);
                return prevList;
              });
            } else if (
              element.seller == props.userId &&
              element.buyer != null
            ) {
              setSoldItems((prevList) => {
                prevList.push(element);
                return prevList;
              });
            } else {
              setPurchasedItems((prevList) => {
                prevList.push(element);
                return prevList;
              });
            }
          }
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setRerender(!rerender)); // Force a rerender
  }, []);

  function handleNewItem(e) {
    setIsPending(true);
    e.preventDefault();
    const newItem = { title, description, price };

    fetch("http://127.0.0.1:8000/api/v1/newitem/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Token " + props.userToken,
      },
      body: JSON.stringify(newItem),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsPending(false);

        if ("id" in data) {
          setItemCreationSuccesful(true);
          setItemCreationFailure(false);
          setItemsOnSale((prevList) => {
            prevList.push(data);
            return prevList;
          });
          setTimeout(() => {
            setItemCreationSuccesful(false);
            setTitle("");
            setDescription("");
            setPrice(0);
          }, 3000);
        } else {
          setItemCreationFailure(true);
        }
      })
      .catch((err) => console.log(err));
  }

  const itemsOnSaleComponents = itemsOnSale.map((element) => {
    return (
      <ShopItemCard
        userToken={props.userToken}
        id={element.id}
        title={element.title}
        description={element.description}
        price={element.price}
        createdDate={element.created_date}
        priceIsEditable={true}
      ></ShopItemCard>
    );
  });

  const soldItemsComponents = soldItems.map((element) => {
    return (
      <ShopItemCard
        userToken={props.userToken}
        id={element.id}
        title={element.title}
        description={element.description}
        price={element.price}
        createdDate={element.created_date}
        priceIsEditable={false}
      ></ShopItemCard>
    );
  });

  const purchasedItemsComponents = purchasedItems.map((element) => {
    return (
      <ShopItemCard
        userToken={props.userToken}
        id={element.id}
        title={element.title}
        description={element.description}
        price={element.price}
        createdDate={element.created_date}
        priceIsEditable={false}
      ></ShopItemCard>
    );
  });

  if (!props.username) {
    return (
      <>
        <p>Login before attempting to view your items!</p>
      </>
    );
  }

  return (
    <>
      <div className="my-items">
        <div className="new-item">
          <h1>Register a new item on the shop</h1>
          <form>
            <label>Title (max 20 characters)</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label>Description (max 100 characters)</label>
            <textarea
              type="text-area"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label>Price</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {!isPending && !itemCreationSuccesful && (
              <button onClick={handleNewItem}>Submit new item</button>
            )}
          </form>
          <div className="message-container">
            {itemCreationFailure && (
              <p className="error-message">
                Invalid input(s), please try again!
              </p>
            )}
            {itemCreationSuccesful && <p>Item created succesfully!</p>}
            {isPending && <p>Loading ...</p>}
          </div>
        </div>
        <div className="items-on-sale">
          <p>My items on sale</p>
          <hr />
          <div className="items">{itemsOnSaleComponents}</div>
        </div>
        <div className="items-sold">
          <p>My sold items</p>
          <hr />
          <div className="items">{soldItemsComponents}</div>
        </div>
        <div className="items-purchased">
          <p>My purchased items</p>
          <hr />
          <div className="items">{purchasedItemsComponents}</div>
        </div>
      </div>
    </>
  );
}

export default MyItems;

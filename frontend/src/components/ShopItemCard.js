import { useState } from "react";

function ShopItemCard(props) {
  const [isPending, setIsPending] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [updateIsSuccesful, setUpdateIsSuccesful] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [useLocalPrice, setUseLocalPrice] = useState(false);
  const [localPrice, setLocalPrice] = useState(0);

  function handleChangePrice(e) {
    e.preventDefault();
    setIsPending(true);

    const newPriceAndid = { price: newPrice, id: props.id };

    fetch("http://127.0.0.1:8000/api/v1/changeprice/", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Token " + props.userToken,
      },
      body: JSON.stringify(newPriceAndid),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsPending(false);
        if ("message" in data && data.message == "Successfully updated price") {
          setUpdateIsSuccesful(true);
          setInvalidInput(false);
          setUseLocalPrice(true);
          setLocalPrice(newPrice);
          setTimeout(() => {
            setUpdateIsSuccesful(false);
          }, 3000);
        } else {
          setInvalidInput(true);
        }
      })
      .catch((err) => console.log(err));
  }

  const editPriceForm = (
    <form>
      <label className="shop-item-card--label">New price</label>
      <input
        type="number"
        required
        value={newPrice}
        onChange={(e) => {
          if (!updateIsSuccesful) setNewPrice(e.target.value);
        }}
        className="shop-item-card--input"
      />
      {!isPending && !updateIsSuccesful && (
        <button onClick={handleChangePrice}>Update price</button>
      )}
    </form>
  );

  return (
    <div className="shop-item-card">
      <div className="shop-item-card--top">
        <div className="title-and-price">
          <p>Title: {props.title}</p>
          <p>Price: {!useLocalPrice ? props.price : localPrice}</p>
        </div>
        <p>Description: {props.description}</p>
        {isPending && <p>Loading ...</p>}
        {props.priceIsEditable && editPriceForm}
        {props.inShopPage && props.userId && props.userId != props.seller && (
          <button
            className="add-to-cart-button"
            onClick={(e) => props.addItemToCart(props.element)}
          >
            Add to cart
          </button>
        )}
        {props.inShopPage && props.userId && props.userId == props.seller && (
          <p className="error-message">
            You cannot add your own item to your cart!
          </p>
        )}
        {invalidInput && (
          <p className="error-message">Invalid input, try again!</p>
        )}
        {updateIsSuccesful && <p>Update succesful!</p>}
      </div>
      <p>Created date: {props.createdDate}</p>
    </div>
  );
}

export default ShopItemCard;

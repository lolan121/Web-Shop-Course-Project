import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import MyItems from "./pages/MyItems.js";
import Shop from "./pages/Shop.js";
import Signup from "./pages/SignUp.js";
import Account from "./pages/Account.js";
import LogIn from "./pages/LogIn.js";
import AccountCard from "./components/AccountCard.js";
import ShoppingCart from "./components/ShoppingCart.js";
import CartEntry from "./components/CartEntry.js";

function App() {
  const navigate = useNavigate();

  const [showCart, setShowCart] = React.useState(false);

  const [userToken, setUserToken] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [username, setUsername] = React.useState("");

  const [itemIsAlreadyPurchased, setItemIsAlreadyPurchased] =
    React.useState(false);
  const [priceIsUpdated, setPriceIsUpdated] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [purchaseIsSuccesful, setPurchaseIsSuccesful] = React.useState(false);
  const [shoppingCart, setShoppingCart] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [rerender, setRerender] = React.useState(false);

  useEffect(() => {
    let newTotalPrice = 0;

    if (itemIsAlreadyPurchased) {
      setItemIsAlreadyPurchased(false);
    }

    shoppingCart.forEach((element) => {
      if (element.newPrice) {
        newTotalPrice = newTotalPrice + Number(element.newPrice);
      } else {
        newTotalPrice = newTotalPrice + Number(element.price);
      }

      if ("isSold" in element) {
        setItemIsAlreadyPurchased(true);
      }
    });
    setTotalPrice(newTotalPrice);
  }, [shoppingCart, rerender]);

  function logout() {
    setUserToken("");
    setUserId("");
    setUsername("");
    setShoppingCart([]);
    setPurchaseIsSuccesful(false);
    setItemIsAlreadyPurchased(false);
    setPriceIsUpdated(false);
    navigate("/login");
  }

  function removeItemFromCart(id) {
    setShoppingCart((prevList) => {
      prevList = prevList.filter((element) => {
        return element.id !== id;
      });
      return prevList;
    });
  }

  function addItemToCart(newItem) {
    if (shoppingCart.find((element) => element.id == newItem.id)) {
      // Item is already in cart
    } else {
      setShoppingCart((prevList) => {
        prevList.push(newItem);
        setRerender(!rerender);
        return prevList;
      });
    }
  }

  function onPurchase() {
    if (shoppingCart.length == 0) {
      return;
    }

    const payload = shoppingCart.map((element) => {
      if ("newPrice" in element) {
        let itemWithNewPrice = (({ title, price, seller, id }) => ({
          title,
          price,
          seller,
          id,
        }))(element);
        itemWithNewPrice.price = element.newPrice;
        return itemWithNewPrice;
      } else {
        return (({ title, price, seller, id }) => ({
          title,
          price,
          seller,
          id,
        }))(element);
      }
    });

    setIsPending(true);
    fetch("http://127.0.0.1:8000/api/v1/buyitems/", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Token " + userToken,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsPending(false);
        if ("purchaseCompleted" in data) {
          setPurchaseIsSuccesful(true);
          setShoppingCart([]);
          setRerender(!rerender);
          setTimeout(() => {
            setPurchaseIsSuccesful(false);
          }, 2500);
        } else {
          data.forEach((element) => {
            const faultyItemIndex = shoppingCart.findIndex((cartElement) => {
              return element.id == cartElement.id;
            });
            if (element.buyer != null) {
              setItemIsAlreadyPurchased(true);
              setShoppingCart((prevList) => {
                prevList[faultyItemIndex].isSold = true;
                return prevList;
              });
            } else {
              setPriceIsUpdated(true);
              setShoppingCart((prevList) => {
                prevList[faultyItemIndex].newPrice = element.price;
                return prevList;
              });
              setTimeout(() => {
                setPriceIsUpdated(false);
              }, 5000);
            }
          });
          setRerender(!rerender);
        }
        console.log(data);
      })
      .catch((err) => console.log(err));
  }

  function enableCart() {
    setShowCart(true);
  }

  function disableCart() {
    setShowCart(false);
  }

  let cartItemComponents = [];

  if (shoppingCart) {
    cartItemComponents = shoppingCart.map((element) => {
      return (
        <CartEntry
          title={element.title}
          price={element.price}
          id={element.id}
          removeItemFromCart={removeItemFromCart}
          isSold={element.isSold}
          newPrice={element.newPrice}
        ></CartEntry>
      );
    });
  }

  return (
    <>
      <div className="App">
        <div className="top">
          <AccountCard
            enableCart={enableCart}
            username={username}
            logout={logout}
          ></AccountCard>
          {showCart && (
            <ShoppingCart
              disableCart={disableCart}
              cartItemComponents={cartItemComponents}
              totalPrice={totalPrice}
              onPurchase={onPurchase}
              isPending={isPending}
              priceIsUpdated={priceIsUpdated}
              itemIsAlreadyPurchased={itemIsAlreadyPurchased}
              purchaseIsSuccesful={purchaseIsSuccesful}
            ></ShoppingCart>
          )}
        </div>
        <div className="navbar">
          <NavLink className="link" to="/shop">
            Shop
          </NavLink>
          <NavLink className="link" to="/myitems">
            My Items
          </NavLink>
          <NavLink className="link" to="/signup">
            Sign up
          </NavLink>
          <NavLink className="link" to="/login">
            Log in
          </NavLink>
          <NavLink className="link" to="/account">
            Manage account
          </NavLink>
        </div>
        <div className="bottom">
          <div className="stage">
            <Routes>
              <Route
                path="/shop"
                element={<Shop userId={userId} addItemToCart={addItemToCart} />}
              ></Route>
              <Route
                path="/account"
                element={<Account username={username} userToken={userToken} />}
              ></Route>
              <Route
                path="/signup"
                element={<Signup username={username} />}
              ></Route>
              <Route
                path="/login"
                element={
                  <LogIn
                    setUserId={setUserId}
                    setUserToken={setUserToken}
                    setUsername={setUsername}
                    username={username}
                  />
                }
              ></Route>
              <Route
                path="/myitems"
                element={
                  <MyItems
                    username={username}
                    userToken={userToken}
                    userId={userId}
                  />
                }
              ></Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import ShopItemCard from "../components/ShopItemCard";

function Shop(props) {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [nextPage, setNextPage] = useState("");
  // State for rerendering, see MyItems.js for further clarification
  const [rerender, setRerender] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsPending(true);
    setDisplayedItems([]);
    fetch("http://127.0.0.1:8000/api/v1/shopitems/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ searchQuery }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsPending(false);
        if ("results" in data) {
          setDisplayedItems((prevList) => {
            prevList.push.apply(prevList, data.results);
            return prevList;
          });
          setNextPage(data.next);
        }
      })
      .finally(() => {
        setRerender(!rerender);
      });
  }, [searchQuery]);

  function onLoadMore(e) {
    setIsPending(true);
    fetch(nextPage, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ searchQuery }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsPending(false);
        if ("results" in data) {
          setDisplayedItems((prevList) => {
            prevList.push.apply(prevList, data.results);
            return prevList;
          });
          setNextPage(data.next);
        }
      })
      .finally(() => {
        setRerender(!rerender);
      });
  }

  let shopItemComponents = [];
  if (displayedItems) {
    shopItemComponents = displayedItems.map((element) => {
      return (
        <ShopItemCard
          id={element.id}
          title={element.title}
          description={element.description}
          price={element.price}
          createdDate={element.created_date}
          inShopPage={true}
          userId={props.userId}
          seller={element.seller}
          addItemToCart={props.addItemToCart}
          element={element}
        ></ShopItemCard>
      );
    });
  }

  return (
    <>
      <div className="shop">
        <form className="shop-filter--form">
          <label className="shop-filter--label">
            Filter title & description
          </label>
          <input
            type="text"
            required
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="shop-filter--input"
          />
        </form>
        <p>Items for sale</p>
        <hr />
        {!props.userId && (
          <p className="error-message shop-error-message">
            You must login to be able to add items to your cart!
          </p>
        )}
        <div className="items">{shopItemComponents}</div>
        {!isPending && nextPage && (
          <button className="load-more-button" onClick={onLoadMore}>
            Load more
          </button>
        )}
        {!nextPage && <p>All shop items are currently on display!</p>}
        {isPending && <p>Loading ...</p>}
      </div>
    </>
  );
}

export default Shop;

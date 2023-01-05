function CartEntry(props) {
  return (
    <>
      <div className="cart-entry">
        <div className="cart-entry-top">
          <div className="cart-entry-left">
            <p>Title: {props.title}</p>
            <p className={props.newPrice ? "strikethrough" : ""}>
              {props.newPrice ? "Old price: " : "Price: "} {props.price}
            </p>
            {props.newPrice && <p>New price: {props.newPrice}</p>}
          </div>
          <button
            className="remove-item-button"
            onClick={(e) => props.removeItemFromCart(props.id)}
          >
            Remove item
          </button>
        </div>
        {props.isSold && (
          <p className="error-message cart-item-error-message">
            Item is no longer available, remove it from the cart to proceed!
          </p>
        )}
      </div>
    </>
  );
}

export default CartEntry;

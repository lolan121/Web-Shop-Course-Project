import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import CartEntry from "./CartEntry";

function ShoppingCart(props) {
  return (
    <>
      <div className="shopping-cart">
        <div className="close-cart-button" onClick={props.disableCart}>
          <FontAwesomeIcon
            icon={faClose}
            className="close-icon"
          ></FontAwesomeIcon>
        </div>
        {props.cartItemComponents}
        <p>Total price: {props.totalPrice}</p>
        {!props.isPending &&
          !props.purchaseIsSuccesful &&
          !props.itemIsAlreadyPurchased &&
          !props.priceIsUpdated && (
            <button className="purchase-button" onClick={props.onPurchase}>
              Purchase
            </button>
          )}
        {props.isPending && <p>Loading ...</p>}
        {props.priceIsUpdated && (
          <p className="error-message">
            The price of one or more items has been updated. New prices are
            displayed above!
          </p>
        )}
        {props.itemIsAlreadyPurchased && (
          <p className="error-message">
            One or more items are no longer available. Please remove them from
            the cart to proceed!
          </p>
        )}
        {props.purchaseIsSuccesful && (
          <p>Purchase succesful, enjoy your items!</p>
        )}
      </div>
    </>
  );
}

export default ShoppingCart;

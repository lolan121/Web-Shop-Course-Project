import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";

function AccountCard(props) {
  return (
    <>
      <div className="account-card">
        <div className="account-card--left">
          <div className="account-card--user">
            <FontAwesomeIcon
              icon={faUser}
              className="user-icon"
            ></FontAwesomeIcon>
            {!props.username ? (
              <p>No user logged in</p>
            ) : (
              <p>{props.username}</p>
            )}
          </div>
          {!props.username ? (
            ""
          ) : (
            <button onClick={(e) => props.logout()}>Log out</button>
          )}
        </div>
        <div className="account-card--right">
          {/* <div className="account-card--separator"></div> */}
          <div className="cart-button" onClick={props.enableCart}>
            <FontAwesomeIcon
              icon={faCartShopping}
              className="cart-icon"
            ></FontAwesomeIcon>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountCard;

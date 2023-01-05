import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Account(props) {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  function handleSubmit(e) {
    setIsPending(true);
    e.preventDefault();

    const credentials = { oldPassword, newPassword };

    fetch("http://127.0.0.1:8000/api/v1/changepassword/", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Token " + props.userToken,
      },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsPending(false);
        console.log(data);
        if ("message" in data && data.message === "Wrong old password") {
          setInvalidCredentials(true);
        } else if ("message" in data && data.message === "Password changed") {
          setInvalidCredentials(false);
          setRedirecting(true);

          setTimeout(() => {
            navigate("/shop");
          }, 2500);
        }
      })
      .catch((err) => console.log(err));
  }

  if (!props.username) {
    return (
      <>
        <p>Login before attempting to manage an account!</p>
      </>
    );
  }

  return (
    <>
      <div className="account-page">
        <form onSubmit={handleSubmit}>
          <label>Old password</label>
          <input
            type="text"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <label>New password</label>
          <input
            type="text"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {!isPending && !redirecting && <button>Change password</button>}
          {isPending && <p>Loading ...</p>}
        </form>
        {invalidCredentials && (
          <p className="error-message">Wrong old password, try again!</p>
        )}
        {redirecting && <p>Password updated, redirecting to shop page...</p>}
      </div>
    </>
  );
}

export default Account;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LogIn(props) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setIsPending(true);

    const userCredentials = { username, password };

    fetch("http://127.0.0.1:8000/api/v1/login/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(userCredentials),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsPending(false);
        if ("token" in data) {
          props.setUserToken(data.token);

          // Then also get the id of the user (needed for getting items of that specific user etc.)
          fetch("http://127.0.0.1:8000/api/v1/getid/", {
            method: "GET",
            headers: { Authorization: "Token " + data.token },
          })
            .then((response) => response.json())
            .then((data) => {
              setInvalidCredentials(false);
              setRedirecting(true);
              props.setUserId(data.userId);
              props.setUsername(data.username);
              setTimeout(() => {
                navigate("/shop");
              }, 2500);
            })
            .catch((err) => console.log(err));
        } else {
          setInvalidCredentials(true);
        }
      })
      .catch((err) => console.log(err));
  }

  if (props.username && !redirecting) {
    return (
      <>
        <p>Logout before attempting to login as other user</p>
      </>
    );
  }

  return (
    <>
      <div className="login-page">
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Password</label>
          <input
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isPending && !redirecting && <button>Login</button>}
          {isPending && <p>Loading ...</p>}
        </form>
        {invalidCredentials && (
          <p className="error-message">
            Credentials are invalid, please enter valid credentials and try
            again
          </p>
        )}
        {redirecting && (
          <p>You are now logged in, redirecting to shop page...</p>
        )}
      </div>
    </>
  );
}

export default LogIn;

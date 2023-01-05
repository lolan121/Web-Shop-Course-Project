import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup(props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  function handleSubmit(e) {
    setIsPending(true);
    e.preventDefault();
    const newUserCredentials = { email, username, password };

    fetch("http://127.0.0.1:8000/api/v1/register/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newUserCredentials),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsPending(false);
        if (!("message" in data && data.message === "User created")) {
          setInvalidCredentials(true);
        } else {
          setInvalidCredentials(false);
          setRedirecting(true);

          setTimeout(() => {
            navigate("/login");
          }, 2500);
        }
      })
      .catch((err) => console.log(err));
  }

  if (props.username) {
    return (
      <>
        <p>Logout before attempting to sign up as new user</p>
      </>
    );
  }

  return (
    <>
      <div className="signup-page">
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          {!isPending && !redirecting && <button>Sign up</button>}
          {isPending && <p>Loading ...</p>}
        </form>
        {invalidCredentials && (
          <p className="error-message">
            Credentials are invalid, please enter valid credentials and try
            again
          </p>
        )}
        {redirecting && (
          <p>Account created successfully, redirecting to login page...</p>
        )}
      </div>
    </>
  );
}

export default Signup;

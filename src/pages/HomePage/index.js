import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import Logo from "../../assets/logo.png";
import Post from "../../components/Post";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

import { Route, useHistory, Switch } from "react-router-dom";

import Notfoundpage from "../NotFoundPage";
import Underdevpage from "../UnderDevPage";
import ProfilePage from "../ProfilePage";
import UploadPage from "../UploadPage";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Button, TextField, Modal, IconButton } from "@material-ui/core";
import { WbSunnyRounded, Brightness2Rounded } from "@material-ui/icons";

import "./style.css";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

function Homepage() {
  const classes = useStyles();
  const history = useHistory();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [darkModeOn, setDarkModeOn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User Logged In ...
        console.log(authUser);
        setUser(authUser);
      } else {
        //user Logged Out ...
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });

    if (history.location.pathname === "/") history.replace("/home");
  }, []);

  useEffect(() => {
    if (!darkModeOn) {
      document.documentElement.style.setProperty("--primary-app-color", "#333");
      document.documentElement.style.setProperty(
        "--secondary-app-color",
        "#1c1c1c"
      );
      document.documentElement.style.setProperty("--border-color", "#525252");
      document.documentElement.style.setProperty("--text-color", "#fff");
    } else {
      document.documentElement.style.setProperty(
        "--primary-app-color",
        "#fafafa"
      );
      document.documentElement.style.setProperty(
        "--secondary-app-color",
        "#fff"
      );
      document.documentElement.style.setProperty("--border-color", "#d3d3d3");
      document.documentElement.style.setProperty("--text-color", "#000");
    }
  }, [darkModeOn]);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          {/* <form className="app__signup">
                    <center>
                    <img className="app__headerImage" src={Logo} alt="logo" />
                    </center> */}

          <form className="app__signup" noValidate autoComplete="off">
            <center>
              <a href="/home">
                <img className="app__headerImage" src={Logo} alt="logo" />
              </a>
            </center>
            <br />
            <TextField
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
            />{" "}
            <br />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />{" "}
            <br />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />{" "}
            <br />
            <Button
              type="submit"
              onClick={signUp}
              variant="contained"
              color="primary"
              className="login__button"
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" noValidate autoComplete="off">
            <center>
              <a href="/home">
                <img className="app__headerImage" src={Logo} alt="logo" />
              </a>
            </center>
            <br />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />{" "}
            <br />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />{" "}
            <br />
            <Button
              type="submit"
              onClick={signIn}
              variant="contained"
              color="primary"
              className="login__button"
            >
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <a href="/home">
          <img className="app__headerImage" src={Logo} alt="logo" />
        </a>
        <IconButton onClick={() => setDarkModeOn(!darkModeOn)}>
          {darkModeOn ? (
            <Brightness2Rounded style={{ color: "#000" }} />
          ) : (
            <WbSunnyRounded style={{ color: "#fff" }} />
          )}
        </IconButton>
        {user ? (
          <Button
            onClick={() => auth.signOut()}
            variant="contained"
            color="secondary"
            className={classes.button}
          >
            Logout
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button
              onClick={() => setOpenSignIn(true)}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Sign In
            </Button>
            <Button
              onClick={() => setOpen(true)}
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <Sidebar />

      <Switch>
        <Route
          exact
          path="/home"
          component={() => (
            <div className="app__posts">
              <div className="app__postsLeft">
                {posts.map(({ id, post }) => (
                  <Post
                    key={id}
                    postId={id}
                    user={user}
                    username={post.username}
                    imageUrl={post.imageUrl}
                    caption={post.caption}
                  />
                ))}
              </div>
            </div>
          )}
        />
        <Route exact path="/notfound" component={Notfoundpage} />
        <Route exact path="/underdev" component={Underdevpage} />
        <Route exact path="/upload" component={UploadPage} />
        <Route exact path="/profile" component={ProfilePage} />
      </Switch>
      <Footer />
    </>
  );
}

export default Homepage;

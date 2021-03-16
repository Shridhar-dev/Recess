import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import Logo from "../../assets/logo.png";

import Header from "../../components/Header";
import Post from "../../components/Post";
import ImageUpload from "../../components/ImageUploader";
import Footer from "../../components/Footer";

import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Modal,
  IconButton,
  Grid,
  Hidden,
  Avatar,
} from "@material-ui/core";
import {
  WbSunnyRounded,
  Brightness2Rounded,
  HomeRounded,
  AddCircleRounded,
  ExploreRounded,
  AccountCircleRounded,
  ExitToAppRounded,
} from "@material-ui/icons";

import styles from "./style";
import { lightTheme, darkTheme } from "../../theme";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(styles);

function Homepage({ isLightTheme, setIsLightTheme }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

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
        console.log(snapshot);
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

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

  const checkPage = (pathname) => {
    if (isLightTheme)
      return window.location.pathname === pathname
        ? lightTheme.palette.text.primary
        : lightTheme.palette.text.secondary;
    else
      return window.location.pathname === pathname
        ? darkTheme.palette.text.primary
        : darkTheme.palette.text.secondary;
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
              <img className="app__headerImage" src={Logo} alt="logo" />
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
              <img className="app__headerImage" src={Logo} alt="logo" />
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

      <Header isLightTheme={isLightTheme} setIsLightTheme={setIsLightTheme} />

      <Grid container className={classes.homeBody} disableGutters={true}>
        <Grid item xs={0} sm={4} className={classes.sidebar}>
          <Hidden xsDown>
            <Link
              to="/"
              className={classes.link}
              style={{ color: checkPage("/home") }}
            >
              <HomeRounded />
              <span>Home</span>
            </Link>

            {user?.displayName ? (
              <Link
                to="/upload"
                className={classes.link}
                style={{ color: checkPage("/upload") }}
              >
                <AddCircleRounded />
                <span>Upload</span>
              </Link>
            ) : null}

            <Link
              to="/explore"
              className={classes.link}
              style={{ color: checkPage("/explore") }}
            >
              <ExploreRounded />
              <span>Explore</span>
            </Link>

            {user?.displayName ? (
              <Link
                to="/profile"
                className={classes.link}
                style={{ color: checkPage("/profile") }}
              >
                <AccountCircleRounded />
                <span>Profile</span>
              </Link>
            ) : null}

            <div
              className={classes.account}
              style={{ marginTop: window.innerHeight - 330 }}
            >
              {user?.displayName ? (
                <>
                  <Avatar src="" alt="User" className={classes.userPhoto} />
                  <span className={classes.username}>{user?.displayName}</span>
                  <IconButton
                    className={classes.logOutBtn}
                    onClick={() => auth.signOut()}
                  >
                    <ExitToAppRounded
                      color="error"
                      className={classes.logOutIcon}
                    />
                  </IconButton>
                </>
              ) : null}
            </div>
          </Hidden>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={8}
          className={classes.posts}
          style={{
            height: window.innerHeight - 55,
          }}
        >
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
        </Grid>
      </Grid>

      <Footer />
    </>
  );
}

export default Homepage;
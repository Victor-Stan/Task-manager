import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth, db, provider } from "./components/firebase-config";
import { signInWithPopup, UserCredential, User } from "firebase/auth";
import TodoList from "./components/TodoList";
import RedirectToTodos from "./components/RedirectToTodos";
import { RxAvatar } from "react-icons/rx";
import { HorizontalLayout } from "@hilla/react-components/HorizontalLayout.js";
import { VerticalLayout } from "@hilla/react-components/VerticalLayout.js";
import { MdWavingHand } from "react-icons/md";
import viteLogo from "/vite.svg";
import "./App.css";
import { LoginForm } from "@hilla/react-components/LoginForm.js";
import { FaFacebook } from "react-icons/fa";
import { FaGooglePlus } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const user: User | null = result.user;
      setUser(user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="app">
      {user ? (
        <Router>
          <HorizontalLayout theme="padding spacing">
            <p style={{ flexGrow: 1 }}>{new Date().toDateString()}</p>
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
            <RxAvatar size={60} className="avatar" />
          </HorizontalLayout>

          <HorizontalLayout>
            <h2 className="welcome">Hi, {user.email}!</h2>
          </HorizontalLayout>
          <Routes>
            <Route
              path="/todos/:status"
              element={
                <HorizontalLayout
                  theme="spacing padding"
                  className="height-4xl"
                  style={{ justifyContent: "center" }}
                >
                  <TodoList db={db} auth={auth} />
                </HorizontalLayout>
              }
            />

            <Route path="*" element={<RedirectToTodos />} />
          </Routes>
        </Router>
      ) : (
        <VerticalLayout
          theme="spacing padding"
          style={{ alignItems: "center" }}
        >
          <HorizontalLayout className="hl">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </HorizontalLayout>


          <h1 className="first-h1">
            Hello <MdWavingHand className="wave" /> , Login to continue.
          </h1>
          <LoginForm no-autofocus />
          <p className="para">Or</p>
          <button className="login" onClick={handleLogin}>
            sign in with Google
          </button>
<footer>
  <HorizontalLayout   theme="spacing-l padding">

  <FaFacebook size={30} className="fb" />
  <FaGooglePlus size={30} className="gp" />
  <AiFillTwitterCircle size={30} className="tt"/>
  <FaLinkedin size={30} className="lnk"/>
  </HorizontalLayout>
</footer>
        </VerticalLayout>
      )}
    </div>
  );
};

export default App;

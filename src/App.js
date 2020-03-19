import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })


  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    // console.log("Signed In");
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          password: '',
          error: '',
          isValid: false,
          existingUser: false
        }
        setUser(signedOutUser);
        console.log(res);
      })
      .catch(err => {

      })
    console.log("Signed Out");
  }

  const is_valid_email = email => /^.+@.+\..+$/.test(email);

  const switchForm = e => {
    console.log(e.target.checked);
    const createdUser = { ...user };
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  }

  const handleChange = event => {
    const newUserInfo = {
      ...user
    };

    // perform validation
    let isValid = true;
    if (event.target.name === 'email') {
      isValid = is_valid_email(event.target.value);
    }
    if (event.target.name === 'password') {
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }
    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    console.log(newUserInfo);
  }
  const createAccount = (e) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
      // console.log(user.email, user.password);
    }
    e.preventDefault();
    e.target.reset();
  }
  const hasNumber = input => /\d/.test(input);

  const signInUser = e => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
      // console.log(user.email, user.password);
    }
    e.preventDefault();
    e.target.reset();
  }
  return (
    <div className="login">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn &&
        <div>
          <p> Welcome, {user.name}</p>
          <p>Your Email is : {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>My Account</h1>
      <label htmlFor="switchForm"> If You Have Account Please Checked the Checkbox otherwise unchecked for signup
      <input onChange={switchForm} type="checkbox" name="switchForm" id="switchForm" />
      </label>
      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <h1>Sign In</h1>
        <input type="text" onBlur={handleChange} name="email" placeholder="please enter your email" required /><br />
        <input type="password" onBlur={handleChange} name="password" placeholder="enter your password" required />
        <br />
        <input type="submit" value="SignIn" />
      </form>
      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
      <h1>Sign Up</h1>
        <input type="text" onBlur={handleChange} name="name" placeholder="please enter your name" required /><br />
        <input type="text" onBlur={handleChange} name="email" placeholder="please enter your email" required /><br />
        <input type="password" onBlur={handleChange} name="password" placeholder="enter your password" required />
        <br />
        <input type="submit" value="Create Account" />
      </form>
      {
        user.error && <p style={{ color: 'red' }}>{user.error}</p>
      }
    </div>
  );
}

export default App;

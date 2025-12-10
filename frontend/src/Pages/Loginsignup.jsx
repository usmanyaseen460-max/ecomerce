import React, { useState } from 'react';
import './Loginsignup.css';

const Loginsignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const login = async () => {
    console.log("Login function executed", formData);
    // You can implement login fetch here
     try {
      const response = await fetch('https://mybackend-psi.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // FIXED
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        window.location.replace("/"); // redirect after signup
      } else {
        alert(data.errors || "Signup failed");
      }
    } catch (err) {
      console.error("Signup Error:", err);
    }
  }

  const signup = async () => {
    console.log("Signup function executed", formData);

    try {
      const response = await fetch('https://mybackend-psi.vercel.app/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // FIXED
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        window.location.replace("/"); // redirect after signup
      } else {
        alert(data.errors || "Signup failed");
      }
    } catch (err) {
      console.error("Signup Error:", err);
    }
  }

  return (
    <div className="loginsignup">
      <div className="login-container">
        <h1>{state}</h1>
        <div className="login-signup-fields">
          {state === "Sign Up" &&
            <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Your Email' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Your Password' />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Sign Up" ?
          <p className="login-signup-login"> Already have an account? <span onClick={() => setState("Login")}>Login here</span></p>
          :
          <p className="login-signup-login"> Create an account? <span onClick={() => setState("Sign Up")}>Click here</span></p>
        }
        <div className="login-signup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default Loginsignup;

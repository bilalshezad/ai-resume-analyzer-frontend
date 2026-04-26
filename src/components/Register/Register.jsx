import { useState } from "react";
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleSuccess , handleError } from '../../utils'

import '../Login/auth.css'

export default function Register() {
  const [registerInfo, setRegisterInfo] = useState({
    name : '',
    email: '',
    password: ''
  })

  const Navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    const copyRegisterInfo = { ...registerInfo}
    copyRegisterInfo[name] = value
    setRegisterInfo(copyRegisterInfo)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const { name, email, password } = registerInfo

    if (!name || !email || !password) {
      return handleError("All fields are required")
    }

    try {
     const REACT_APP_API_URL = `http://localhost:5000/user/register`
      const response = await fetch(REACT_APP_API_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerInfo)
      })

      const result = await response.json()
      const { success, message } = result

      if (!success) {
        return handleError(message)
      }

      if (success) {
        handleSuccess(message)
        setTimeout(() => {
          Navigate("/user/login", { replace: true })
        }, 1000)
      }

    } catch (err) {
      handleError(err)
    }
  }

  return (
    <div className='auth-container'>
      <div className="auth-card glass-card">
        <div className="auth-header">
          <h1>Get Started</h1>
          <p>Create your account to unlock AI insights</p>
        </div>
        <form className='auth-form' onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor='name'>Full Name</label>
            <input
              onChange={handleChange}
              type="text"
              name='name'
              placeholder='John Doe'
              value={registerInfo.name}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor='email'>Email Address</label>
            <input
              onChange={handleChange}
              type="email"
              name='email'
              placeholder='name@example.com'
              value={registerInfo.email}
            />
          </div>
          <div className="form-group">
            <label htmlFor='password'>Password</label>
            <input
              onChange={handleChange}
              type="password"
              name='password'
              placeholder='••••••••'
              value={registerInfo.password}
            />
          </div>

          <button className='btn-primary auth-btn' type='submit'>Create Account</button>

          <div className="auth-footer">
            Already have an account? <Link to="/user/login">Login Here</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

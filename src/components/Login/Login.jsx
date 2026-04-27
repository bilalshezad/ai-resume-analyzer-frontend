import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleSuccess , handleError } from '../../utils'
import './auth.css'

export default function Login() {
  const [LoginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })

  const Navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    const copyLoginInfo = { ...LoginInfo }
    copyLoginInfo[name] = value
    setLoginInfo(copyLoginInfo)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = LoginInfo

    if (!email || !password) {
      return handleError("Email and Password are required")
    }

    try {
      const REACT_APP_API_URL = `https://ai-resume-analyzer-backend-eight.vercel.app/user/login`
      const response = await fetch(REACT_APP_API_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(LoginInfo)
      })

      const result = await response.json()
      const { success, message, token , username , userEmail } = result

      if (!success) {
        return handleError(message)
      }

      if (success) {
        handleSuccess(message)
        localStorage.setItem("Token", token)
        localStorage.setItem("LoggedInUserName"  , username )
        localStorage.setItem("userEmail"  , userEmail)

        setTimeout(() => {
          Navigate("/user/resume/analyze", { replace: true })
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
          <h1>Welcome Back</h1>
          <p>Login to continue analyzing your career</p>
        </div>
        <form className='auth-form' onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor='email'>Email Address</label>
            <input
              onChange={handleChange}
              type="email"
              name='email'
              placeholder='name@example.com'
              value={LoginInfo.email}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor='password'>Password</label>
            <input
              onChange={handleChange}
              type="password"
              name='password'
              placeholder='••••••••'
              value={LoginInfo.password}
            />
          </div>

          <button className='btn-primary auth-btn' type='submit'>Sign In</button>

          <div className="auth-footer">
            Don’t have an account? <Link to="/user/register">Create Account</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

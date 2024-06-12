import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContex';
import '../../index.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { username, password });
            localStorage.setItem('token', data.token);
            login(data);
            navigate('/home'); // Use navigate directly
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <body className="bg-gray-100"> 
          <section className="min-h-screen flex justify-center items-center">
            <div className="container mx-auto">
              <div className="flex justify-center lg:justify-center">
                <div className="lg:w-2/3">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                    className="img-fluid"
                    alt="Sample image"
                  />
                </div>
                <div className="lg:w-5/6 lg:ml-auto">
                  <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                    <div className="mb-4">
                      <p className="text-center font-bold mb-0">Sign in with</p>
                    </div>
      
                    <div className="mb-4">
                      <input
                        type="text"
                        id="form3Example3"
                        className="w-full p-4 border border-gray-300 rounded-lg"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter a valid user name"
                      />
                      <br />
                      <small className="text-red-500">Enter your registration number</small>
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        id="form3Example4"
                        className="w-full p-4 border border-gray-300 rounded-lg"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
      
                    <div className="flex justify-between items-center mb-4">
                      <div className="mb-0">
                        <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                        <label className="form-check-label" htmlFor="form2Example3">
                          Remember me
                        </label>
                      </div>
                      <a href="#!" className="text-body">
                        Forgot password?
                      </a>
                    </div>
      
                    <div className="text-center lg:text-left mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg"
                      >
                        Login
                      </button>
                      <p className="text-sm font-bold mt-2 mb-0">
                        Don't have an account? <a href="/register" className="text-red-500">Register</a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </body>
      );
      
};

export default Login;

// RegisterPage.jsx
import React, { useState } from 'react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required.';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (validateForm()) {
      // Here you would typically send data to your backend API
      console.log('Registration Data:', formData);
      setMessage('Registration successful! Redirecting to login...');
      // In a real app, you'd perform API call, handle success/failure,
      // and redirect the user (e.g., using React Router).
      setFormData({ // Clear form after successful submission
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      setMessage('Please correct the errors in the form.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full flex flex-col md:flex-row transform transition-all duration-500 hover:scale-[1.01]">
        {/* Abstract / Artistic Side - Hidden on small screens */}
        <div className="hidden md:flex flex-col justify-between items-center p-8 bg-gradient-to-br from-green-500 to-blue-600 text-white w-1/2 relative">
          <div className="absolute inset-0 opacity-20" style={{
            background: 'radial-gradient(circle at top left, rgba(255,255,255,0.2) 0%, transparent 70%), radial-gradient(circle at bottom right, rgba(255,255,255,0.2) 0%, transparent 70%)'
          }}></div>
          <h2 className="relative z-10 text-4xl font-extrabold text-center leading-tight mb-4 drop-shadow-md">
            Join Our Fresh Community
          </h2>
          <p className="relative z-10 text-lg text-center opacity-90 mb-6">
            Unlock exclusive deals and the freshest groceries delivered right to your door.
          </p>
          <div className="relative z-10 text-6xl">
            🛒✨
          </div>
        </div>

        {/* Registration Form */}
        <div className="p-8 md:p-10 w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Create Account</h2>

          {message && (
            <div className={`p-3 mb-4 rounded-md text-center text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
                placeholder="Choose a username"
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
                placeholder="your@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
                placeholder="********"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
                placeholder="********"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 shadow-md"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="#" className="font-medium text-green-600 hover:text-green-800 transition duration-300">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

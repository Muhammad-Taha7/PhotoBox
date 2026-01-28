import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../Auth/Auth.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    const errorCode = error.code;
    
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed. Please contact support';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled';
      case 'auth/cancelled-popup-request':
        return 'Sign-in cancelled';
      default:
        return 'An error occurred. Please try again';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back! Redirecting...', {
          position: "bottom-right",
          autoClose: 9000,
        });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!', {
          position: "bottom-right",
          autoClose: 9000,
        });
      }
      
      // Success case - 9 second delay then redirect
      setTimeout(() => {
        setIsLoading(false);
        navigate('/photobox');
      }, 9000);
    } catch (error) {
      // Error case - show loader for 9 seconds, then show error and redirect
      toast.error(getErrorMessage(error), {
        position: "bottom-right",
        autoClose: 9000,
      });
      
      setTimeout(() => {
        setIsLoading(false);
        navigate('/photobox');
      }, 9000);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in successfully!', {
        position: "bottom-right",
        autoClose: 2000,
      });
      
      setTimeout(() => {
        navigate('/photobox');
      }, 9000);
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        toast.error(getErrorMessage(error), {
          position: "bottom-right",
          autoClose: 9000,
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl animate-fade-in">
            <div className="loader"></div>
            <p className="text-gray-700 font-semibold text-lg">Please wait...</p>
            <p className="text-gray-500 text-sm">Processing your request</p>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={9000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#017276] text-white p-12 flex-col justify-center relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-5 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-5 rounded-full animate-float-delayed"></div>
        
        <div className="relative z-10 max-w-xl animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            PhotoBox – Free Photos, No Limits
          </h1>
          <p className="text-[0.9rem] mb-8 text-white/90 leading-relaxed">
            Welcome to PhotoBox, your one-stop destination to find and download high-quality photos for free. Explore a wide range of stunning images, from nature and lifestyle to tech and abstract, all available for personal and commercial use. With PhotoBox, you can easily browse, download, and use photos without any hassle or subscription. Start exploring and bring your ideas to life today!
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 animate-slide-in-left">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Free to Download</span>
            </div>
            <div className="flex items-center gap-4 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-lg">Secure and private</span>
            </div>
            <div className="flex items-center gap-4 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <span className="text-lg">High-Resolution Images</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="bg-white rounded-2xl p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to continue to your gallery' : 'Sign up to get started'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="animate-slide-down">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017276] focus:border-transparent transition-all duration-300 outline-none"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017276] focus:border-transparent transition-all duration-300 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#017276] focus:border-transparent transition-all duration-300 outline-none"
                  required
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-600">
                    <input type="checkbox" className="mr-2 rounded" />
                    Remember me
                  </label>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-[#017276] text-white py-3 rounded-lg font-semibold hover:bg-[#015a5d] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Sign In */}
            <button 
              onClick={handleGoogleSignIn}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Toggle Login/Signup */}
            <p className="text-center mt-6 text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                className="text-[#017276] font-semibold ml-2 hover:underline transition-all duration-300"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(20px) translateX(-10px); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 100px;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }

        .loader {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #017276;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginSignup;
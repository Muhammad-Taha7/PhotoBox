import React, { useState, useEffect } from 'react';
import { auth } from '../Auth/Auth.js';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImages } from '../Redux/Slices/APiDataSlice.js';

const PhotoBoxWithRedux = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  
  const { data: images = [], loading, error } = useSelector((state) => state.images);

  // Get current user
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
    
    // Load some default images on component mount
    dispatch(fetchImages('nature'));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(fetchImages(search));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDownload = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `photobox-${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#017276] via-[#018a8f] to-[#017276] text-white sticky top-0 z-50 shadow-2xl backdrop-blur-lg">
        <div className="w-full px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <img 
                  className='rounded-xl w-full h-full object-cover' 
                  src="https://img.freepik.com/premium-vector/box-shape-camera-photography-logo-design-inspiration_573037-679.jpg" 
                  alt="PhotoBox Logo" 
                />
              </div>
              <div>
                <span className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">
                  PhotoBox
                </span>
                <p className="text-xs text-white/70 font-medium">Unlimited Free Images</p>
              </div>
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-white/20 px-5 py-3 rounded-2xl transition-all duration-300 group border border-white/20 hover:border-white/40 backdrop-blur-sm"
              >
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/50 group-hover:ring-4 group-hover:ring-white transition-all duration-300"
                  />
                ) : (
                  <div className="w-11 h-11 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center text-[#017276] font-bold text-lg shadow-lg ring-2 ring-white/50 group-hover:ring-4 group-hover:ring-white transition-all duration-300">
                    {user?.displayName ? user.displayName[0].toUpperCase() : user?.email[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-white/80">{user?.email}</p>
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl py-3 animate-slideDown border border-gray-100">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'User'} 
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-[#017276]/30"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-[#017276] to-[#015a5d] rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {user?.displayName ? user.displayName[0].toUpperCase() : user?.email[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition-all duration-300 flex items-center gap-3 font-semibold group mt-1"
                  >
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-br from-[#017276] via-[#018a8f] to-[#025f63] text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative w-full px-6 lg:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fadeInUp">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                Discover Beautiful
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-yellow-200 animate-shimmer">
                  Free Images
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fadeInUp animation-delay-200 font-light max-w-3xl mx-auto">
              Download stunning high-quality photos for free. No attribution required.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto animate-fadeInUp animation-delay-400">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search for images... (e.g., nature, technology, travel)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-8 py-6 pr-36 rounded-full bg-white/95 backdrop-blur-lg border-2 border-white/50 text-gray-800 text-lg outline-none focus:ring-4 focus:ring-white/40 focus:border-white transition-all duration-300 shadow-2xl placeholder-gray-400 group-hover:shadow-3xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#017276] to-[#015a5d] text-white px-10 py-4 rounded-full font-bold hover:from-[#015a5d] hover:to-[#013f41] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </span>
                </button>
              </div>
            </form>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fadeInUp animation-delay-600">
              <p className="text-white/70 text-sm font-medium mr-2">Popular:</p>
              {['Nature', 'Technology', 'Business', 'Travel', 'Food', 'Architecture', 'Animals', 'Art'].map((tag, index) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearch(tag);
                    dispatch(fetchImages(tag));
                  }}
                  className="px-6 py-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 hover:scale-110 transition-all duration-300 text-sm font-semibold border border-white/30 hover:border-white/50 shadow-lg animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="w-full px-6 lg:px-12 py-16">
        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-10 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-2xl p-6 flex items-start gap-4 shadow-lg animate-shake">
            <svg className="w-7 h-7 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-900 font-bold text-lg">Error loading images</p>
              <p className="text-red-700 text-sm mt-1">{typeof error === 'string' ? error : 'Please check your API key configuration'}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="loader-large"></div>
              <div className="loader-inner"></div>
            </div>
            <p className="mt-8 text-gray-700 font-bold text-xl animate-pulse">Loading amazing photos...</p>
            <p className="mt-2 text-gray-500 text-sm">Please wait while we fetch the best images for you</p>
          </div>
        ) : images.length > 0 ? (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">
                {search ? `Results for "${search}"` : 'Featured Images'}
              </h2>
              <p className="text-gray-600 font-medium">{images.length} images found</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={image.urls.regular}
                      alt={image.alt_description || 'Photo'}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                      <button
                        onClick={() => handleDownload(image.urls.full, image.id)}
                        className="bg-white text-[#017276] px-6 py-3 rounded-xl font-bold hover:bg-[#017276] hover:text-white transition-all duration-300 flex items-center gap-2 shadow-2xl transform hover:scale-110 active:scale-95"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>

                    {/* Image Stats Badge */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {(Math.random() * 1000 + 100).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-5 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      {image.user.profile_image?.small && (
                        <img 
                          src={image.user.profile_image.small} 
                          alt={image.user.name}
                          className="w-8 h-8 rounded-full ring-2 ring-[#017276]/20"
                        />
                      )}
                      <p className="text-sm text-gray-600 truncate flex-1">
                        by{' '}
                        <span className="font-bold text-[#017276]">{image.user.name}</span>
                      </p>
                    </div>
                    {image.alt_description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{image.alt_description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
            <div className="relative">
              <svg className="w-40 h-40 text-gray-300 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#017276]/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <p className="mt-8 text-gray-600 text-2xl font-bold">No images found</p>
            <p className="mt-2 text-gray-500 text-lg">Try searching for something amazing!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-[#017276] via-[#018a8f] to-[#017276] text-white py-12 mt-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative w-full px-6 lg:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-2">PhotoBox</h3>
              <p className="text-white/80 text-lg">Your source for beautiful free images</p>
            </div>
            
            <p className="text-white/90 text-lg mb-4">
              Photos provided by{' '}
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline hover:text-yellow-200 transition-colors duration-300">
                Unsplash
              </a>
            </p>
            
            <div className="border-t border-white/20 pt-6 mt-6">
              <p className="text-white/70 text-sm">© 2026 PhotoBox. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .loader-large {
          width: 80px;
          height: 80px;
          border: 8px solid #e5e7eb;
          border-top: 8px solid #017276;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loader-inner {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 6px solid transparent;
          border-top: 6px solid #018a8f;
          border-radius: 50%;
          animation: spin 0.7s linear infinite reverse;
          top: 10px;
          left: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default PhotoBoxWithRedux;
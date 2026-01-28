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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#017276] text-white  sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img className='rounded-full' src="https://img.freepik.com/premium-vector/box-shape-camera-photography-logo-design-inspiration_573037-679.jpg" alt="" />
              </div>
              <span className="text-2xl font-bold">PhotoBox</span>
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#017276] font-bold">
                  {user?.displayName ? user.displayName[0].toUpperCase() : user?.email[0].toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-white/70">{user?.email}</p>
                </div>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="bg-gradient-to-r from-[#017276] to-[#015a5d] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Discover Beautiful Free Images
            </h1>
            <p className="text-lg text-white/90 mb-8 animate-fade-in-delay">
              Download high-quality photos for free. No attribution required.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto animate-fade-in-delay-2">
              <input
                type="text"
                placeholder="Search for images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 pr-32 rounded-full border border-white text-white text-lg outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#017276] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#015a5d] transition-all duration-300 shadow-lg"
              >
                Search
              </button>
            </form>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in-delay-3">
              {['Nature', 'Technology', 'Business', 'Travel', 'Food', 'Architecture'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearch(tag);
                    dispatch(fetchImages(tag));
                  }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 text-sm font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="container mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-800 font-semibold">Error loading images</p>
              <p className="text-red-600 text-sm">{typeof error === 'string' ? error : 'Please check your API key configuration'}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loader-large"></div>
            <p className="mt-4 text-gray-600 font-semibold">Loading amazing photos...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={image.urls.regular}
                    alt={image.alt_description || 'Photo'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleDownload(image.urls.full, image.id)}
                      className="bg-white text-[#017276] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <p className="text-sm text-gray-600 truncate">
                    Photo by{' '}
                    <span className="font-semibold text-[#017276]">{image.user.name}</span>
                  </p>
                  {image.alt_description && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{image.alt_description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-32 h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-gray-500 text-lg">No images found. Try searching for something!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#017276] text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80">
            Photos provided by{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
              Unsplash
            </a>
          </p>
          <p className="mt-2 text-white/60 text-sm">© 2026 PhotoBox. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-delay-2 {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-delay-3 {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.6s ease-out 0.2s backwards;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in-delay-2 0.6s ease-out 0.4s backwards;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in-delay-3 0.6s ease-out 0.6s backwards;
        }

        .loader-large {
          width: 60px;
          height: 60px;
          border: 6px solid #f3f3f3;
          border-top: 6px solid #017276;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PhotoBoxWithRedux;
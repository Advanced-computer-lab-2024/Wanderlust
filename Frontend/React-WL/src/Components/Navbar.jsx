import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Images/Wl-Logog.png';

const Navbar = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path
      ? 'text-white bg-black rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';
  };

  return (
    <>
      <nav className="bg-indigo-700 border-b border-indigo-500">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
              <Link className="flex flex-shrink-0 items-center mr-4" to="/">
                <img className="h-10 w-auto" src={logo} alt="React Jobs" />
                {/* <span className="hidden md:block text-white text-2xl font-bold ml-2">Wanderlust</span> */}
              </Link>
              <div className="md:ml-auto">
                <div className="flex space-x-2">
                  <Link to="/" className={getLinkClass('/')}>
                    Home
                  </Link>
                  <Link to="/tourguide" className={getLinkClass('/tourguide')}>
                    Tourguide
                  </Link>
                  <Link to="/advertiser" className={getLinkClass('/advertiser')}>
                    Advertiser
                  </Link>
                  <Link to="/seller" className={getLinkClass('/seller')}>
                    Seller
                  </Link>
                  <Link to="/tourism-governor" className={getLinkClass('/tourism-governor')}>
                    Tourism Governor
                  </Link>
                  <Link to="/tourist" className={getLinkClass('/tourist')}>
                    Tourist
                  </Link>
                  <Link to="/register" className={getLinkClass('/register')}>
                    Sign-Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
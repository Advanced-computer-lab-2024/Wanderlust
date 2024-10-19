import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Images/Wl-Logog.png';

const Navbar = ({t1,t2,t3,t4,t5,t6,p1,p2,p3,p4,p5,p6}) => {
  const location = useLocation();

  const getLinkClass = (path) => {
    if(location.pathname === path){
      return 'text-white bg-black rounded-md px-3 py-2';
    }
    else{
      return 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';
    }
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
                  <Link to="{p1}" className={getLinkClass('/tourguide')}>
                    {t1}
                  </Link>
                  <Link to="/advertiser" className={getLinkClass('/advertiser')}>
                    {t2}
                  </Link>
                  <Link to="/seller" className={getLinkClass('/seller')}>
                    {t3}
                  </Link>
                  <Link to="/tourism-governor" className={getLinkClass('/tourism-governor')}>
                    {t4}
                  </Link>
                  <Link to="/tourist" className={getLinkClass('/tourist')}>
                   {t5}
                  </Link>
                  <Link to="/login" className={"border "+getLinkClass('/login')}>
                    {t6}
                  </Link>
                  {/* <Link to="/register" className={getLinkClass('/register')}>
                    Join Us
                  </Link> */}
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
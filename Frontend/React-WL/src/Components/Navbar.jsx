import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/Images/Wl-Logog.png';
import { ShoppingCart, Heart, Bell, ReceiptText, Bookmark, ArrowLeft } from 'lucide-react';

const Navbar = ({ t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const getLinkClass = (path) => {
    if (location.pathname === path) {
      return 'text-white rounded-md px-3 py-2';
    } else {
      return 'text-white hover:bg-gray-400 hover:bg-opacity-20 rounded-md px-3 py-2';
    }
  };

  const getLinkStyle = (path) => {
    if (location.pathname === path) {
      return {        
        transition: 'background-color 0.3s ease',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',};
    } else {
      return {

      };
    }
  };

  return (
    <>
      <nav style={{borderColor: 'rgb(0,59,149)' }} className="bg-custom border-b">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex flex-1 items-center justify-start">
              <button onClick={handleBackClick} className="text-white hover:bg-gray-400 hover:bg-opacity-20 rounded-md px-3 py-2">
                <ArrowLeft size={24} />
              </button>
              <Link className="flex flex-shrink-0 items-center ml-4" to="/">
                <img className="h-10 w-auto" src={logo} alt="React Jobs" />
              </Link>
            </div>
            <div className="md:ml-auto">
              <div className="flex flex-wrap space-x-2">
                {/* Render only if the props are passed */}
                {t1 && p1 && (
                  <Link to={p1} className={getLinkClass(p1)} style={getLinkStyle(p1)}>{t1}</Link>
                )}
                {t2 && p2 && (
                  <Link to={p2} className={getLinkClass(p2)} style={getLinkStyle(p2)}>{t2}</Link>
                )}
                {t3 && p3 && (
                  <Link to={p3} className={getLinkClass(p3)} style={getLinkStyle(p3)}>{t3}</Link>
                )}
                {t4 && p4 && (
                  <Link to={p4} className={getLinkClass(p4)} style={getLinkStyle(p4)}>{t4}</Link>
                )}
                {t5 && p5 && (
                  <Link to={p5} className={getLinkClass(p5)} style={getLinkStyle(p5)}>{t5}</Link>
                )}
                {t7 && p7 && (
                  <Link to={p7} className={getLinkClass(p7)}>{t7}</Link>
                )}
                {t8 && p8 && (
                  <Link
                    to={p8}
                    className={`${getLinkClass(p8)} flex items-center px-2 transition duration-300 hover:text-gray-300`}
                  >
                    <Bookmark size={24} />
                  </Link>
                )}
                {t9 && p9 && (
                  t9 === "OrderHistory" ? (
                    <Link to={p9} className={getLinkClass(p9)}>
                      <ReceiptText size={24} />
                    </Link>
                  ) : (
                    <Link to={p9} className={getLinkClass(p9)}>{t9}</Link>
                  )
                )}
                {t10 && p10 && (
                  t10 === "Wishlist" ? (
                    <Link to={p10} className={getLinkClass(p10)}>
                      <Heart size={24} />
                    </Link>
                  ) : (
                    <Link to={p10} className={getLinkClass(p10)}>{t10}</Link>
                  )
                )}
                {t11 && p11 && (
                  t11 === "Cart" ? (
                    <Link to={p11} className={getLinkClass(p11)}>
                      <ShoppingCart size={24} />
                    </Link>
                  ) : (
                    <Link to={p11} className={getLinkClass(p11)}>{t11}</Link>
                  )
                )}
                {t12 && p12 && (
                  t12 === "Notifications" ? (
                    <Link to={p12} className={getLinkClass(p12)}>
                      <Bell size={24} />
                    </Link>
                  ) : (
                    <Link to={p12} className={getLinkClass(p12)}>{t12}</Link>
                  )
                )}
                {t6 && p6 && (
                  <Link to={p6} className={"border " + getLinkClass(p6)}>{t6}</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

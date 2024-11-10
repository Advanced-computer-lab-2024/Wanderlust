import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Images/Wl-Logog.png';

const Navbar = ({ t1, t2, t3, t4, t5, t6, p1, p2, p3, p4, p5, p6 }) => {
  const location = useLocation();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    // Check if p1 matches the "/TouristProfile" route
    if (p1 === "/TouristProfile") {
      setFlag(true);
    }
  }, [p1]);

  const getLinkClass = (path) => {
    if (location.pathname === path) {
      return 'text-white bg-black rounded-md px-3 py-2';
    } else {
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
              </Link>

              {/* Manage Products Title next to the Logo */}
              <div className="text-white text-xl font-semibold mr-6">
                Manage Products
              </div>

              <div className="md:ml-auto">
                <div className="flex space-x-2">
                  {/* Render only if the props are passed */}

                  {t1 && p1 && (
                    <Link to={p1} className={getLinkClass(p1)}>
                      {t1}
                    </Link>
                  )}

                  {t2 && p2 && (
                    <Link to={p2} className={getLinkClass(p2)}>
                      {t2}
                    </Link>
                  )}

                  {t3 && p3 && (
                    <Link to={p3} className={getLinkClass(p3)}>
                      {t3}
                    </Link>
                  )}

                  {t4 && p4 && (
                    <Link to={p4} className={getLinkClass(p4)}>
                      {t4}
                    </Link>
                  )}

                  {t5 && p5 && (
                    flag ? (
                      <div className="relative group mt-1.5">
                        <Link to={p5} className={getLinkClass(p5)}>
                          {t5}
                        </Link>
                        <div className="absolute hidden group-hover:block mt-2 bg-black shadow-lg rounded-md w-48">
                          <Link to={'/BookingsTourist'} className="block px-4 py-2 text-white hover:bg-gray-700">
                            My Bookings
                          </Link>
                          <Link to={'/ComplaintsTourist'} className="block px-4 py-2 text-white hover:bg-gray-700">
                            My Complaints
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link to={p5} className={getLinkClass(p5)}>
                        {t5}
                      </Link>
                    )
                  )}

                  {t6 && p6 && (
                    <Link to={p6} className={"border " + getLinkClass(p6)}>
                      {t6}
                    </Link>
                  )}
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

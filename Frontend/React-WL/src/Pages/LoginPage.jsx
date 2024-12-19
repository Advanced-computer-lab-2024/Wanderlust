import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import GuestNavBar from "../Components/NavBars/GuestNavBar";

const Login = () => {
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true); // Spinner state
    const navigate = useNavigate();
    const [showTerms, setShowTerms] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleAcceptTerms = async () => {
        const response = await axios.post("http://localhost:8000/api/admin/acceptTerms", {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
        });
        if (response.data.success) {
            setShowTerms(false);
            if (role === "tourguide") {
                navigate("/Tgprofile");
            } else if (role === "seller") {
                navigate("/SellerProfile");
            } else if (role === "advertiser") {
                navigate("/AdvertiserProfile");
            }
        }
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const onLogin = async (e) => {
        e.preventDefault();
        const data = {
            username: formData.username,
            password: formData.password,
            role: role,
        };
    try {
        const response = await axios.post("http://localhost:8000/api/admin/login", data);
        localStorage.setItem("jwtToken", response.data.token);
        if (data.role === "admin") {
            navigate("/admindashboard");
        } else if (data.role === "tourist") {
            navigate("/TouristProfile");
        } else if (data.role === "tourismGovernor") {
            navigate("/TourismGovernorProfile");
        }

        if (data.role === "tourguide" || data.role === "seller" || data.role === "advertiser") {
            const response2 = await axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            if (response2.data.termsAccepted === true) {
                if (data.role === "tourguide") {
                    navigate("/Tgprofile");
                } else if (data.role === "seller") {
                    navigate("/SellerProfile");
                } else if (data.role === "advertiser") {
                    navigate("/AdvertiserProfile");
                }
            } else {
                setShowTerms(true);
            }
            
        }
    }catch (error) {
            console.error("Login error:", error);
            if (error.response?.status === 400) {
                setErrorMessage("Incorrect username or password. Please try again.");
            } else if (error.response?.status === 404) {
                setErrorMessage("Username does not exist");
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    };

    return (
        <>
            <GuestNavBar />
            <div className="max-w-screen-lg mx-auto mt-10 p-8 flex items-center justify-between bg-gradient-to-r from-blue-400 via-purple-500 to-blue-900">
                {/* Left - Form Section */}
                <div  className="bg-white p-10 rounded shadow-2xl w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6">Login</h1>
                    {errorMessage && (
                        <div className="mb-4 text-red-500 font-semibold text-sm">
                            {errorMessage}
                        </div>
                    )}
                    <form>
                        <div className="mb-6">
                            <label htmlFor="role" className="block text-gray-800 font-semibold">
                                Role<span className="text-red-500"> *</span>
                            </label>
                            <select
                                value={role}
                                onChange={handleRoleChange}
                                name="role"
                                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select your role</option>
                                <option value="tourist">Tourist</option>
                                <option value="tourguide">Tour Guide</option>
                                <option value="seller">Seller</option>
                                <option value="advertiser">Advertiser</option>
                                <option value="admin">Admin</option>
                                <option value="tourismGovernor">Tourism Governor</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="username" className="block text-gray-800 font-semibold">
                                Username<span className="text-red-500"> *</span>
                            </label>
                            <input
                                value={formData.username}
                                onChange={handleInputChange}
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-800 font-semibold">
                                Password<span className="text-red-500"> *</span>
                            </label>
                            <input
                                value={formData.password}
                                onChange={handleInputChange}
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                            />
                        </div>
                        <button
                            onClick={onLogin}
                            className="w-full bg-custom text-white p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">Don't have an account?</p>
                        <Link to="/register" className="text-indigo-600 hover:underline">
                            Sign Up
                        </Link>
                        <p className="text-gray-600"></p>
                        <Link to="/forgetpassword" className="text-indigo-600 hover:underline">
                            Forget Password
                        </Link>
                    </div>
                </div>
                {/* Right - Text Section */}
                <div className="w-1/2 hidden md:block text-white px-8">
                    <h2 className="text-4xl font-bold mb-4"style={{ fontFamily: "'Tangerine'" }}>Welcome to Wanderlust</h2>
                    <p className="text-lg mb-4">
                    Discover the world with ease and excitement! Join our community of travelers, tour guides, and explorers
                    </p>
                    <p className="text-lg mb-4">
                    Plan amazing journeys and access curated travel itineraries and explore top destinations.
                    </p>
                    <p className="text-lg">
                    Choose your role and access exclusive features and services.
                    </p>
                </div>
            </div>

            {showTerms && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-lg max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
                        <p className="mb-4">
                            Please read and accept our terms and conditions to proceed.
                        </p>
                        <button
                            onClick={handleAcceptTerms}
                            className="bg-indigo-600 text-white p-2 rounded-md"
                        >
                            Accept Terms
                        </button>
                    </div>
                </div>
            )}
            
        </>
    );
};

export default Login;

import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [role, setRole] = useState("");
    const navigate = useNavigate();
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

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };
    const onLogin = async (e) => {
        e.preventDefault();
        const data = {
            username: formData.username,
            password: formData.password,
            role: role,
        }
        const response = await axios.post("http://localhost:8000/api/admin/login", data);
        console.log(response.data.token);
        localStorage.setItem("jwtToken", response.data.token);
        if(data.role === "admin") {
            navigate("/admindashboard");
        } 
        // const response2 = await axios.get("http://localhost:8000/api/admin/getLoggedInUser", {
        //     headers: {
        //         Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        //     }
        // });
        // console.log(response2.data);
    }
    return (
        <>
   <Navbar t1={"Tour guide"} p1={"/tourguide"} t2={"Advertiser"} p2={"/a"} t3={"Seller"} p3={"/seller"} t4={"Tourism Govener"} p4={"/a"} t5={"Tourist"} p5={"/a"} t6={"Login"} p6={"/Login"} />

        <div className="max-w-md mx-auto mt-10 p-8 rounded shadow-2xl">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
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
                <button onClick={onLogin} className="w-full bg-indigo-600 text-white p-2 rounded-md">
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-gray-600">Don't have an account?</p>
                <Link to="/register" className="text-indigo-600 hover:underline">
                    Sign Up
                </Link>
            </div>
        </div>
        </>
    );
};

export default Login;
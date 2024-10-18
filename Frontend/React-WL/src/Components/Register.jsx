import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [role, setRole] = useState("");
    const [nationalities, setNationalities] = useState([]);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
        mobileNumber: "", // Tourist, Tour Guide
        nationality: "", // Tourist
        dateOfBirth: "", // Tourist
        job: "", // Tourist
        YOE : "", // Tour Guide
        previousWork : "", // Tour Guide
    });

    //lesa tourguide m4 sha8ala w lesa seller w advertiser


    useEffect(() => {
        axios
            .get("https://restcountries.com/v3.1/all")
            .then((response) => {
                // Extract the demonym (nationality) from each country
                const fetchedNationalities = response.data.map(
                    (country) => country.demonyms?.eng?.m || country.name.common
                );
                setNationalities(fetchedNationalities.sort()); // Sorting the nationalities alphabetically
            })
            .catch((error) => {
                console.error("Error fetching nationalities:", error);
            });
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle role change
    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password1 !== formData.password2) {
            alert("Passwords do not match");
            return;
        }
         if (role === "tourist") {
            const data = {
                username: formData.username,
                email: formData.email,
                password: formData.password1,
                mobileNumber: formData.mobileNumber,
                nationality: formData.nationality,
                dateOfBirth: formData.dateOfBirth,
                job: formData.job,
            };
            // console.log(data);
            const response = await axios.post("http://localhost:8000/api/tourist/createTourist", data);
            console.log(response.data);
        } else if (role === "tour_guide") {
            const dataUser = {
                username: formData.username,
                email: formData.email,
                password: formData.password1,
                role: "tour_guide",
            }
            const responseUser = await axios.post(
                "http://localhost:8000/createUser",
                dataUser
            );
            console.log(responseUser);
        } else if (role === "seller") {
            const data = {
                username: formData.username,
                email: formData.email,
                password: formData.password1,
                role : 'seller',
            }

            const response = await axios.post(
                "http://localhost:8000/createUser",
                data
            );
            console.log(response.data);
        } else if (role === "advertiser") {
            const data = {
                username: formData.username,
                email: formData.email,
                password: formData.password1,
                role : 'advertiser',
            }

            const response = await axios.post(
                "http://localhost:8000/createUser",
                data
            );
            console.log(response.data);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded shadow-2xl w-full overflow-y-auto" style={{ maxHeight: "80vh" }}>
                <h2 className="text-2xl font-bold text-gray-800">Register</h2>
                <form action="" className="mt-6">
                    <select id="role" value={role} onChange={handleRoleChange}>
                        <option value="">Choose a role</option>
                        <option value="tourist">Tourist</option>
                        <option value="tour_guide">Tour Guide</option>
                        <option value="seller">Seller</option>
                        <option value="advertiser">Advertiser</option>
                    </select>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-gray-800 font-semibold">
                            Username<span className="text-red-500"> *</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-800 font-semibold">
                            Email Address<span className="text-red-500"> *</span>
                        </label>
                        <input
                            value={formData.email}
                            onChange={handleInputChange}
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-800 font-semibold">
                            Password<span className="text-red-500"> *</span>
                        </label>
                        <input
                            value={formData.password1}
                            onChange={handleInputChange}
                            type="password"
                            name="password1"
                            placeholder="Enter your password"
                            className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-800 font-semibold">
                            Confirm Password<span className="text-red-500"> *</span>
                        </label>
                        <input
                            value={formData.password2}
                            onChange={handleInputChange}
                            type="password"
                            name="password2"
                            placeholder="Confirm your password"
                            className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        />
                    </div>

                    {role === "tourist" && (
                        <>
                            <div className="mb-6">
                                <label className="block text-gray-800 font-semibold">Mobile Number<span className="text-red-500"> *</span></label>
                                <input
                                    type="number"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter your mobile number"
                                    className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-800 font-semibold">Nationality <span className="text-red-500"> *</span></label>
                                <select
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select your nationality</option>
                                    {nationalities.map((nationality, index) => (
                                        <option key={index} value={nationality}>
                                            {nationality}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-800 font-semibold">Date of Birth <span className="text-red-500"> *</span></label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-800 font-semibold">Job <span className="text-red-500"> *</span></label>
                                <input
                                    type="text"
                                    name="job"
                                    value={formData.job}
                                    onChange={handleInputChange}
                                    placeholder="Enter your Job or Student"
                                    className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                                />
                            </div>
                        </>
                    )}


                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-3 rounded-md"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                <p className="text-gray-600">Already have an account?</p>
                <Link to="/login" className="text-indigo-600 hover:underline">
                    Login
                </Link>
            </div>
            </div>
        </div>
    );
};

export default Register;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [nationalities, setNationalities] = useState([]);
  const [documents, setDocuments] = useState({
    idTourGuideDocument: null,
    certificateTourGuideDocument: null,
    idSellerDocument: null,
    taxationRegistryCardSellerDocument: null,
    idAdvertiserDocument: null,
    taxationRegistryCardAdvertiserDocument: null,
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    mobileNumber: "", // Tourist, Tour Guide
    nationality: "", // Tourist
    dateOfBirth: "", // Tourist
    job: "", // Tourist
    YOE: "", // Tour Guide
    previousWork: "", // Tour Guide
    idTourguideDocument: "", // Tour Guide
    CertificateTourguideDocument: "", // Tour Guide
    description: "", // Seller
    sellerType: "", // Seller
    idSellerDocument: "", // Seller
    taxationRegistryCardSellerDocument: "", // Seller
    website: "", // Advertiser
    hotline: "", // Advertiser
    companyProfile: "", // Advertiser
    idAdvertiserDocument: "", // Advertiser
    taxationRegistryCardAdvertiserDocument: "", // Advertiser
  });
  
  //lesa tourguide m4 sha8ala w lesa seller w advertiser

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const fetchedNationalities = response.data.map(
          (country) => country.demonyms?.eng?.m || country.name.common
        );
        setNationalities(fetchedNationalities.sort());
        setLoading(false); // Set loading to false after fetching data
      })
      .catch((error) => {
        console.error("Error fetching nationalities:", error);
        setLoading(false); // Also set loading to false in case of an error
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
  const handleFileChange = (e) => {
    setDocuments({
      ...documents,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
  if (!formData) {
      alert("Form data is not initialized.");
      return;
    }  
  if (!formData.username || !formData.password1 || !formData.password2 || !formData.mobileNumber) {
      alert("Please fill in all required fields.");
      return;
    }
  if (formData.password1 !== formData.password2) {
      alert("Passwords do not match");
      return;
    }
  if (role === "tourist" && formData.age < 18) {
    alert("Tourists must be at least 18 years old.");
    return;
  }
  
  try {
    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password1,
      mobileNumber: formData.mobileNumber,
      role: role,
    };
    const formD1 = new FormData();
    const responseUser = await axios.post(`http://localhost:8000/signup`, data);
    const userId = responseUser.data._id;
    if (role === "tourist") {
      const data = {
        nationality: formData.nationality,
        DOB: formData.dateOfBirth,
        jobOrStudent: formData.job,
      };
      // console.log(data);
      const response = await axios.post(
        `http://localhost:8000/api/tourist/createTourist/${userId}`,
        data
      );
      console.log(response.data);
    } else if (role === "tourguide") {
      const data = {
        YOE: formData.YOE,
        previousWork: formData.previousWork,
      };
      console.log(data);
      const response = await axios.put(
        `http://localhost:8000/api/tourGuide/createtgprofile/${userId}`,
        data
      );
      console.log(response.data);
      formD1.append("userId", userId);
      formD1.append("file", documents.idTourGuideDocument);
      const userType = "TourGuide";
      var documentType = "id";
      const responseDocId = await axios.put(
        `http://localhost:8000/api/documents/uploadDocument/${userType}/${documentType}`,
        formD1,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      formD1.delete("file");
      formD1.append("file", documents.certificateTourGuideDocument);
      documentType = "certificate";
      const responseDocCert = await axios.put(
        `http://localhost:8000/api/documents/uploadDocument/${userType}/${documentType}`,
        formD1,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // //upload documents
    } else if (role === "seller") {
      //upload documents

      const data = {
        type: formData.sellerType,
        description: formData.description,
      };
      const response = await axios.put(
        `http://localhost:8000/api/seller/createSeller/${userId}`,
        data
      );
      console.log(response.data);
      formD1.append("userId", userId);
      formD1.append("file", documents.idSellerDocument);
      var documentType = "id";
      const userType = "Seller";
      const responseDocId = await axios.put(
        `http://localhost:8000/api/documents/uploadDocument/${userType}/${documentType}`,
        formD1,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      formD1.delete("file");
      formD1.append("file", documents.taxationRegistryCardSellerDocument);
      documentType = "taxation";
      const responseDocTax = await axios.put(
        `http://localhost:8000/api/documents/uploadDocument/${userType}/${documentType}`,
        formD1,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // create seller
    } else if (role === "advertiser") {
      const data = {
        website: formData.website,
        hotline: formData.hotline,
        companyProfile: formData.companyProfile,
      };
      const response = await axios.put(
        `http://localhost:8000/api/advertiser/createAdvertiserProfile/${userId}`,
        data
      );
      console.log(response.data);
      formD1.append("userId", userId);
      formD1.append("file", documents.idAdvertiserDocument);
      var documentType = "id";
      const userType = "Advertiser";
      const responseDocId = await axios.put(
        `http://localhost:8000/api/documents/uploadDocument/${userType}/${documentType}`,
        formD1,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      formD1.delete("file");
      formD1.append("file", documents.taxationRegistryCardAdvertiserDocument);
      documentType = "taxation";
      const responseDocTax = await axios.put(
        `http://localhost:8000/api/documents/uploadDocument/${userType}/${documentType}`,
        formD1,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }
    navigate("/login");
  } catch (error) {
    console.error("Error during form submission:", error);
    alert("An error occurred during form submission. Please try again.");
  }
  };
  if (loading)
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

  return (
    <div className="max-w-screen-lg mx-auto mt-10 p-12 flex items-center justify-between bg-gradient-to-r from-blue-400 via-purple-500 to-blue-900">
      <div
        className="bg-white p-10 rounded shadow-2xl w-full max-w-md"
        
      >
        <h2 className="text-2xl font-bold text-gray-800">Register</h2>
        <form action="" className="mt-6">
          <select id="role" value={role} onChange={handleRoleChange}>
            <option value="">Choose a role</option>
            <option value="tourist">Tourist</option>
            <option value="tourguide">Tour Guide</option>
            <option value="seller">Seller</option>
            <option value="advertiser">Advertiser</option>
          </select>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-gray-800 font-semibold"
            >
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
            <label
              htmlFor="email"
              className="block text-gray-800 font-semibold"
            >
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
            <label
              htmlFor="password"
              className="block text-gray-800 font-semibold"
            >
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
            <label
              htmlFor="password"
              className="block text-gray-800 font-semibold"
            >
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
          <div className="mb-6">
            <label className="block text-gray-800 font-semibold">
              Mobile Number<span className="text-red-500"> *</span>
            </label>
            <input
              type="number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          {role === "tourist" && (
            <>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Nationality <span className="text-red-500"> *</span>
                </label>
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
                <label className="block text-gray-800 font-semibold">
                  Date of Birth <span className="text-red-500"> *</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Job <span className="text-red-500"> *</span>
                </label>
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
          {role === "tourguide" && (
            <>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Years of Experience <span className="text-red-500"> *</span>
                </label>
                <input
                  type="number"
                  name="YOE"
                  value={formData.YOE}
                  onChange={handleInputChange}
                  placeholder="Enter your years of experience"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Previous Work <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="previousWork"
                  value={formData.previousWork}
                  onChange={handleInputChange}
                  placeholder="Enter your previous work"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  ID Document <span className="text-red-500"> *</span>
                </label>
                <input
                  type="file"
                  name="idTourGuideDocument"
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Certificate Document <span className="text-red-500"> *</span>
                </label>
                <input
                  type="file"
                  name="certificateTourGuideDocument"
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
            </>
          )}
          {role === "seller" && (
            <>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Description <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a description"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Seller Type <span className="text-red-500"> *</span>
                </label>
                <select
                  name="sellerType"
                  value={formData.sellerType}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                >
                  <option value="">Select seller type</option>
                  <option value="VTP">VTP</option>
                  <option value="External">External</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  ID Document <span className="text-red-500"> *</span>
                </label>
                <input
                  type="file"
                  name="idSellerDocument"
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Taxation Registry Card Document{" "}
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  type="file"
                  name="taxationRegistryCardSellerDocument"
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
            </>
          )}
          {role === "advertiser" && (
            <>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Website <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Enter your website"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Hotline <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="hotline"
                  value={formData.hotline}
                  onChange={handleInputChange}
                  placeholder="Enter your hotline"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Company Profile <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="companyProfile"
                  value={formData.companyProfile}
                  onChange={handleInputChange}
                  placeholder="Enter your company profile"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  ID Document <span className="text-red-500"> *</span>
                </label>
                <input
                  type="file"
                  name="idAdvertiserDocument"
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-semibold">
                  Taxation Registry Card Document{" "}
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  type="file"
                  name="taxationRegistryCardAdvertiserDocument"
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
            </>
          )}
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-custom text-white p-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
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
  );
};

export default Register;

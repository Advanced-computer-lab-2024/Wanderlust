import AddDeliveryAddress from "../../Components/AddDeliveryAddress";

import React from "react";
import { useNavigate } from "react-router-dom";

const PopupAddDeliveryAddress = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center overflow-auto">
      <div className="bg-white p-8 rounded shadow-2xl w-full max-w-md relative mt-10 mb-10">
        <button
          onClick={handleBack}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Back
        </button>

        <div className="overflow-y-auto max-h-[80vh]">
          <AddDeliveryAddress />
        </div>
      </div>
    </div>
  );
};

export default PopupAddDeliveryAddress;

import AddDeliveryAddress from "../../Components/AddDeliveryAddress";

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PopupAddDeliveryAddress = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center overflow-auto">
      <div className="bg-white p-8 rounded shadow-2xl w-full max-w-md relative mt-10 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="ml-2">Back</span>
        </button>
        <div className="overflow-y-auto max-h-[80vh]">
          <AddDeliveryAddress />
        </div>
      </div>
    </div>
  );
};

export default PopupAddDeliveryAddress;

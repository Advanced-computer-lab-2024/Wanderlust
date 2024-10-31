import  { useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import "./styles/FilterBudget.css";
function FilterBudget({x}) {
const [minValue, set_minValue] = useState(0);
const [maxValue, set_maxValue] = useState(10000);
const handleInput = (e) => {
	set_minValue(e.minValue);
	set_maxValue(e.maxValue);
};
// Budget,  Date , Language and Preferences

return (
    <div className="bg-white rounded-xl shadow-md relative">
        <div className="p-3">
            <div className="mb-2">
                {/* <h3 className="text-lg font-bold leading-tight">Filter Itineraries</h3> */}
	            <div className="Slider">
                    <div className="sliderleft">
		            <MultiRangeSlider className="slider"
                        min={0}
                        max={10000}
                        step={10}
                        minValue={minValue}
                        maxValue={maxValue}
                        ruler={false}
                        barInnerColor="#4338ca"
                        onInput={(e) => {
                            handleInput(e);
                        }}
                    />
                    </div>
                    <div className="slidertext">
                        <p className="minValue">Min Value:<span className="text-indigo-500 text-base font-semibold mb-1"> ${minValue}</span> </p>
                        <p className="maxValue">Max Value: <span className="text-indigo-500 text-base font-semibold mb-1">${maxValue}</span></p>
                    </div>
                </div>
            <div>
        </div>
    </div>
</div>
    <div className="Datediv">
        <p id="filtertext" className=" text-base font-semibold mb-1">Date:</p>
        <input type="date" className="border border-gray-300 p-2 w-50 rounded-lg" />
    </div>
    <div className="Datediv">
        <p id="filtertext" className=" text-base font-semibold mb-1" >Language:</p>
        <select  className="border border-gray-300 p-2 w-50 rounded-lg">
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
        </select>
    </div>
    <div className="Datediv">
        <p id="filtertext" className=" text-base font-semibold mb-1">Preferences:</p>
        <select  className="border border-gray-300 p-2 w-50 rounded-lg">
            <option value="Food">Food</option>
            <option value="History">History</option>
            <option value="Adventure">Adventure</option>
            <option value="Culture">Culture</option>
        </select>
    </div>
</div>
	);
}

export default FilterBudget;
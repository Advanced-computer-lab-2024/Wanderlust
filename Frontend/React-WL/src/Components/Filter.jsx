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

return (
    <div className="bg-white rounded-xl shadow-md relative">
    <div className="p-3">
      <div className="mb-2">
        <h3 className="text-lg font-bold leading-tight">Filter Itineraries</h3>
	    <div className="Slider">
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
            <p className="minValue">Min Value:<span className="text-indigo-500 text-base font-semibold mb-1"> ${minValue}</span> </p>
            <p className="maxValue">Max Value: <span className="text-indigo-500 text-base font-semibold mb-1">${maxValue}</span></p>
	    </div>
        <div>
    </div>
    </div>
    </div>
    </div>
	);
}

export default FilterBudget;
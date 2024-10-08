import React, { useState } from 'react';
import { grainOrFlourTypes } from '../../../../constants.mjs';
import { createRequest } from '../../services/requestService';
import { useSelector } from 'react-redux';

function CreateRequest() {
  const currentUser = useSelector((state) => state.auth.user);

  const [type, setType] = useState("DONATE");
  const [foodType, setFoodType] = useState("RAW");
  const [isRawFood, setIsRawFood] = useState(true);
  const [food, setFood] = useState([]);
  const [grainOrFlourType0, setGrainOrFlourType0] = useState(grainOrFlourTypes[0]);
  const [grainOrFlourType1, setGrainOrFlourType1] = useState(grainOrFlourTypes[22]);
  const [amountInKg0, setAmountInKg0] = useState();
  const [amountInKg1, setAmountInKg1] = useState();
  const [count0, setCount0] = useState();
  const [count1, setCount1] = useState();
  const [maxVal, setMaxVal] = useState(10);

  const foodTypes = ["RAW", "COOKED"];
  const types = ["DONATE", "RECEIVE"];

  if (!currentUser) {
    console.error("Please login,", "No current user found");
    return;
  }

  if (currentUser.userType !== "END_USER") {
    console.error("User not authorized");
    return;
  }

  const handleRequest = async (e) => {
    e.preventDefault();
    let newFood = [];
    if (foodType === "RAW") {
      if (grainOrFlourType0 === grainOrFlourType1) return;
      if (amountInKg0 != 0) {
        newFood.push({
          grainOrFlourType: grainOrFlourType0,
          amountInKg: amountInKg0,
        });
      }
      if (amountInKg1 != 0)
        newFood.push({
          grainOrFlourType: grainOrFlourType1,
          amountInKg: amountInKg1,
        });
    } else if (foodType === "COOKED") {
      if (count0 != 0) {
        newFood.push({
          ageGroup: "CHILD",
          count: count0,
        });
      }
      if (count1 != 0)
        newFood.push({
          ageGroup: "ADULT",
          count: count1,
        });
    }
    setFood(newFood);

    try {
      const requestData = await createRequest(type, foodType, food);
      if (requestData) {
        const request = requestData.data.request;
        console.log("Request successful: ", request);
      }
    } catch (error) {
      console.error("Failed to create request: ", error.message);
    }
  };

  const handleTypeOfRequestChange = (e) => {
    const currentType = e.target.value;
    setType(currentType);
    let newMaxVal = 10;
    if (currentType === "DONATE") newMaxVal = 1000;
    else if (currentType === "RECEIVE") newMaxVal = 10;
    setMaxVal(newMaxVal);
  };

  const handleFoodTypeChange = (e) => {
    const currentFoodType = e.target.value;
    setFoodType(currentFoodType);
    setIsRawFood((prevState) => !prevState);
    setFood([]);
  };

  return (
    <form onSubmit={handleRequest} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700">Request Type</label>
        <select
          value={type}
          onChange={handleTypeOfRequestChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Food Type</label>
        <select
          value={foodType}
          onChange={handleFoodTypeChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
        >
          {foodTypes.map((foodType) => (
            <option key={foodType} value={foodType}>
              {foodType}
            </option>
          ))}
        </select>
      </div>

      {isRawFood && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Grain/Flour Type 1</label>
            <select
              value={grainOrFlourType0}
              onChange={(e) => setGrainOrFlourType0(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              {grainOrFlourTypes.map((grainOrFlourType) => (
                <option key={grainOrFlourType} value={grainOrFlourType}>
                  {grainOrFlourType}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount in Kg"
              value={amountInKg0}
              onChange={(e) => setAmountInKg0(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-2 rounded-lg"
              min={0}
              max={maxVal}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Grain/Flour Type 2</label>
            <select
              value={grainOrFlourType1}
              onChange={(e) => setGrainOrFlourType1(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              {grainOrFlourTypes.map((grainOrFlourType) => (
                <option key={grainOrFlourType} value={grainOrFlourType}>
                  {grainOrFlourType}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount in Kg"
              value={amountInKg1}
              onChange={(e) => setAmountInKg1(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-2 rounded-lg"
              min={0}
              max={maxVal}
              required
            />
          </div>
        </>
      )}

      {!isRawFood && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Child Count</label>
            <input
              type="number"
              placeholder="No. of Individuals"
              value={count0}
              onChange={(e) => setCount0(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
              min={0}
              max={maxVal}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Adult Count</label>
            <input
              type="number"
              placeholder="No. of Individuals"
              value={count1}
              onChange={(e) => setCount1(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
              min={0}
              max={maxVal}
              required
            />
          </div>
        </>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Create Request
      </button>
    </form>
  );
}

export default CreateRequest;

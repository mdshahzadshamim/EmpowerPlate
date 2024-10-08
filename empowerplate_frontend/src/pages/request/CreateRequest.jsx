import React, { useState } from 'react'
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
      if (grainOrFlourType0 === grainOrFlourType1)
        return;
      if (amountInKg0 != 0) {
        newFood.push({
          grainOrFlourType: grainOrFlourType0,
          amountInKg: amountInKg0
        });
      }
      if (amountInKg1 != 0)
        newFood.push({
          grainOrFlourType: grainOrFlourType1,
          amountInKg: amountInKg1
        });
    } else if (foodType === "COOKED") {
      if (count0 != 0) {
        newFood.push({
          ageGroup: "CHILD",
          count: count0
        });
      }
      if (count1 != 0)
        newFood.push({
          ageGroup: "ADULT",
          count: count1
        });
    }
    setFood(newFood);
    // console.log(newFood);

    try {
      const requestData = await createRequest(type, foodType, food);
      if (requestData) {
        const request = requestData.data.request;
        console.log("Request successful: ", request);
      }
    } catch (error) {
      console.error("Failed to create request: ", error.message);
    }
  }

  const handleTypeOfRequestChange = (e) => {
    const currentType = e.target.value;
    setType(currentType);
    let newMaxVal = 10;
    if(currentType === "DONATE")
      newMaxVal = 1000;
    else if (currentType === "RECEIVE")
      newMaxVal = 10;

    setMaxVal(newMaxVal);
  }

  const handleFoodTypeChange = (e) => {
    const currentFoodType = e.target.value;
    setFoodType(currentFoodType);
    setIsRawFood((prevState) => !prevState);
    setFood([]);
  }
  return (
    <form
      onSubmit={handleRequest}
      className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16"
    >
      <select
        value={type}
        onChange={handleTypeOfRequestChange}
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={foodType}
        onChange={handleFoodTypeChange}
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {foodTypes.map((foodType) => (
          <option key={foodType} value={foodType}>
            {foodType}
          </option>
        ))}
      </select>

      {isRawFood && (
        <>
          <fieldset>
            <legend></legend>
            <select
              key={grainOrFlourType0}
              value={grainOrFlourType0}
              onChange={(e) => setGrainOrFlourType0(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              min={0}
              max={maxVal}
              required
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </fieldset>

          <fieldset>
            <legend></legend>
            <select
              key={grainOrFlourType1}
              value={grainOrFlourType1}
              onChange={(e) => setGrainOrFlourType1(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              min={0}
              max={maxVal}
              required
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </fieldset>
        </>
      )}

      {(!isRawFood) && (
        <>
          <fieldset>
            <legend></legend>
            <input
              type="text"
              value="CHILD"
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="number"
              placeholder="No. of Individuals"
              value={count0}
              onChange={(e) => setCount0(e.target.value)}
              min={0}
              max={maxVal}
              required
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </fieldset>

          <fieldset>
            <legend></legend>
            <input
              type="text"
              value="ADULT"
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="number"
              placeholder="No. of Individuals"
              value={count1}
              onChange={(e) => setCount1(e.target.value)}
              min={0}
              max={maxVal}
              required
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </fieldset>
        </>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
      >
        Create Request
      </button>


    </form>
  )
}

export default CreateRequest
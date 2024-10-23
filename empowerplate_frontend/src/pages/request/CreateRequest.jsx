import React, { useState } from 'react';
import { grainOrFlourTypes } from '../../../../constants.mjs';
import { createRequest } from '../../services/requestService';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllLinkedRequests } from '../../services/userService';
import { setRequests } from '../../features/requestSlice';

const CreateRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  // State variables
  const [type, setType] = useState("");
  const [foodType, setFoodType] = useState("");
  const [isRawFood, setIsRawFood] = useState(true);
  const [grainOrFlourType0, setGrainOrFlourType0] = useState(grainOrFlourTypes[0]);
  const [grainOrFlourType1, setGrainOrFlourType1] = useState(grainOrFlourTypes[22]);
  const [amountInKg0, setAmountInKg0] = useState(0);
  const [amountInKg1, setAmountInKg1] = useState(0);
  const [count0, setCount0] = useState(0);
  const [count1, setCount1] = useState(0);
  const [maxVal, setMaxVal] = useState(10);

  const foodTypes = ["RAW", "COOKED"];
  const types = ["DONATE", "RECEIVE"];

  // Fetch linked requests
  const fetchRequests = async () => {
    try {
      const response = await getAllLinkedRequests();
      if (response) {
        dispatch(setRequests(response));
        console.log("Requests updated in local");
      } else {
        console.log("Unable to fetch requests");
      }
    } catch (error) {
      console.error("Failed to load requests: ", error.message);
    }
  };

  // Check if current user is valid
  if (!currentUser) {
    console.error("Please login, No current user found");
    return null; // Return null if no user is found
  }

  if (currentUser.userType !== "END_USER") {
    console.error("User not authorized");
    return null; // Return null if user is not authorized
  }

  // Handle request submission
  const handleRequest = async (e) => {
    e.preventDefault();
    const newFood = createFoodArray();
    
    try {
      const requestData = await createRequest(type, foodType, newFood);
      if (requestData) {
        const request = requestData.data.request;
        console.log("Request successful: ", request);
        fetchRequests();
        navigate("/users/linked-requests");
      }
    } catch (error) {
      console.error("Failed to create request: ", error.message);
    }
  };

  // Create food array based on input
  const createFoodArray = () => {
    const newFood = [];
    if (foodType === "RAW") {
      if (grainOrFlourType0 === grainOrFlourType1) return newFood; // Prevent duplication
      if (amountInKg0 > 0) {
        newFood.push({
          grainOrFlourType: grainOrFlourType0,
          amountInKg: amountInKg0
        });
      }
      if (amountInKg1 > 0) {
        newFood.push({
          grainOrFlourType: grainOrFlourType1,
          amountInKg: amountInKg1
        });
      }
    } else if (foodType === "COOKED") {
      if (count0 > 0) {
        newFood.push({ ageGroup: "CHILD", count: count0 });
      }
      if (count1 > 0) {
        newFood.push({ ageGroup: "ADULT", count: count1 });
      }
    }
    return newFood;
  };

  // Handle type of request change
  const handleTypeOfRequestChange = (e) => {
    const currentType = e.target.value;
    setType(currentType);
    setMaxVal(currentType === "DONATE" ? 1000 : 10); // Set maxVal based on request type
  };

  // Handle food type change
  const handleFoodTypeChange = (e) => {
    const currentFoodType = e.target.value;
    setFoodType(currentFoodType);
    setIsRawFood(currentFoodType === "RAW"); // Determine if raw food
    resetFoodInputs(); // Reset counts and amounts
  };

  // Reset food input states
  const resetFoodInputs = () => {
    setAmountInKg0(0);
    setAmountInKg1(0);
    setCount0(0);
    setCount1(0);
  };

  // Render form fields for food type selection
  const renderFoodInputs = () => {
    if (isRawFood) {
      return (
        <>
          <FoodInput 
            grainOrFlourType={grainOrFlourType0}
            setGrainOrFlourType={setGrainOrFlourType0}
            amountInKg={amountInKg0}
            setAmountInKg={setAmountInKg0}
            maxVal={maxVal}
          />
          <FoodInput 
            grainOrFlourType={grainOrFlourType1}
            setGrainOrFlourType={setGrainOrFlourType1}
            amountInKg={amountInKg1}
            setAmountInKg={setAmountInKg1}
            maxVal={maxVal}
          />
        </>
      );
    }
    return (
      <>
        <PeopleCountInput 
          ageGroup="CHILD"
          count={count0}
          setCount={setCount0}
          maxVal={maxVal}
        />
        <PeopleCountInput 
          ageGroup="ADULT"
          count={count1}
          setCount={setCount1}
          maxVal={maxVal}
        />
      </>
    );
  };

  return (
    <form onSubmit={handleRequest} className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16">
      <SelectField 
        value={type}
        onChange={handleTypeOfRequestChange}
        options={types}
        label="Select Request Type"
        required
      />
      <SelectField 
        value={foodType}
        onChange={handleFoodTypeChange}
        options={foodTypes}
        label="Select Food Type"
        required
      />
      {renderFoodInputs()}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
      >
        Create Request
      </button>
    </form>
  );
};

// Reusable Select Field Component
const SelectField = ({ value, onChange, options, label, required }) => (
  <select
    value={value || ""}
    onChange={onChange}
    className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    required={required}
  >
    <option value="">{label}</option>
    {options.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
);

// Reusable Food Input Component for RAW Food
const FoodInput = ({ grainOrFlourType, setGrainOrFlourType, amountInKg, setAmountInKg, maxVal }) => (
  <fieldset>
    <select
      value={grainOrFlourType}
      onChange={(e) => setGrainOrFlourType(e.target.value)}
      className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {grainOrFlourTypes.map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
    </select>
    <input
      type="number"
      value={amountInKg === 0 ? "" : amountInKg}
      onChange={(e) => setAmountInKg(e.target.value === "" ? "" : Number(e.target.value))}
      min={0}
      max={maxVal}
      required
      placeholder="Amount in Kg"
      className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </fieldset>
);

// Reusable Component for Counting Individuals
const PeopleCountInput = ({ ageGroup, count, setCount, maxVal }) => (
  <fieldset>
    <input
      type="text"
      value={ageGroup}
      disabled
      className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      type="number"
      value={count === 0 ? "" : count}
      onChange={(e) => setCount(e.target.value === "" ? "" : Number(e.target.value))}
      min={0}
      max={maxVal}
      required
      placeholder="No. of Individuals"
      className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </fieldset>
);

export default CreateRequest;

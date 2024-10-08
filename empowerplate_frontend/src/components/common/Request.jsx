import React, { useRef } from 'react'

function Request({ request }) {
  const requestRef = useRef(null);
  const { _id, type, foodType, currentStatus, updatedAt, rawFood = [], cookedFood = [] } = request;
  return (
    <div ref={requestRef}>
      <div>Request Type: {type}</div>
      <div>Current Status: {currentStatus}</div>
      <div>Updated At: {updatedAt}</div>
      <div>Food Requested: {foodType}</div>
      {foodType === "RAW" && (
        <>
          {rawFood.map((element, index) => (
            <div key={`${element.grainOrFoodType}-${index}`}>
              <div>{element.grainOrFoodType}</div>
              <div>{element.amountInKg} kgs</div>
            </div>
          ))}

        </>
      )}

      {foodType === "COOKED" && (
        <>
          {cookedFood.map((element, index) => (
            <div key={`${element.ageGroup}-${index}`}>
              <div>{element.ageGroup}</div>
              <div>{element.count}</div>
            </div>
          ))}

        </>
      )}
    </div>
  )
}

export default Request

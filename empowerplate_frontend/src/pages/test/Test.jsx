import React, { useState } from "react";
import "./Test.css"; // Importing CSS file for styling

const RequestForm = () => {
  // Define state to hold form data
  const [formData, setFormData] = useState({
    admin: "",
    requester: "",
    type: "DONATE",
    foodType: "COOKED",
    cookedFood: [
      { ageGroup: "CHILD", count: 0 },
      { ageGroup: "ADULT", count: 0 }
    ],
    rawFood: { grainOrFlourType: "RICE", other: "", amountInKg: 0 }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldParts = name.split(".");

    if (fieldParts[0] === "cookedFood") {
      const index = parseInt(fieldParts[1].match(/\d+/)[0]);
      const key = fieldParts[2];

      setFormData((prevState) => {
        const updatedCookedFood = [...prevState.cookedFood];
        updatedCookedFood[index][key] =
          key === "count" ? parseInt(value, 10) : value;

        return {
          ...prevState,
          cookedFood: updatedCookedFood,
        };
      });
    } else if (name.startsWith("rawFood")) {
      setFormData({
        ...formData,
        rawFood: {
          ...formData.rawFood,
          [name.split(".")[1]]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Admin ID:</label>
        <input
          type="text"
          name="admin"
          value={formData.admin}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Requester ID:</label>
        <input
          type="text"
          name="requester"
          value={formData.requester}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Type:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-select"
        >
          <option value="DONATE">DONATE</option>
          <option value="RECEIVE">RECEIVE</option>
        </select>
      </div>
      <div className="form-group">
        <label>Food Type:</label>
        <select
          name="foodType"
          value={formData.foodType}
          onChange={handleChange}
          className="form-select"
        >
          <option value="COOKED">COOKED</option>
          <option value="RAW">RAW</option>
        </select>
      </div>

      {/* Render Cooked Food Section if selected */}
      {formData.foodType === "COOKED" && (
        <>
          <h3>Cooked Food</h3>
          {formData.cookedFood.map((item, index) => (
            <div key={index} className="cooked-food-section">
              <label>Age Group:</label>
              <select
                name={`cookedFood[${index}].ageGroup`}
                value={item.ageGroup}
                onChange={handleChange}
                className="form-select"
              >
                <option value="CHILD">CHILD</option>
                <option value="ADULT">ADULT</option>
              </select>

              <label>Count:</label>
              <input
                type="number"
                name={`cookedFood[${index}].count`}
                value={item.count}
                onChange={handleChange}
                min={1}
                max={5}
                className="form-input"
              />
            </div>
          ))}
        </>
      )}

      {/* Render Raw Food Section if selected */}
      {formData.foodType === "RAW" && (
        <div className="raw-food-section">
          <h3>Raw Food</h3>
          <label>Grain or Flour Type:</label>
          <select
            name="rawFood.grainOrFlourType"
            value={formData.rawFood.grainOrFlourType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="RICE">RICE</option>
            <option value="RICE_FLOUR">RICE_FLOUR</option>
            <option value="WHEAT">WHEAT</option>
            <option value="WHEAT_FLOUR">WHEAT_FLOUR</option>
            <option value="OTHER">OTHER</option>
          </select>

          {formData.rawFood.grainOrFlourType === "OTHER" && (
            <div>
              <label>Other (Specify):</label>
              <input
                type="text"
                name="rawFood.other"
                value={formData.rawFood.other}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          )}

          <label>Amount in Kg:</label>
          <input
            type="number"
            name="rawFood.amountInKg"
            value={formData.rawFood.amountInKg}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      )}

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default RequestForm;

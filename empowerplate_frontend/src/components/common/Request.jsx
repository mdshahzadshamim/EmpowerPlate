import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Request({ request }) {
  const requestRef = useRef(null);
  const navigate = useNavigate();
  const { _id, type, foodType, currentStatus, updatedAt, rawFood = [], cookedFood = [] } = request;

  const color = (status) => {
    const colorcode = {
      "REJECTED": "bg-red-100",
      "CANCELLED": "bg-orange-100",
      "PENDING": "bg-yellow-100",
      "ACCEPTED": "bg-green-100",
      "ONTHEWAY": "bg-blue-100",
      "HALFWAY": "bg-indigo-100",
      "FULFILLED": "bg-violet-100",
    };
    return colorcode[status];
  };

  function formatUpdatedDateToIST(isUpdated) {
    const utcDate = new Date(isUpdated);

    const weekday = utcDate.toLocaleString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });
    const month = utcDate.toLocaleString('en-IN', { month: 'long', timeZone: 'Asia/Kolkata' });
    const day = utcDate.toLocaleString('en-IN', { day: 'numeric', timeZone: 'Asia/Kolkata' });
    const time = utcDate.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Asia/Kolkata', hour12: false });

    return `${weekday}, ${month} ${day}, ${time} (IST)`;
  }

  const handleClick = () => {
    navigate(`/requests/details/${_id}`);
  }



  return (
    <div ref={requestRef} onClick={handleClick} className={`${color(currentStatus)} border p-5`}>
      <div className="grid grid-cols-5 gap-4">
        <div>
          <div>{type}</div>
        </div>

        <div>
          <div>{currentStatus}</div>
        </div>

        <div>
          <div>{formatUpdatedDateToIST(updatedAt)}</div>
        </div>

        <div>
          <div>{foodType}</div>
        </div>

        <div>
          <div>
            {foodType === "RAW" && (
              <>
                {rawFood.map((element, index) => (
                  <span key={`${element.grainOrFlourType}-${index}`} className="inline-block mr-4">
                    {element.grainOrFlourType}: {element.amountInKg} kgs
                  </span>
                ))}
              </>
            )}

            {foodType === "COOKED" && (
              <>
                {cookedFood.map((element, index) => (
                  <span key={`${element.ageGroup}-${index}`} className="inline-block mr-4">
                    {element.ageGroup}: {element.count}
                  </span>
                ))}
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Request;

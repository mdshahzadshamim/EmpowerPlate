import React, { useState, useEffect } from 'react';
import { updateRequest, updateRequestStatus, getRequest } from '../../services/requestService';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllLinkedRequests } from '../../services/userService';
import { setRequests } from '../../features/requestSlice';
import { useParams } from 'react-router-dom';



function EditRequest() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);

    const { _id: requestId } = useParams();
    const [request, setRequest] = useState({});

    const [type, setType] = useState("");
    const [foodType, setFoodType] = useState("");

    const [rawFood, setRawFood] = useState({});
    const [amountInKg0, setAmountInKg0] = useState(0);
    const [amountInKg1, setAmountInKg1] = useState(0);

    const [cookedFood, setCookedFood] = useState({});
    const [count0, setCount0] = useState(0);
    const [count1, setCount1] = useState(0);

    const [isEditable, setIsEditable] = useState(false);
    const [isStatusUpdatable, setIsStatusUpdatable] = useState(false);
    const [action, setAction] = useState("Edit");

    const maxVal = (foodType === "DONATE" ? 1000 : 10);

    const fetchRequest = async (requsestId) => {
        const requestData = await getRequest(requsestId);
        if (requestData) {
            const thisRequest = requestData.data.request;

            setRequest(thisRequest);
            console.log(thisRequest);

            setType(thisRequest.type);
            setFoodType(thisRequest.foodType);

            if (thisRequest.foodType === "RAW") {
                setRawFood(thisRequest.rawFood);
                setAmountInKg0(thisRequest.rawFood[0].amountInKg);
                setAmountInKg1(thisRequest.rawFood[1].amountInKg);
            }

            if (thisRequest.foodType === "COOKED") {
                setCookedFood(thisRequest.cookedFood);
                setCount0(thisRequest.cookedFood[0].count);
                setCount1(thisRequest.cookedFood[1].count);
            }
        }
    }

    useEffect(() => {
        fetchRequest(requestId);
    }, [requestId]);

    const fetchRequests = async () => {
        try {
            const response = await getAllLinkedRequests();

            if (response) {
                dispatch(setRequests(response));
                console.log("Requests updated in local");
                // console.log("Requests updated in local", response);
            } else {
                console.log("Unable to fetch requests");
            }
        } catch (error) {
            console.error("Failed to load requests ", error.message);
        }
    }

    if (!currentUser) {
        console.error("Please login,", "No current user found");
        return;
    }

    // if (currentUser.userType !== "END_USER") {
    //     console.error("User not authorized");
    //     return;
    // }

    const toggleEdit = (e) => {
        e.preventDefault();
        setIsEditable((prev) => !prev);
        setAction((prev) => (prev === "Edit" ? "Update" : "Edit"))
    }

    const handleRequest = async (e) => {
        e.preventDefault();
        let newFood = [];
        if (foodType === "RAW") {
            if (amountInKg0 != 0) {
                newFood.push({
                    grainOrFlourType: rawFood[0].grainOrFlourType,
                    amountInKg: amountInKg0
                });
            }
            if (amountInKg1 != 0)
                newFood.push({
                    grainOrFlourType: rawFood[1].grainOrFlourType,
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
        // console.log("newFood", newFood);

        try {
            const requestData = await createRequest(requestId, foodType, newFood);
            // console.log("newFood", newFood);
            if (requestData) {
                const request = requestData.data.request;
                console.log("Request update successful: ", request);
                fetchRequests();
                navigate("/users/linked-requests");
            }
        } catch (error) {
            console.error("Failed to create request: ", error.message);
        }
    }


    return (
        <div
            // onSubmit={handleRequest}
            className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16"
        >
            <div className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Request Type: {type}
            </div>

            <div className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Food Type: {foodType}
            </div>

            {(foodType === "RAW") && (
                <>
                    <fieldset>
                        <legend></legend>
                        <div className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
                            Grain/Flour Type: {rawFood[0]?.grainOrFlourType}
                        </div>

                        <input
                            type="number"
                            value={amountInKg0 === 0 ? "" : amountInKg0}
                            onChange={(e) => {
                                const value = e.target.value === "" ? "" : Number(e.target.value);
                                setAmountInKg0(value);
                            }}
                            min={0}
                            max={maxVal}
                            required
                            placeholder="Amount in Kg"
                            className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={!isEditable}
                        />
                    </fieldset>

                    <fieldset>
                        <legend></legend>
                        <div className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
                            Grain/Flour Type: {rawFood[1]?.grainOrFlourType}
                        </div>
                        <input
                            type="number"
                            value={amountInKg1 === 0 ? "" : amountInKg1}
                            onChange={(e) => {
                                const value = e.target.value === "" ? "" : Number(e.target.value);
                                setAmountInKg1(value);
                            }}
                            min={0}
                            max={maxVal}
                            required
                            placeholder="Amount in Kg"
                            className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={!isEditable}
                        />
                    </fieldset>
                </>
            )}

            {(foodType === "COOKED") && (
                <>
                    <div>
                        <label className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
                            CHILD Count:
                        </label>

                        <input
                            type="number"
                            value={count0 === 0 ? "" : count0}
                            onChange={(e) => {
                                const value = e.target.value === "" ? "" : Number(e.target.value);
                                setCount0(value);
                            }}
                            min={0}
                            max={maxVal}
                            required
                            placeholder="No. of Individuals"
                            className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={!isEditable}
                        />
                    </div>

                    <div>
                        <label className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
                            ADULT Count:
                        </label>

                        <input
                            type="number"
                            value={count1 === 0 ? "" : count1}
                            onChange={(e) => {
                                const value = e.target.value === "" ? "" : Number(e.target.value);
                                setCount1(value);
                            }}
                            min={0}
                            max={maxVal}
                            required
                            placeholder="No. of Individuals"
                            className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            disabled={!isEditable}
                        />
                    </div>
                </>
            )}

            {(currentUser.userType === "ADMIN" && request.currentStatus === "PENDING") && (
                <button
                    type="submit"
                    onClick={toggleEdit}
                    className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                >
                    <span>{action}</span>
                </button>
            )}
        </div>
    )
}

export default EditRequest

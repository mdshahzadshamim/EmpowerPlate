import React, { useState, useEffect } from 'react';
import { updateRequest, updateRequestStatus, getRequest } from '../../services/requestService';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllLinkedRequests } from '../../services/userService';
import { setRequests } from '../../features/requestSlice';
import { useParams } from 'react-router-dom';

const FieldWrapper = ({ label, children }) => (
    <div className="flex items-center justify-between w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <label className="font-semibold">{label}</label>
        <div>{children}</div>
    </div>
);


const InputField = ({ value, onChange, disabled, placeholder, max, min = 0 }) => (
    <input
        type="number"
        value={value === 0 ? "" : value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={disabled}
        required
    />
);

function EditRequest() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);
    const { _id: requestId } = useParams();

    const [request, setRequest] = useState({});

    const [currentStatus, setCurrentStatus] = useState("");
    const [type, setType] = useState("");
    const [foodType, setFoodType] = useState("");

    const [rawFood, setRawFood] = useState({});
    const [amountInKg0, setAmountInKg0] = useState(0);
    const [amountInKg1, setAmountInKg1] = useState(0);

    const [cookedFood, setCookedFood] = useState({});
    const [count0, setCount0] = useState(0);
    const [count1, setCount1] = useState(0);

    const [isEditable, setIsEditable] = useState(false);
    const [isUpdatable, setIsUpdatable] = useState(false);
    const [sendOption, setSendOption] = useState(0);
    const [availableStatusOptions, setAvailableStatusOptions] = useState([currentStatus]);

    const [reason, setReason] = useState("");

    const maxVal = foodType === "DONATE" ? 1000 : 10;

    const handleStatusOptions = (userType, type, foodType, currentStatus) => {
        // console.log(userType, type, foodType, currentStatus);
        const statusOptions = [];
        statusOptions.push(currentStatus);
        if (userType === "ADMIN" && currentStatus === "PENDING") {
            statusOptions.push("ACCEPTED", "REJECTED");
        }
        if ((userType === "ADMIN" || userType === "VOLUNTEER") && (currentStatus === "ACCEPTED" || currentStatus === "HALFWAY")) {
            if (type === "DONATE") {
                if (currentStatus === "ACCEPTED") {
                    statusOptions.push("ONTHEWAY");
                } else if (currentStatus === "HALFWAY") {
                    statusOptions.push("FULFILLED");
                }
            } else if (type === "RECEIVE") {
                if (currentStatus === "ACCEPTED") {
                    statusOptions.push("ONTHEWAY");
                }
            }
        }
        if (userType !== "VOLUNTEER" && (currentStatus === "ACCEPTED" || currentStatus === "ONTHEWAY")) {
            statusOptions.push("CANCELLED");
        }
        if (userType === "END_USER") {
            if (type === "DONATE" && currentStatus === "ONTHEWAY") {
                statusOptions.push("HALFWAY")
            } else if (type === "RECEIVE" && currentStatus === "ONTHEWAY") {
                statusOptions.push("FULFILLED");
            }
        }
        setAvailableStatusOptions(statusOptions);
    }

    // Fetch Request Data
    const fetchRequest = async (requsestId) => {
        const requestData = await getRequest(requsestId);
        if (requestData) {
            const thisRequest = requestData.data.request;
            setRequest(thisRequest);
            setType(thisRequest.type);
            setFoodType(thisRequest.foodType);
            setCurrentStatus(thisRequest.currentStatus);
            setAvailableStatusOptions([`${thisRequest.currentStatus}`]);
            handleStatusOptions(currentUser.userType, thisRequest.type, thisRequest.foodType, thisRequest.currentStatus);

            if (thisRequest.foodType === "RAW") {
                setRawFood(thisRequest.rawFood);
                setAmountInKg0(thisRequest.rawFood[0]?.amountInKg || 0);
                setAmountInKg1(thisRequest.rawFood[1]?.amountInKg || 0);
            } else if (thisRequest.foodType === "COOKED") {
                setCookedFood(thisRequest.cookedFood);
                setCount0(thisRequest.cookedFood[0]?.count || 0);
                setCount1(thisRequest.cookedFood[1]?.count || 0);
            }
        }
    };

    useEffect(() => {
        fetchRequest(requestId);
    }, [requestId, currentUser]);

    // Fetch Linked Requests
    const fetchRequests = async () => {
        try {
            const response = await getAllLinkedRequests();
            if (response) {
                dispatch(setRequests(response));
            } else {
                console.log("Unable to fetch requests");
            }
        } catch (error) {
            console.error("Failed to load requests: ", error.message);
        }
    };

    const toggleEdit = () => {
        console.log("Toggled Edit");
        setIsEditable((prev) => !prev);
    };

    const toggleUpdate = () => {
        console.log("Toggled Update");
        setIsUpdatable((prev) => !prev);
    };

    const handleRequest = async (e) => {
        e.preventDefault();
        let newFood = [];

        if (foodType === "RAW") {
            if (amountInKg0) newFood.push({ grainOrFlourType: rawFood[0]?.grainOrFlourType, amountInKg: amountInKg0 });
            if (amountInKg1) newFood.push({ grainOrFlourType: rawFood[1]?.grainOrFlourType, amountInKg: amountInKg1 });
        } else if (foodType === "COOKED") {
            if (count0) newFood.push({ ageGroup: "CHILD", count: count0 });
            if (count1) newFood.push({ ageGroup: "ADULT", count: count1 });
        }

        try {
            const requestData = await updateRequest(requestId, foodType, newFood);
            if (requestData) {
                toggleEdit();
                console.log("Request update successful: ", requestData.data.request);
                await fetchRequests();
            }
        } catch (error) {
            console.error("Failed to update request: ", error.message);
        }
    };

    const handleRequestStatusUpdate = async (e) => {
        e.preventDefault();
        console.log("Option: ", sendOption);
        console.log("Current Status: ", currentStatus);


        toggleUpdate();
    }

    // const handleSelectedOption = (e) => {
    //     e.preventDefault();
    //     const status = e.target.value;

    //     if ((currentUser.userType === "ADMIN" && currentStatus === "PENDING")
    //         && (status === "ACCEPTED" || status === "REJECTED")) {
    //         setSendOption(0);
    //         console.log(0)
    //     } else if (((currentUser.userType === "ADMIN" || currentUser.userType === "VOLUNTEER") && (currentStatus === "ACCEPTED" || currentStatus === "HALFWAY"))
    //         && ((type === "DONATE" && ((currentStatus === "ACCEPTED" && status === "ONTHEWAY") || (currentStatus === "HALFWAY" && status === "FULFILLED")))
    //             || (type === "RECEIVE" && (currentStatus === "ACCEPTED" && status === "ONTHEWAY")))) {
    //         setSendOption(1);
    //         console.log(1)
    //     } else if ((currentUser.userType !== "VOLUNTEER" && (currentStatus === "ACCEPTED" || currentStatus === "ONTHEWAY")) && (status === "CANCELLED")) {
    //         setSendOption(2);
    //         console.log(2)
    //     } else if ((currentUser.userType === "END_USER")
    //         && (((type === "DONATE" && currentStatus === "ONTHEWAY") && (status === "HALFWAY")) || ((type === "RECEIVE" && currentStatus === "ONTHEWAY") && (status === "FULFILLED")))) {
    //         setSendOption(3);
    //         console.log(3)
    //     }

    //     console.log("Selected Status: ", status);

    //     setCurrentStatus(status);
    // }


    const handleSelectedOption = (e) => {
        e.preventDefault();
        const selectedStatus = e.target.value;

        // Matching conditions from handleStatusOptions
        if (currentUser.userType === "ADMIN" && currentStatus === "PENDING"
            && (selectedStatus === "ACCEPTED" || selectedStatus === "REJECTED")) {
            setSendOption(0);
            console.log(0);

        } else if ((currentUser.userType === "ADMIN" || currentUser.userType === "VOLUNTEER")
            && (currentStatus === "ACCEPTED" || currentStatus === "HALFWAY")) {

            if (type === "DONATE" && (
                (currentStatus === "ACCEPTED" && selectedStatus === "ONTHEWAY") ||
                (currentStatus === "HALFWAY" && selectedStatus === "FULFILLED"))) {
                setSendOption(1);
                console.log(1);
            } else if (type === "RECEIVE" && currentStatus === "ACCEPTED" && selectedStatus === "ONTHEWAY") {
                setSendOption(1);
                console.log(1);
            }

        } else if (currentUser.userType !== "VOLUNTEER"
            && (currentStatus === "ACCEPTED" || currentStatus === "ONTHEWAY")
            && selectedStatus === "CANCELLED") {
            setSendOption(2);
            console.log(2);

        } else if (currentUser.userType === "END_USER") {
            if (type === "DONATE" && currentStatus === "ONTHEWAY" && selectedStatus === "HALFWAY") {
                setSendOption(3);
                console.log(3);
            } else if (type === "RECEIVE" && currentStatus === "ONTHEWAY" && selectedStatus === "FULFILLED") {
                setSendOption(3);
                console.log(3);
            }
        }

        console.log("Selected Status: ", selectedStatus);

        // Update the current status to the newly selected value
        setCurrentStatus(selectedStatus);
    };


    return (
        <div>
            <div className="flex flex-col space-y-4 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16">
                <FieldWrapper label="Request Type">
                    {type}
                </FieldWrapper>

                <FieldWrapper label="Food Type">
                    {foodType}
                </FieldWrapper>

                {foodType === "RAW" && (
                    <>
                        <FieldWrapper label={(rawFood[0]?.grainOrFlourType || "N/A") + " (Kgs)"}>
                            <InputField
                                value={amountInKg0}
                                onChange={setAmountInKg0}
                                disabled={!isEditable}
                                placeholder="Amount in Kg"
                                max={maxVal}
                            />
                        </FieldWrapper>

                        {(rawFood[1]) && (<FieldWrapper label={(rawFood[1]?.grainOrFlourType || "N/A") + " (Kgs)"}>
                            <InputField
                                value={amountInKg1}
                                onChange={setAmountInKg1}
                                disabled={!isEditable}
                                placeholder="Amount in Kg"
                                max={maxVal}
                            />
                        </FieldWrapper>)}
                    </>
                )}

                {foodType === "COOKED" && (
                    <>
                        <FieldWrapper label="CHILD Count">
                            <InputField
                                value={count0}
                                onChange={setCount0}
                                disabled={!isEditable}
                                placeholder="No. of Individuals"
                                max={maxVal}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="ADULT Count">
                            <InputField
                                value={count1}
                                onChange={setCount1}
                                disabled={!isEditable}
                                placeholder="No. of Individuals"
                                max={maxVal}
                            />
                        </FieldWrapper>
                    </>
                )}

                <FieldWrapper label="Current Status">
                    <select
                        key={currentStatus}
                        value={currentStatus}
                        onChange={handleSelectedOption}
                        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled={!isUpdatable}
                    >
                        {availableStatusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </FieldWrapper>

                {(currentStatus === "CANCELLED") && (<FieldWrapper label="Reason: ">
                    <input
                        type="text"
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="I cancelled because.."
                        className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {reason}
                </FieldWrapper>)}

                {(isEditable) && (
                    <button
                        type="submit"
                        onClick={handleRequest}
                        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                    >
                        Update Request
                    </button>
                )}
                {(isUpdatable) && (
                    <button
                        type="submit"
                        onClick={handleRequestStatusUpdate}
                        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                    >
                        Update Status
                    </button>
                )}
                {/* {(currentUser.userType === "ADMIN" && request.currentStatus === "PENDING" && !isEditable && !isUpdatable) && ( */}
                {(!isEditable && !isUpdatable) && (
                    <div className="flex space-x-4">
                        {(currentStatus === "PENDING" && currentUser.userType === "ADMIN") && (<button
                            type="button"
                            onClick={toggleEdit}
                            className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                        >
                            Edit Request
                        </button>)}
                        <button
                            type="button"
                            onClick={toggleUpdate}
                            className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                        >
                            Change Status
                        </button>
                    </div>

                )}
            </div>
        </div>
    );
}

export default EditRequest;

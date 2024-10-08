import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLinkedRequests } from '../../services/userService'
import { setRequests as sendRequests } from "../../features/requestSlice"
import Request from '../../components/common/Request'

function LinkedRequests() {
    const currentUser = useSelector((state) => state.auth.user);

    const [requests, setRequests] = useState([]);
    const dispatch = useDispatch();

    const requestsFromState = useSelector((state) => state.request.requests);

    useEffect(() => {
        if (requestsFromState) {
            setRequests(requestsFromState);
        } else if(!requestsFromState) {
            setRequests([]);
        }
        if(!currentUser) {
            setRequests([]);
        }
    }, [currentUser, requestsFromState, setRequests])

    if (!currentUser) {
        console.error("Please login,", "No current user found");
        return;
    }

    const fetchRequests = async () => {
        try {
            const response = await getAllLinkedRequests();

            if (response) {
                // console.log("Response: ", response);
                setRequests(response);
                dispatch(sendRequests(response));
            }
        } catch (error) {
            console.error("Failed to load requests ", error.message);
        }
    }

    return (
        <div>
            <button onClick={fetchRequests}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
            >
                Linked Requests
            </button>

            {requests && (
                <>
                    {requests.map((request) => <Request key={request._id} request={request} />)}
                </>
            )}
        </div>
    )
}

export default LinkedRequests

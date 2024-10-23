import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLinkedRequests } from '../../services/userService'
import { setRequests as sendRequests } from "../../features/requestSlice"
import Request from '../../components/common/Request'
import RequestPropHeadings from "../../components/common/RequestPropHeadings"


function LinkedRequests() {
    const currentUser = useSelector((state) => state.auth.user);

    const [requests, setRequests] = useState([]);
    const dispatch = useDispatch();

    const requestsFromState = useSelector((state) => state.request.requests);

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

    useEffect(() => {
        if (!currentUser) {
            setRequests([]);
        } else if (currentUser) {
            fetchRequests();
            // if (!requestsFromState || requestsFromState.length === 0) {
            //     fetchRequests();
            // } else if (requestsFromState) {
            //     setRequests(requestsFromState);
            // }
        }
    }, [currentUser, setRequests]);


    return (
        <div>
            <RequestPropHeadings />
            {requests && (
                <>
                    {requests.map((request) => <Request key={request._id} request={request} />)}
                </>
            )}
        </div>
    )
}

export default LinkedRequests;

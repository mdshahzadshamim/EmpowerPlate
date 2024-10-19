import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getPendingRequestsByAdmin } from '../../services/userService'
import Request from '../../components/common/Request'
import RequestPropHeadings from "../../components/common/RequestPropHeadings"



function LinkedRequests() {
  const currentUser = useSelector((state) => state.auth.user);

  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await getPendingRequestsByAdmin();

      if (response) {
        setRequests(response);
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
    }
  }, [currentUser, setRequests]);

  if (!currentUser) {
    console.error("Please login,", "No current user found");
    return;
  }


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

export default LinkedRequests

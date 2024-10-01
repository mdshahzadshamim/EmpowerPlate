# EmpowerPlate
> A food-security platform designed to provide food to people in need with the support of society, including volunteers and donors. This is a non-commercial initiative with unique variables such as food banks, community gardens, farmers, volunteers, and donors. Effective communication is a crucial aspect of this project, aimed at bringing all efforts together under one platform.

## Tech Stack
- Backend: Node.js
- Routing: Express.js
- Databases
   - MongoDB, with mongoose, for user & request management
   - PostgreSQL, with pg, for dedicated food-bank management
- Frontend: React.js, _under development_
- State Management: Redux, _for React environment_
- Authentication: JWT for Authentication
- Password hashing: Bcrypt

## Features
- Create & Modify User
   - registerUser
   - logInUser
   - logOutUser
   - getCurrentUser
   - refreshAccessToken
   - updateUserDetails
   - updateUserPassword
   - getAllLinkedRequests
   - getPendingRequestsByAdmin
   - sendCode - _Vefification Code_
   - verifyEmail - _VerifyOTP_
- Create & Modify Request
   - createRequest
   - updateRequest - _Modify, Admin_
   - getRequest
- Modify Request Status
   - respondToRequest - _Admin_
   - updateRequestStatus - _Admin, Volunteer_
   - cancelRequest - _Admin, End User_
   - confirmFulfillmentByUser - _End User_

&nbsp;

[LinkedIn] Profile

   [LinkedIn]: <https://www.linkedin.com/in/md-shahzad-shamim/>
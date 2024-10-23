# EmpowerPlate
> A food-security platform designed to provide food to people in need with the support of society, including volunteers and donors. This is a non-commercial initiative with unique variables such as food banks, community gardens, farmers, volunteers, and donors. Effective communication is a crucial aspect of this project, aimed at bringing all efforts together under one platform.

## Tech Stack
- Backend: Node.js
- Routing: Express.js
- Databases
   - MongoDB, with mongoose, for user & request management
   - PostgreSQL, with pg, for dedicated food-bank management
- Frontend: React.js
- State Management: Redux, _for React environment_
- Authentication: JWT for Authentication
- Password hashing: Bcrypt

## Backend Features
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

## Frontend Features
- User
   - Create
   - Upadate
   - Verigy Email
   - Log In
   - Log Out
   - Auto Refresh Access Token
   - Linked Requests
   - Pending Requests
- Request
   - Create
   - Conditional Update by Admin
   - Conditional Update Status by respective Users

&nbsp;

[LinkedIn] Profile

   [LinkedIn]: <https://www.linkedin.com/in/md-shahzad-shamim/>
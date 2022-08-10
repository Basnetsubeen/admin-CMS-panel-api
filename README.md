# Api server for the ecommerce admin cms

Here is the repo for the frontend app ...

## APIs

All the api end points will follow the following patterns `{rootUrl}/api/v1`

### Admin user api

This api end point is responsible for handeling all the admin user related request.

All the Admin end points will follow the following patterns `{rootUrl}/api/v1/adimin-user`

| #   | PATH            | METHOD | PRIVATE | DESCRIPTION                                                                                                                                                                                  |
| --- | --------------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.  | `/`             | POST   | NO      | Receives new admin data and create new adim in our database. If admin user's email already exist, it will return error otherwise it will return success with the user info form the database |
| 2.  | `/verify-email` | PATCH  | NO      | Receives `{email, verificattion}` to verify the newly created user action, return success or error accordingly                                                                               |
| 3.  | `/login`        | POST   | NO      | Receives `{email, password}` and checks if the user exist for that combination in our datbase, if it does , it will handle all the login process                                             |

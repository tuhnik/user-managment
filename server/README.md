# API DOCUMENTATION

## GET /api
Api documentation.

## POST /api/register
Registers a new user.
```
body: {
    email: string,
    password: string
}
```

## POST /api/login
Logs user in manually. Successful login returns a token which
must be used for all subsequent requests.
```
body: {
    email: string,
    password: string
}
```   

## POST /api/validate
For token validation/automatic login.
```
headers: {
    'x-access-token': bearerToken
}
body: {
    email: string
}
```

## GET /api/users
Returns user list. If no query string parameters are specified, returns all users.
```
headers: {
    'x-access-token': bearerToken
}  
queryString: {
    from: number,
    to: number (not included)
} 
```
Example 1: `/api/users?from=5&to=10` returns users 5-9.  
Example 2: `/api/users?from=0&to=1` returns only first user.

## DELETE /api/delete/:id
Deletes a user by id.  
```
headers: {
    'x-access-token': bearerToken
}
```

Example: `/api/delete/fA1je83` deletes user with an id of fA1je83.



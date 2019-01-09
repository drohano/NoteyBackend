# Notey API

## Startup

**Base** **API** **link:** https://api-notey.herokuapp.com/

| Function       | URL           |
| ------------- |:-------------:| 
| Register a user     | /api/1.0/user/register |


## Function explanation

**Register** **a** **user** 

This registers a user and hashes the password in the database. With ajax you can call this function with the
approporiate url. 

You'll need three values: 
* **userName** 
* **email**
* **password** 

**Example:**

userName: $('#userName').val(),

email: $('#userEmail').val(),

password: $('#userPassword').val()

There are two errors that can occur:

* **409**, which means that there is a duplicate user name
* **400**, which means that one or more fields are mepty

All error messages come in a **JSON-Object** meaning there is different parts to the message:

| Type       | Datatype           |
| ------------- |:-------------:| 
| success     | bool | can be true or false |
| messageCode     | int | error code of the error |
| errorMessage     | String | What you can use to put as a GUI error |

**Example:**

{
    success: false,
    errorCode: 400,
    errorMessage: "You have to fill all fields!"
}

result.errorMessage will become **You have to fill all fields**
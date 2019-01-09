# Notey API

## Startup

**Base** **API** **link:** https://api-notey.herokuapp.com/

| Function       | URL           |
| ------------- |:-------------:| 
| Register a user     | /api/1.0/user/register |
| login     | /api/1.0/user/login |


## Function explanation

### Register a user 

This registers a user and hashes the password in the database. With ajax you can call this function with the
approporiate url. 

You'll need three values: 
* **userName** 
* **email**
* **password** 

**Example:**
```
userName: $('#userName').val(),

email: $('#userEmail').val(),

password: $('#userPassword').val()

```

### Log in
This function checks if the username and password combination exists in the database. 
If it does it creates a token for you which you can then use to authenticate the user every time an action happends on the webbapp.

You'll need two values: 
* **userName** 
* **password**

**Example:**

```
function login(){
    $("form").submit(function(e){
        e.preventDefault();
    });
    var userName = $('#userName').val();
    var password = $('#password').val();
    userData = {
        userName: userName,
        password: password

    };
    $.ajax({
        method: 'POST',
        url: 'api/1.0/user/login',
        contentType: "application/json",
        data: JSON.stringify(userData),
        success: function(result){
            var token = result;
            else{
                goToHome(token);
            }
        },
        error: function(error) { 
            alert(error.erromessage); 
        }
    });
}

```

## Error messages

| name       | Meaning           | Output           |
| ------------- |:-------------:| ------------- | 
| 400     | One or more fields of the registration field aren't filled | You have to fill all fields! |
| 409     | This user name already is taken by another account in the database | User name already exists! |
| 403     | No users match the password and username combination | Username or password is not correct! |

All error messages come in a **JSON-Object** meaning there is different parts to the message:

| Type       | Datatype           | Meaning           |
| ------------- |:-------------:| ------------- | 
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
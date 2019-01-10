# Notey API

## Startup

**Base** **API** **link:** https://api-notey.herokuapp.com/

| Function       | URL           | Type       |
| ------------- |:-------------:| ------------- | 
| Register a user     | /api/1.0/user/register | POST |
| login     | /api/1.0/user/login | POST |
| Get logged in user information     | /api/1.0/user/decode | POST |
| Create a note     | /api/1.0/notes/create | POST |
| Get all notes related to the user     | /api/1.0/notes/ | POST |
| Get specific note     | /api/1.0/notes/{id} | GET |


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
function insertIntoDB(){
    userData = {
        userName: $('#userName').val(),
        email: $('#email').val(),
        password: $('#password').val()

    };
    $.ajax({
        method: 'POST',
        url: 'https://api-notey.herokuapp.com/api/1.0/user/register',
        contentType: "application/json",
        data: JSON.stringify(userData),
        success: function(result){
            //do something ...
        },
        error: function(error){
            alert(error.errorMessage);
        }

    });
}

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
        url: 'https://api-notey.herokuapp.com/api/1.0/user/login',
        contentType: "application/json",
        data: JSON.stringify(userData),
        success: function(result){
            var token = result;
            goToHome(token);
        },
        error: function(error) { 
            alert(error.errorMessage); 
        }
    });
}

```

**What you'll recieve:**
* **token**

### Create a note

This function creates a note and saves it in the database.

You'll need four values:

* **heading** 
* **content**
* **date**
* **id**

The date is meant to be the date of today and the userName is the users user name


**Example:**

```
function createNote(){
    $("form").submit(function(e){
        e.preventDefault();
    });
    var heading = $('#heading').val();
    var content = $('#content').val();
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();
    var userName = userName; //use the decode function to get users username

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    date = mm + '/' + dd + '/' + yyyy;
    noteData = {
        heading: heading,
        content: content,
        date: date,
        id: id

    };
    $.ajax({
        method: 'POST',
        url: 'https://api-notey.herokuapp.com/api/1.0/notes/create',
        contentType: "application/json",
        data: JSON.stringify(noteData),
        success: function(result){
            // do something...
        },
        error: function(error) { 
            alert(error.errorMessage); 
        }
    });
}

```


### Get logged in user information
This function will take the token in the header and extract user name, email and id of the user currently logged in. It's effective in the use of profile page building

This requires no data to be sent but don't forget to put in the token inside the header

```
function getDetails(){
    $.ajax({
        method: 'GET',
        headers: {
            'Authorization': token, //this is a global variable, make sure to save this during login call
        },
        url: 'https://api-notey.herokuapp.com/api/1.0/user/decode',
        success: function(result){
            // do something with the info...
            result.userName;
            result.email;
            result.id;
        },
        error: function(error){
            alert(error.errorMessage);
        }

    });
}

```

**What you'll recieve in JSON:**
* **userName**
* **_id**
* **email**

### Get all notes related to the user

Gets all notes that the user has created.

You'll need one variable:
* **id**

**id** is the user id of the user that is currently logged in

**Example:**

```
function generateAllNotes(){
    var userName = userName; //use the decode function to get users username
    listData = {
        userName: userName

    };
    $.ajax({
        method: 'POST',
        url: 'https://api-notey.herokuapp.com/api/1.0/notes/',
        contentType: "application/json",
        data: JSON.stringify(listData),
        success: function(result){
            // do something...
        },
        error: function(error) { 
            alert(error.errorMessage); 
        }
    });
}

```

**What you'll recieve in JSON:**
* **heading**
* **date**
* **_id**

### Get specific note

Gets a note and shows it's content.

You'll need to send the variable **id** in the url. **Id** variable is the id of the note which you can recieve by getting all **notes**.

**Example:**

```
function generateNote(){
    $.ajax({
        method: 'GET',
        url: 'https://api-notey.herokuapp.com/api/1.0/notes/3123251431',
        contentType: "application/json",
        success: function(result){
            // do something...
        },
        error: function(error) { 
            alert(error.errorMessage); 
        }
    });
}

```
**What you'll recieve in JSON:**
* **heading**
* **content**
* **date**
* **_id**

## Error messages

| name       | Meaning           |
| ------------- |:-------------:| 
| 400     | One or more fields of the registration field aren't filled |
| 409     | This is an exclusive variable and is already exisiting in the database |
| 403     | A key variable isn't provided |

All error messages come in a **JSON-Object** meaning there is different parts to the message:

| Type       | Datatype           | Meaning           |
| ------------- |:-------------:| ------------- | 
| success     | bool | can be true or false |
| messageCode     | int | error code of the error |
| errorMessage     | String | What you can use to put as a GUI error |

**Example:**

```
{
    success: false,
    errorCode: 400,
    errorMessage: "You have to fill all fields!"
}
```
result.errorMessage will become **You have to fill all fields**


## Team W.E.I

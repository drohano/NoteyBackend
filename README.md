# Notey API

## Startup

**Base** **API** **link:** https://api-notey.herokuapp.com/

| Function       | URL           | Type       |
| ------------- |:-------------:| ------------- | 
| Register a user     | /api/1.0/user/register | POST |
| login     | /api/1.0/user/login | POST |
| Get logged in user information     | /api/1.0/user/decode | POST |
| Create a note     | /api/1.0/notes/create | POST |
| Get all notes related to the user     | /api/1.0/notes/ | GET |
| Get specific note     | /api/1.0/notes/{id} | GET |
| Update note     | /api/1.0/notes/update/{id} | PATCH |
| Delete note     | /api/1.0/notes/delete/{id} | DELETE |


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
            var err = JSON.parse(error.responseText);
            alert(err.errorMessage);
        }

    });
}

```

**Note:**

No use of special characters are allowed on user name or domain name. The API will reject this and send an error message

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
        error: function(error){
            var err = JSON.parse(error.responseText);
            alert(err.errorMessage);
        }
    });
}

```

**What you'll recieve:**
* **token**

### Create a note

This function creates a note and saves it in the database.

You'll need three values:

* **heading** 
* **content**
* **date**

And additionally you'll need to put user **token** into header

The **date** is meant to be the date of today.


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
        date: date

    };
    $.ajax({
        method: 'POST',
        url: 'https://api-notey.herokuapp.com/api/1.0/notes/create',
        headers: {
            'Authorization': token, //this is a global variable, make sure to save this during login call
        },
        contentType: "application/json",
        data: JSON.stringify(noteData),
        success: function(result){
            // do something...
        },
        error: function(error){
            var err = JSON.parse(error.responseText);
            alert(err.errorMessage);
        }
    });
}

```

### Update note

This function updates information in the note

This requires three variables:
* **heading**
* **content**
* **date**

And aditionally the notes **id** in the url

**Example:**

```
function getDetails(){
    var heading = $('#heading').val();
    var content = $('#content').val();
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();

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
        date: date

    };
    $.ajax({
        method: 'PATCH',
        url: 'https://api-notey.herokuapp.com/api/1.0/notes/update/{id}',
        data: JSON.stringify(noteData),
        success: function(result){
            // do something...
        },
        error: function(error){
            var err = JSON.parse(error.responseText);
            alert(err.errorMessage);
        }

    });
}

```

### Delete note

This function updates information in the note

This requires the notes **id** in the url

**Example:**

```
function deleteNote(){
    $.ajax({
        method: 'DELETE',
        url: 'https://api-notey.herokuapp.com/api/1.0/notes/delete/{id}',
        success: function(result){
            // do something...
        },
        error: function(error){
            var err = JSON.parse(error.responseText);
            alert(err.errorMessage);
        }

    });
}

```

### Get logged in user information
This function will take the token in the header and extract user name and email of the user currently logged in. It's effective in the use of profile page building

This requires no data to be sent but don't forget to put in the token inside the header

**Example:**

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
        },
        error: function(error){
            var err = JSON.parse(error.responseText);
            alert(err.errorMessage);
        }

    });
}

```

**What you'll recieve in JSON:**
* **userName**
* **email**

### Get all notes related to the user

Gets all notes that the user has created.

You'll need one variable in header:
* **token**

**token** is the user token generated of the user that is currently logged in

**Example:**

```
function generateAllNotes(){
    $.ajax({
        method: 'GET',
        url: 'https://api-notey.herokuapp.com/api/1.0/notes/',
        contentType: "application/json",
        headers: {
            'Authorization': token, //this is a global variable, make sure to save this during login call
        },
        success: function(result){
            // do something...
        },
        error: function(error){
            var err = JSON.parse(error.responseText);
            alert(err.errorMessage);
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
        error: function(error){
            var err = JSON.parse(error.responseText);
            alert(err.errorMessage);
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
| 1.0     | [register] register.userName format is mismatched |
| 1.1     | [register] register domain format is mismatched |
| 1.2     | [register] userName already exist in database |
| 1.4     | [register] not filled all required fields |
| 2.0     | [create] not filled heading or/and content |
| 3.0     | [read] token not found |
| 3.1     | [read] notey notes count is 0/undefined |
| 4.0     | [note] noteId could not be found |
| 5.0     | [update] note content failed to update |
| 6.0     | [login] login userName does not exist |
| 6.1     | [login] login userName and password mismatch|
| 7.0     | [decode] user is not logged in |


All error messages come in a **JSON-Object** meaning there is different parts to the message:

| Type       | Datatype           | Meaning           |
| ------------- |:-------------:| ------------- | 
| messageCode     | int | error code of the error |
| errorMessage     | String | What you can use to put as a GUI error |

**Example:**

```
{
    errorCode: 2.0,
    errorMessage: "not filled all required fields"
}
```

These error messages have to be parsed with the responseText as so:
```
{
    var err = JSON.parse(error.responseText);
}
```

err.errorMessage will become **not filled all required fields**


## Team W.E.I + CUE

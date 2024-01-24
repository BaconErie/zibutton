Dev Doc
=======

Documentation related to developing zibutton server, not usage.

Contains important notes to keep in mind while coding.

Goals
=====

As a guideline, a goal is defined as a task that can be achieved by a single function. Functions include helper functions or view function. However, this is a guideline, not a rule, and exceptions can be made on what constitutes a goal.

- View all of a user's lists
- View a particular list
- Create/edit lists
- Study particular list
- Create accounts
- Login accounts
- Verify tokens and get id from tokens
- Sign out


View all of a user's lists
--------------------------

Path: /lists, /lists?user=<user_id>
API Path: /api/users, /api/users/<user_id> (GET)

If not logged in, then accessing paths with no user_id should be returned with 401 by server and redirect to /login by client

Server returns names and ids of the lists that are visible to the user

Get user from the token using the token verification function


View a particular list
----------------------

Path: /lists?list=<list_id>
API Path: /api/list/<list_id> (GET)

Server will return 403 if the list is private and the user is not the owner

If not auth fail, server should return list name, owner name, owner id, is user owner of the list, as well as a list of characters

Client will get the list using the API and render the list and everything. Also render edit button with link to edit path if user is owner



Create/edit lists
-----------------

Path: /edit, /edit?list=<list_id>
API Path: /api/list/<list_id> (GET, to get list data if pre-existing list; POST, to edit the list), /api/list/ (POST, creates a new list)

When accessing /edit, server should check for the token and redirect to login if not logged in, instead of just returning the client js. 

In addition, if list_id exists when client accesses /edit?list=<list_id>, the server will check to make sure the user matches the owner of the list. If the user is not the owner, the SERVER will redirect the client to 403 page.

After all these checks and if the client passes the checks, the client will recieve and will render the edit page.

If list_id is given in the URL, the client will get list information from /api/list/<list_id>, and if that fails, the CLIENT will redirect to the 403 page

The client will render the characters, and allow boxes to add new characters or remove characters. Also give a box to rename the list and a way to change visibility.

The client should keep track of previous settings and old characters, and then when the user wants to save the changes, send to the server the difference of changes.

Example JSON below. Fields must be omitted if there is no change. For example, if no characters were added, the "added_characters" field should not be sent.
```json
{
    "added_characters": ['一','二','三'],
    "removed_characters": ['四','五','六'],
    "new_name": "Numbers list 1 to 3",
    "visibility": "public"
}
```

The JSON will be sent by the client to /api/list or /api/list/<list_id>, depending on whether the user is editing or creating a list.

The server will first check if the user is logged in, then, if the user is editing the list, check if the user is the owner of the list. If any checks fail, the server will return 403, and the CLIENT will redirect to the 403 page.

Otherwise, if all checks passed, the server will redirect either 200 or 201. If the server returns 201, the server will also return in the body a JSON, which gives the id of the new list. The CLIENT will then redirect to the list homepage.

Study particular list
===???? BRO WHT

Create accounts
---------------

Path: /signup
API Path: /api/signup (POST)

At /signup, before the server sends the signup page, check if the user is already logged in. If so, redirect to /lists

The client will POST JSON to /api/signup, with username and password fields. 

Username rules: Can only contain letters and numbers and underscore
Password rules: Has to be at least 8 characters long

Both server and client will check these rules before processing the input.

In addition, the server will check to make sure the username does not already exist, and check if the username contains offensive items.

If checks pass, the server will create the user in the database, and then return to the client a token and will return 201 (user created). The client will then redirect to /lists

If checks fail, server returns 400 with JSON that contains the error message. The error message JSON will have a single field called "message" and gives the message to be displayed by the client.


Login
-----

Path: /login
API Path: /api/login (POST)

Similar to signup. Send JSON with username and password, check if username exists, return token, redirect to /lists if or show error message otherwise


Account settings (password change, sign out, sign out of all accounts)
------

Path: /account
API Path: /api/account (POST)

The site will give the user options to change password, sign out, and sign out of all accounts.

Sign out option should also be availible at the topbar, and account settings should also be in the top bar.

Before every request at /api/account, the server must verify that the user is logged in, 


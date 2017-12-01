<p align="center"><img src="/images/logo.png" height="120" /></p>
<h1>BACK-END</h1>
<p><em>This document provides general information on the Polica code app and details on the api.  For more information about the Police code client, please see <a href="https://github.com/brianjb-lfl/spacedRepetition-client/blob/master/README.md">Police code front end</a>.</em></p>


Why Police code
---------------
Spaced repetition is a learning technique that incorporates increasing intervals of time between subsequent review of previously learned material. Police code app is using algorithm following the space repetition approach. It will be a great tools to learn about police code for professionals and hubbyist.

How it Works
------------
<table layout="fixed">
  <tr>
    <td width="55%">
      <p>Police code's main screen displays police 10-code.  It is provided with question.</p>
    </td>
    <td width = "40%">
      <img src="/images/question.png" max-height="240px" width="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>When a user logs in, he provides with police code and he can provide his answer in input box. .</p>
    </td>
    <td>
      <img src="/images/answer.png" max-height="240px" witdh="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>If the answer is right, it shows correct in green background. But if it is wrong, it shows incorrect in red background and provides correct answer.</p>
    </td>
    <td>
      <img src="/images/answerresponse.png" max-height="240px" witdh="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>The app also tracks user's over all history progress and particular session's progress.</p>
    </td>
    <td>
      <img src="/images/feedback.png" max-height="240px" witdh="auto">
    </td>
  </tr>
</table>

Where to find Police code
------

|          **desc**        |                   **location**                                          |
|--------------------------|-------------------------------------------------------------------------|
|live client               |   http://lucid-davinci-0607dd.netlify.com/                               |
|client code               |   https://github.com/brianjb-lfl/spacedRepetition-client                     |
|deployed api              |   https://space-repetetion.herokuapp.com/                           |
|api code                  |   https://github.com/giri68/spacedRepetition-server                        | 

Local API Use
------
1.  clone this repository<br>
``` git clone https://github.com/giri68/spacedRepetition-server.git```<br>

2.  move to the repository's local directory<br>
``` cd spacedRepetition-server```<br>

3.  install dependencies<br>
``` npm install```<br>

note: use of this api requires access to a mongo database<br>

4.  if using a remote database instance (e.g. mLab)<br>
    create a .env file in the repository root with the following line:<br>
``` DATABASE_URL=(database connection string/url)```<br>

4.  or, you can use a local mongo database<br>
    when using a local database, omit the DATABASE_URL .env setting<br>
    in the config.js file, modify the second part of the following line accordingly<br>
``` process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend'```<br>

5.  start the server<br>
``` npm start```<br>

The api can now be accessed at:  
```http://localhost:8080/```

See below for specific endpoints.


Data Fields
------

|  **field**          |         **description**           |
|:--------------------|:----------------------------------|
|  id                 |  uniquely assigned id             |
|  firstName          |  users first name                 |
|  lastName           |  users last name                  |
|  head               |  first object                     |
|  userQs             |  array of questions               |
|  uqId               |  user question id                 |
|  uqNext             |  next value in question object    |
|  uRepF              |  memory factor                    |
|  qhistAtt fields    |   hostory of question attempt     |                                                                 
| qhistCorr           |  history of correct answer        |
| question            |  question of plice code           |
| answer              |  answer of police code question   |


Endpoints
------
Base url:  https://buzz-kill-backend-bbp.herokuapp.com/

**GET api/users**<br>
Returns array of objects with detailed information on each user.  Sample user object:
```    
    {
	id: "5a1dcfaf67fea94e7a96c09a",
	firstName: "jasper",
	lastName: "javius",
	username: "jjtheman",
	head: 0,
	userQs: [
			{
			uqId: 0,
			uqNext: 1,
			uQuestion: "10-41",
			uAnswer: "beginning tour",
			uRepF: 1,
			_id: "5a1dcfaf67fea94e7a96c0a4",
			qhistCorr: 0,
			qhistAtt: 0
			},.......
		]
```
On success, return code: 200
On failure, return code: 500

**GET api/questions**<br>
Returns array of objects of question.  Sample question object:
```    
    {
question: "10-41"
},
```
On success, return code: 200
On failure, return code: 500


**POST api/questions**<br>
Include in header ...  Content-Type:  application/json
Include in body ... question, answer


```
{
	"question": "10-20",
	"answer": "location"
}
```
On success, return code: 201
On failure, return code: 422 (input error), or 500 (server error)
Will return detailed information (see GET call).

**POST api/users**<br>
Include in header ...  Content-Type:  application/json
Include in body ... username, password, fistName and lastName


```
{
	"firstName": "jasper",
	"lastName": "javius",
	"username": "jjtheman",
	"password": "password"
}
```
On success, return code: 201
On failure, return code: 422 (input error), or 500 (server error)
Will return detailed information (see GET call).


**PUT api/users/userquestion/userId**<br>
Include in header ...  Content-Type:  application/json
Include in body ... user's id (must match id in url)

```
{
	"_id": "5a1dcfaf67fea94e7a96c09a"
	
}
```
On success, return code: 201
On failure, return code: 500 (server error)

Will return detailed information (see GET call).


**DELETE api/users/userId**<br>
Id in url must be valid id of currently active user.

On success, return code: 204
On failure, return code: 422 (input error) or 500 (server error)

Technology Used
------
* javascript
* node.js
* express
* cors
* mongodb
* mongoose
* mocha, chai


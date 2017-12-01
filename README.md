<p align="center"><img src="/img/logo.jpg" height="120" /></p>
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
      <p>Police code's main screen displays police 10-code.  It is provided with police 10-code.</p>
    </td>
    <td width = "40%">
      <img src="/img/buzz-kill-main.png" max-height="240px" width="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>When a user logs in, he provides with police code and he can provide his answer in input box. .</p>
    </td>
    <td>
      <img src="/img/buzz-kill-addpatron.png" max-height="240px" witdh="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>If the answer is right, it shows correct in green background. But if it is wrong, it shows incorrect in red background and provides correct answer.</p>
    </td>
    <td>
      <img src="/img/buzz-kill-patrondet.png" max-height="240px" witdh="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>The app also tracks user's over all history progress and particular session's progress.</p>
    </td>
    <td>
      <img src="/img/buzz-kill-patronemergency.png" max-height="240px" witdh="auto">
    </td>
  </tr>
</table>

Where to find Police code
------

|          **desc**        |                   **location**                                          |
|--------------------------|-------------------------------------------------------------------------|
|live client               |   http://lucid-davinci-0607dd.netlify.com/             .                    |
|client code               |   https://github.com/brianjb-lfl/spacedRepetition-client                     |
|deployed api              |   https://space-repetetion.herokuapp.com/                           |
|api code                  |   https://github.com/giri68/spacedRepetition-server                        | 

Local API Use
------
1.  clone this repository<br>
``` git clone https://github.com/brianjb-lfl/buzz-kill-back.git```<br>

2.  move to the repository's local directory<br>
``` cd buzz-kill-back```<br>

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

|  **field**          |         **description**                                                      |
|:--------------------|:-----------------------------------------------------------------------------|
|  id                 |  uniquely assigned id                                                        |
|  table              |  number, table number at which patron is seated                              |
|  seat               |  number, seat in which patron is seated                                      |
|  weight             |  number, for bac calculation, patron's estimated weight                      |
|  gender             |  string, for bac calculation, patron's apparent gender                       |
|  start              |  timestamp - when patron arrived at establishment                            |
|  drinks         |  array of objects, each representing a drink consumed by the patron          |
|  drinks: drinkEq    |  number, relative strength/alcohol content of drink<br>e.g. 1 = 12oz beer, glass of wine, or shot of liquor
|  drinks: drinkTime  |  timestamp, time at which drink was ordered, used in bac calculation         |
|                     |                                                                              |
|  virtual fields     |                                                                              |
|  *bac*              |  number, patron's estimated blood-alcohol level with leading ".0" removed    |
|  *timeOnSite*       |  string, format "hh:mm" representing the patron's current length of stay     |
|  *seatString*       |  string, format "Table # - Seat #" summarizing patron's location             |


Endpoints
------
Base url:  https://buzz-kill-backend-bbp.herokuapp.com/

**GET api/patrons**<br>
Returns array of objects with detailed information on each patron in the establishment.  Sample patron object:
```    
    {
        "id": "59f2970fc2722500123d4f03",
        "seatString": "Table 1 - Seat 1",
        "start": "2017-10-27T02:16:47.983Z",
        "drinks": [
            {
                "_id": "59f2971fc2722500123d4f04",
                "drinkTime": "2017-10-27T02:17:03.586Z",
                "drinkEq": 1
            }
        ],
        "bac": "0.9",
        "timeOnSite": "1:10"
    }
```
On success, return code: 200
On failure, return code: 500


**POST api/patrons**<br>
Include in header ...  Content-Type:  application/json
Include in body ... table, seat, gender and weight (optional)


```
{
	"table": "1",
	"seat": "2",
	"gender": "m"
}
```
On success, return code: 201
On failure, return code: 422 (input error), or 500 (server error)
Will return detailed information (see GET call) on the patron just added.


**PUT api/drinks/patron_id**<br>
Include in header ...  Content-Type:  application/json
Include in body ... patron's id (must match id in url) and drink equivalent

```
{
	"_id": "59f2970fc2722500123d4f03",
	"drinks": {"drinkEq": 1.5}
}
```
On success, return code: 201
On failure, return code: 400 (input error) or 500 (server error)

Will return detailed information (see GET call) on the patron just added.


**DELETE api/patrons/patron_id**<br>
Id in url must be valid id of currently active patron.

On success, return code: 204
On failure, return code: 422 (input error) or 500 (server error)

**DELETE api/patrons/dayclose**<br>
CAUTION:  This will delete all from the patrons collection.  This cannot be undone.

On success, return code: 204
On failure, return code: 500

Technology Used
------
* javascript
* node.js
* express
* cors
* moment
* mongodb
* mongoose
* mocha, chai

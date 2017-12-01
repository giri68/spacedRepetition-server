<p align="center"><img src="/img/logo.jpg" height="120" /></p>
<h1>BACK-END</h1>
<p><em>This document provides general information on the Buzz-Kill app and details on the api.  For more information about the Buzz-Kill client, please see <a href="https://github.com/brianjb-lfl/buzz-kill-frontend/blob/master/README.md">Buzz-Kill front end</a>.</em></p>


Why Buzz-Kill
-------------
Every restaurant, bar and club owner wants to provide a safe and enjoyable guest experience.  Buzz-Kill is an easy-to-use tool that helps managers and their staff monitor patrons' alcohol consumption and spot potential problems early.  It requires minimal additional effort by servers and presents information in a format that is easy for busy managers to process in a quick glance.

How it Works
------------
<table layout="fixed">
  <tr>
    <td width="55%">
      <p>Buzz-Kill's main screen displays a colored box for each patron in the establishment.  The color-coding and easy-to-read number on the box represent an estimate of that patron's bac based on the count and timing of their drinks during the current visit.</p>
    </td>
    <td width = "40%">
      <img src="/img/buzz-kill-main.png" max-height="240px" width="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>When a new patron arrives, the server logs them in by table and seat.  To facilitate the bac calculation, the patron's gender is also logged.  As an option for more accuracy, the system can be modified to accept an estimate of the patron's weight.</p>
    </td>
    <td>
      <img src="/img/buzz-kill-addpatron.png" max-height="240px" witdh="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>Key information is provided for each patron in a user-friendly format.  The color of the patron info box changes gradually from green to red as the patron has more to drink, and then back toward green over time as the patron metabolizes the alcohol they've consumed.  The number indicates the patron's calculated bac expressed in 100th's of a percent.  This format is used to make the number easier to recognize at a glance.  For more detail, the patron's current time of stay in the establishment and a graphical representation of their drink orders is provided.</p>
    </td>
    <td>
      <img src="/img/buzz-kill-patrondet.png" max-height="240px" witdh="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>And if someone goes too far, help is a just a click away.  The system will allow a phone call, text message or email to be sent to the recipient of the establishment's choosing.</p>
    </td>
    <td>
      <img src="/img/buzz-kill-patronemergency.png" max-height="240px" witdh="auto">
    </td>
  </tr>
</table>

Where to find Buzz-Kill
------

|          **desc**        |                   **location**                                          |
|--------------------------|-------------------------------------------------------------------------|
|live client               |   https://buzz-kill-bbp.herokuapp.com/             .                    |
|client code               |   https://github.com/brianjb-lfl/buzz-kill-frontend                     |
|deployed api              |   https://buzz-kill-backend-bbp.herokuapp.com/                          |
|api code                  |   https://github.com/brianjb-lfl/buzz-kill-back                         | 

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

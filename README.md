<p align="center"><img align="center" src="https://user-images.githubusercontent.com/49604677/188925310-4e7132d4-9728-4daa-a20d-5f2cefc1ee21.svg"></p>

<h1 align="center">Authentication-Secrets</h1>

## Table of contents
* [General info](#general-info)
* [Built With](#built-with)
* [Quick Start](#quick-start)



## General info
<p align="center">
<img width="610" alt="login capt" src="https://user-images.githubusercontent.com/49604677/188709987-26c726c0-425a-4124-b73a-9c0f37c03b58.png">
</p>
this project covers 6 levels of security beginning with saving passwords in plain text and arriving at authentication with Facebook and google.
and these are the varying levels of security used: 
``` bash 
* Level 1 security: register username and password
* Level 2 security with Encryption
* Level 3: Hashing with md5
* Level 4: Hashing and Salting with bcrypt
* Level 5: Cookies and Sessions
* Level 6: Google and Facebook OAuth 2.0 Authentication
```
> **Note**
> Each security and authentication level is commited under its name. 


## Built With
Project is created with:

* [![Express.js][Express.com]][Express-url]
* [![MongoDB][Mongo.com]][Mongo-url]
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![JQuery][JQuery.com]][JQuery-url]
* ![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)

## Quick Start
To get started with this project, clone the repository and install the dependencies.

1. clone the repository into your machine.
   ```sh
   git clone https://github.com/dhifaouibilel/Authentication-Secrets.git
   ```
2. Install NPM package dependencies
   ```sh
   npm install
   ```
3. Inside the project folder install the dotenv package to store 
 ```sh
   npm install dotenv
   ```  
4. Create the dotenv file to save your credentials inside it 
 ```sh
   touch .env
   ```  
5. The Google and Facebook OAuth 2.0 Authentication requires credentials from Google and Facebook, which can be obtained by [creating](https://support.google.com/mail/answer/185833?hl=en-GB) an app in the [Google Developers Console](https://console.cloud.google.com/apis/dashboard) also by [creating](https://developers.facebook.com/docs/development/create-an-app) an app in the [Facebook Developers](https://developers.facebook.com/).
Once credentials have been obtained, save them inside the .env file 
 ```sh
   CLIENT_ID=INSERT_GOOGLE_CLIENT_ID_HERE
   CLIENT_SECRET=INSERT_GOOGLE_CLIENT_SECRET_HERE
   FACEBOOK_APP_ID=INSERT_APP_ID_HERE
   FACEBOOK_APP_SECRET=INSERT_APP_SECRET_HERE
   ``` 

6. Run the app 
 ```sh
   nodemon app.js
   ```  
  
> **Note**
> you can rollback to any level of security you want by using checkout commits:

 ```sh
   git checkout SHA_OF_COMMIT .
   ``` 







<!-- MARKDOWN LINKS & IMAGES -->

[Mongo.com]:https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[Mongo-url]:https://www.mongodb.com/
[Express.com]:https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]:https://expressjs.com/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 

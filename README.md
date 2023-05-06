# AEVS User Website
This is a web application that allows users to schedule AEVS deliveries and monitor delivery status.

Live website at: [uhm-aevs.online](https://uhm-aevs.online/)

To create a local copy of the application:

1) Download and install [Node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com/).
2) Initialize a new database in MongoDB:
   1) Enter `mongosh` in the terminal to start MongoDB.
   2) Once MongoDB has started, create a new database named `aevs` by executing the command `use aevs`. 
   3) Exit MongoDB by entering `exit`.
3) `cd` into the root directory of the repository and run the command `npm install` to install the dependencies necessary to run the app.
4) Execute the command `npm start` to start the application. Navigate to `http://localhost:3000/` in a web browser to use the application.

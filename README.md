# L.I.F.T (Lifesaving Immediate Flight Transport)

![Excalidraw Diagram](https://excalidraw.com/#room=0a969a71b32ff93a144d,w3M0_P5VNehwf4HVj87d-w)

![Trello Board](https://trello.com/b/ndC2NooN)

## Overview

L.I.F.T (Lifesaving Immediate Flight Transport) is a robust and responsive web application designed to manage and streamline aeromedical evacuation missions. Built using a modern tech stack, it facilitates the planning and execution of critical patient transport operations.

This application is containerized using Docker Compose, ensuring a consistent development and deployment environment. The front-end is built with React, styled using PrimeReact for a modern and user-friendly interface. Authentication and session management are implemented to provide secure access and maintain user preferences across sessions, including light and dark mode themes.

## Features

- **User Authentication:** Secure login with username and password using bcrypt for password hashing.
- **Session Management:** Session cookies maintain state and theme preferences (light/dark mode) across app pages.
- **Responsive Design:** Fully responsive for use on mobile devices, tablets, and desktops. Supports both cursor and touchscreen interactions.
- **Dynamic Data Presentation:** Most pages use cards that adjust size based on the content, ensuring optimal data display.
- **Mission Management:** Access and manage patient, attendant, and aircraft information for current missions. 
- **Auto-Assign Triage System:**  Prioritize patients based on the urgency of care needs.
- **Data Export:** Capability to export mission data to CSV format for reporting and documentation.
- **Editable Mission Details:** Users can edit patient and attendant information, create new missions, and change aircraft platforms.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/get-npm)

# Installation
    1. Fork and Clone the repository:
        Fork https://github.com/WadeT2000/LIFT
        ```bash
        git clone https://github.com/WadeT2000/LIFT.git

    2. Navigate to the project directory:
        ```bash
        cd LIFT


    Open docker-desktop in the background
        
        (Windows Users)
        -Navigate to settings
            - Navigate to resources, then WSL integration
            - Ensure the Enable checkbox is selected and your terminal is selected as well.


    In the VS Code terminal:
        - CD into the api folder and run 'npm install'
        - CD into the ui folder and run 'npm install'

    After running npm install for each endpoint, in the terminal CD back to mydockertemplate and do the following:

        1. ` docker-compose up --build `

Before we start creating our front and backend lets check to make sure our database hase been build properly.

Make your terminal as big as possible

    You may not have an error code at all: 
        Your terminal should look similar to below
    
api  | 
api  | > api@1.0.0 start
api  | > knex migrate:rollback && knex migrate:latest && knex seed:run && nodemon ./src/app.js
api  | 
api  | Using environment: development
api  | Already at the base migration
ui   | 
ui   | > ui@0.1.0 start
ui   | > react-scripts start
ui   | 
api  | Using environment: development
api  | Batch 1 run: 1 migrations
api  | Using environment: development
api  | Ran 1 seed files
api  | [nodemon] 3.1.4
api  | [nodemon] to restart at any time, enter `rs`
api  | [nodemon] watching path(s): *.*
api  | [nodemon] watching extensions: js,mjs,cjs,json
api  | [nodemon] starting `node ./src/app.js`
api  | Express server listening on port 8080
ui   | (node:25) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
ui   | (Use `node --trace-deprecation ...` to show where the warning was created)
ui   | (node:25) [DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] DeprecationWarning: 'onBeforeSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
ui   | Starting the development server...
ui   | 
ui   | Compiled successfully!
ui   | 
ui   | You can now view ui in the browser.
ui   | 
ui   |   Local:            http://localhost:3000
ui   |   On Your Network:  http://172.18.0.4:3000
ui   | 
ui   | Note that the development build is not optimized.
ui   | To create a production build, use npm run build.
ui   | 
ui   | webpack compiled successfully

Move onto (The application should be up and running) below


Else see below:


Look for an error line and/or api exit line,

    api exited with code 1 or any other codes.

above the error code it should display similar to below:
    (IF YOU HAVE ANY TO BEGIN WITH)

    

api  | 
api  | > api@1.0.0 start
api  | > knex migrate:rollback && knex migrate:latest && knex seed:run && nodemon ./src/app.js
api  | 
api  | Using environment: development
db   | 2024-08-05 19:16:48.543 UTC [40] FATAL:  database "<Your Database name>" does not exist                           (Look at this error in particular)
api  | database "<Your Database name>" does not exist
api  | error: database "<Your Database name>" does not exist
api  |     at Parser.parseErrorMessage (/src/app/node_modules/pg-protocol/dist/parser.js:283:98)
api  |     at Parser.handlePacket (/src/app/node_modules/pg-protocol/dist/parser.js:122:29)
api  |     at Parser.parse (/src/app/node_modules/pg-protocol/dist/parser.js:35:38)
api  |     at Socket.<anonymous> (/src/app/node_modules/pg-protocol/dist/index.js:11:42)
api  |     at Socket.emit (node:events:520:28)
api  |     at addChunk (node:internal/streams/readable:559:12)
api  |     at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
api  |     at Readable.push (node:internal/streams/readable:390:5)
api  |     at TCP.onStreamRead (node:internal/stream_base_commons:191:23)
ui   | 
ui   | > ui@0.1.0 start
ui   | > react-scripts start
ui   | 
api exited with code 1

If you have an error in your terminal see Common Errors below for fixes.

# Common Errors

Do not go to a step base off of the error code. Read the error and the potential errors below and adjust accordingly.

1. If you run into the issue of already having a container with this name follow directions below
            The container name "/db" is already in use by container "---------------------------------------". You have to remove (or rename) that container to be able to reuse that name.

            - Navigate to docker-compose.yaml and change the container name on Line 4

            OR

            - In the terminal 
                - Press Lctrl+C
                + ` docker container rm <Container Name> ` (Container Name should be the container that is being hosted on the same port)
                (This should resolve your container issues)
            If this fixes any and all erros proceed to (The application should be up and running) below

 2. Database that you've created not actually being created? follow below instructions
    
    api  | 
    api  | > api@1.0.0 start
    api  | > knex migrate:rollback && knex migrate:latest && knex seed:run && nodemon ./src/app.js
    api  | 
    api  | Using environment: development
    db   | 2024-08-05 19:16:48.543 UTC [40] FATAL:  database "<Your Database name>" does not exist
    api  | database "<Your Database name>" does not exist
    api  | error: database "<Your Database name>" does not exist
    api  |     at Parser.parseErrorMessage (/src/app/node_modules/pg-protocol/dist/parser.js:283:98)
    api  |     at Parser.handlePacket (/src/app/node_modules/pg-protocol/dist/parser.js:122:29)
    api  |     at Parser.parse (/src/app/node_modules/pg-protocol/dist/parser.js:35:38)
    api  |     at Socket.<anonymous> (/src/app/node_modules/pg-protocol/dist/index.js:11:42)
    api  |     at Socket.emit (node:events:520:28)
    api  |     at addChunk (node:internal/streams/readable:559:12)
    api  |     at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
    api  |     at Readable.push (node:internal/streams/readable:390:5)
    api  |     at TCP.onStreamRead (node:internal/stream_base_commons:191:23)
    ui   | 
    ui   | > ui@0.1.0 start
    ui   | > react-scripts start
    ui   | 
    api exited with code 1
    
    There are two main ways to go about this fix actions

        1. Delete all previous volumes so it creates your database upon starting your application
            (Be warned this will delete any previous databases that you have build in your user-data directory, if you dont have anything personal that you have build and want to keep then avoid doing this step)
            
            - In your current terminal
                + Press L-ctrl + C
                + ` docker-compose down -v `
                + ` docker-compose up --build `
            Everything should be up and running as intended
            If this fixes any and all erros proceed to (The application should be up and running) below

        2. Manually create your database:
        - Now that you have created a db container lets look inside it.
            - Open a new terminal
                + ` docker ps `
                (you should see a couple containers listed, one of them should have the name db with a container id similar to <6d3nna456...> this will change with every container you spin up)
                + ` docker exec -it <First 2-4 digits in the container ID> bash `
                + ` psql -U postgres `
                + ` \l `
                (This should produce a chart of all the database under your current container)
                + ` CREATE DATABASE <Database name that you have come up with in the previous steps matching this name is important> ; `
            You have now created your database.
                - In your main terminal
                    + Press L-ctrl + C 
                    + ` docker-compose down `
                    + ` docker-compose up --build `
            Everything should be up and running as intended.
            If this fixes any and all erros proceed to (The application should be up and running) below

                    

##   Frontend Endpoints

The L.I.F.T. application routes are managed using React Router. Below are the primary routes:

* /: Directs to the LoginPage.
* /home: Redirects to the HomePage if authenticated, otherwise back to LoginPage.
* /logout: Logs out the user.
* /PatientList: Displays the list of patients associated with a mission.

## Backend Endpoints

The L.I.F.T. API is built using Express.js with Knex.js as the query builder for database operations. Below are the key API endpoints:

* GET /: Health check endpoint to confirm API is up and running.
* GET /users: Retrieve all user information from the database.
* GET /testingtable: Fetch data from a test table for validation and testing purposes.
* GET /patientsmission1: Retrieve patient information for mission 1.
* GET /attendantsmission1: Retrieve attendant information for mission 1.
* GET /aircraft: Retrieve aircraft information.

## Industry Standards and Best Practices

The L.I.F.T. app adheres to the following industry standards to ensure robust and maintainable code:

**Security**: User authentication with bcrypt for secure password storage. Sensitive information is not exposed through the API.
**Containerization**: Docker Compose is used to manage dependencies and ensure consistent environments across different stages of development and deployment.
**Responsive Design**: The app is optimized for various devices, ensuring accessibility and usability across platforms.
**API Design**: RESTful principles guide the API design, with clear and predictable routes for data access.
**Version Control**: Git is used for version control, with branches for feature development and bug fixes.
**Continuous Integration**: A CI/CD pipeline ensures that changes are tested and deployed consistently.
Usage
**Login**: Users must log in to access the app functionalities.
**Navigation**: After login, the HomePage provides an overview of current missions, including patients, attendants, and aircraft.
**Data Interaction**: Users can view, edit, and manage mission-related data, add new missions, and export information.
**Logout**: Securely log out to end the session.

## Contribution
Contributions are welcome! Please fork the repository and submit a pull request for review.

## License
This project is licensed under the MIT License.
# This is my Docker-Compose template

- Under docker-compose.yaml change my_database to the name of the database you want to create
    Line 10 - POSTGRES_DB=my_database
    Line 35 - DB_CONNECTION_STRING=postgresql://postgres:docker@db:5432/my_database 
    (Save the document)
      
- In ./api/.env change my_database to the name of the database you want to create as well.
      - DB_CONNECTION_STRING=postgresql://postgres:docker@db:5432/my_database

- All other ports and DockerFiles should be configured for 3000:3000 for the ui(frontend) and 8080:8080 for the api(backend). The database will be hosted on the default 5432:5432

# First step before running
    
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

                    

# The application should be up and running

    Your basic testing application should be running
        localhost:3000/ should display 
            - Testing
        localhost:8080/ should display
                - My API is up and running!
            As well as and end point
        localhost:8080/testingtable
                - [{"id":1,"name":"rowValue1"},{"id":2,"name":"rowValue2"},{"id":3,"name":"rowValue3"}]



# Navigating docker-compose

    In the teminal

    - Press L-ctrl + C
    - ` docker-compose down `

    From here you can build your Frontend(ui) and backend(api)
    Follow the Readme's for each directory to build your database and react-app

Once you have completed your database run ` docker-compose up --build `
You can work on your backend endpoints in api/src/app.js and it will show your changes at each localhost:8080.
You can work on your frontend ui/src and it will show your changes at each localhost:3000.

    (Keep in mind and changes to the actual database you will need to ` docker-compose down ` and ` docker-compose up --build ` to see these new changes)
# CSV-to-MongoDB
CSV-to-MongoDB is a web application made using ejs, node.js, express.js and mongodb.

In this web application, once a user is registered, can upload any **```.csv```** file; its contents will be scanned and uploaded to the mongodb. User can now perform all the CRUD operations on the uploaded data.

### Getting Started
To run the application on your local machine you need to have node.js and mongodb installed, up and running. 
Once you have installed node.js and mongodb, you can now download this repository as **```.zip```** and extract it into a folder.
After extracting, open the repository directory in a terminal / cmd and run the following command:
```
npm install
```
This should install all the dependencies needed for the application to run.

### Setting up Environment Variables
Application requires only one environment variable to make it run. To setup environment variables create a **```.env```** file in the repository folder's root directory. Now, open the ```.env``` file in a text editor and enter the following:
```
SESSION_SECRET=<Your secret key>
```
replace ```<Your secret key>``` with a random string that must be kept secret. You can now save this file and exit the text editor.
This should satisfy all the needs of the application.

### Starting the Server
Once all the dependencies are finished installing run the following command in the terminal to start the application:
```
npm start
```
Application should now be up and running at port ```3000```.
To access the application simply open your preffered browser and type the following in the url bar:
```
http://localhost:3000
```
To stop the server press ```Ctrl + C``` on the server terminal.

## API Collection
The application uses multiple Restful APIs to perform various actions. APIs working in this application are listed as follows:

|API                               | Request      | Operation
| -------------------------------- | ------------ | ------------------------------------
|```/```                           | ```GET```    | Redirect to ```/login``` 
|```/register```                   | ```GET```    | Render new user registration form 
|```/register```                   | ```POST```   | Register a new user 
|```/login```                      | ```GET```    | Render user login form
|```/login```                      | ```POST```   | Authenticate the user and redirect to ```/client```
|```/logout```                     | ```GET```    | Logout user
|```/client```                     | ```GET```    | Render file upload page
|```/client```                     | ```POST```   | Parse the uploaded file an save it in mongodb
|```/client/select```              | ```GET```    | Render file select page and display files stored in mongodb
|```/client/select/:fileId```      | ```GET```    | Display Content of the selected file from mongodb
|```/client/select/:fileId/new```  | ```GET```    | Render form to add a new entry
|```/client/select/:fileId```      | ```POST```   | Add new entry
|```/client/select/:fileId/:id```  | ```GET```    | Render form to edit an entry
|```/client/select/:fileId/:id```  | ```PUT```    | Update an entry
|```/client/select/:fileId/:id```  | ```DELETE``` | Delete an entry
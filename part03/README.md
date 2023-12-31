# Full Stack Open Course - University of Helsinki - 2022/2023

# Exercice 3.10 phonebook backend step10

Deploy the backend to the internet, for example to Fly.io or Render.

Test the deployed backend with a browser and Postman or VS Code REST client to ensure it works.

PRO TIP: When you deploy your application to Internet, it is worth it to at least in the beginning keep an eye on the logs of the application AT ALL TIMES.

Create a README.md at the root of your repository, and add a link to your online application to it.

NOTE: as it was said, you should deploy the BACKEND to the cloud service. If you are using Fly.io the commands should be run in the root directory of the backend (that is, in the same directory where the backend package.json is). In case of using Render, the backend must be in the root of your repository.

You shall NOT be deploying the frontend directly at any stage of this part. It is just backend repository that is deployed throughout the whole part, nothing else.

## Deployed API URL

[https://phonebook-backend-caballeroluis.fly.dev/api/persons](https://phonebook-backend-caballeroluis.fly.dev/api/persons)


# Exercice 3.11 phonebook full stack

Generate a production build of your frontend, and add it to the internet application using the method introduced in this part.

NB If you use Render, make sure the directory build is not gitignored

Also, make sure that the frontend still works locally (in development mode when started with command npm run dev).

If you have problems getting the app working make sure that your directory structure matches the example app.

## Deployed APP URL

[https://phonebook-backend-caballeroluis.fly.dev](https://phonebook-backend-caballeroluis.fly.dev)


### How do I deploy to production
```
cd fullstackopen/part03/phonebook-ui
npm run build:fly.io
```

```
cd fullstackopen
rm -Rf ./part03/phonebook-backend/dist
cp -r ./part03/phonebook-ui/dist ./part03/phonebook-backend
```

```
cd fullstackopen/part03/phonebook-backend
fly deploy
```

visit: [https://phonebook-backend-caballeroluis.fly.dev](https://phonebook-backend-caballeroluis.fly.dev)

![image](https://github.com/caballeroluis/fullstackopen/assets/111797757/470c4754-c89c-41f0-a2b4-e15691b3f532)


### How to deploy local                                                                                                                                                         
```
cd fullstackopen/part03/phonebook-ui
npm run build
```

```
cd fullstackopen
rm -Rf ./part03/phonebook-backend/dist
cp -r ./part03/phonebook-ui/dist ./part03/phonebook-backend
```

```
cd fullstackopen/part03/phonebook-backend
npm run dev
```

visit: [http://http://localhost:3001](https://http://localhost:3001)

![image](https://github.com/caballeroluis/fullstackopen/assets/111797757/7388bfb7-01f3-46d4-bdaa-306796ab04ec)


# Exercice 3.12: Command-line database

Create a cloud-based MongoDB database for the phonebook application with MongoDB Atlas.

Create a mongo.js file in the project directory, that can be used for adding entries to the phonebook, and for listing all of the existing entries in the phonebook.

My console:

```
$ node mongo.js **** Anna 040-1234556
added Anna number 040-1234556 to phonebook
```

```
$ node mongo.js ****
phonebook:
Anna 040-1234556
```
# Exercice 3.13: Phonebook database, step1 & Exercice 3.14: Phonebook database, step2

3.13: Phonebook database, step1

Change the fetching of all phonebook entries so that the data is fetched from the database.

Verify that the frontend works after the changes have been made.

In the following exercises, write all Mongoose-specific code into its own module, just like we did in the chapter Database configuration into its own module.

3.14: Phonebook database, step2

Change the backend so that new numbers are saved to the database. Verify that your frontend still works after the changes.

At this stage, ~~you can ignore whether there is already a person in the database with the same name as the person you are adding.~~

![image](https://github.com/caballeroluis/fullstackopen/assets/111797757/72508941-6894-46eb-b0fa-059303ec3f59)


# Exercice 3.15: Phonebook database, step3

Change the backend so that deleting phonebook entries is reflected in the database.

Verify that the frontend still works after making the changes.

# Exercice 3.17*: Phonebook database, step5

If the user tries to create a new phonebook entry for a person whose name is already in the phonebook, the frontend will try to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL.

Modify the backend to support this request.

Verify that the frontend works after making your changes.

# Exercice 3.18*: Phonebook database step6

Also update the handling of the api/persons/:id and info routes to use the database, and verify that they work directly with the browser, Postman, or VS Code REST client.

Inspecting an individual phonebook entry from the browser should look like this:

![image](https://github.com/caballeroluis/fullstackopen/assets/111797757/61a19b93-6950-4098-b7ad-7f6e0a8d1080)


# Exercice 3.19*: Phonebook database, step7

Expand the validation so that the name stored in the database has to be at least three characters long.

Expand the frontend so that it displays some form of error message when a validation error occurs. Error handling can be implemented by adding a catch block

You can display the default error message returned by Mongoose, even though they are not as readable

![image](https://github.com/caballeroluis/fullstackopen/assets/111797757/f794669c-7dc3-451e-8395-9785a8c8da6d)


![image](https://github.com/caballeroluis/fullstackopen/assets/111797757/f2bcf894-e48c-4500-b6c8-b9ec44331d53)


# Exercice 3.20*: Phonebook database, step8

Add validation to your phonebook application, which will make sure that phone numbers are of the correct form. A phone number must:

    have length of 8 or more

    be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers
        eg. 09-1234556 and 040-22334455 are valid phone numbers
        eg. 1234556, 1-22334455 and 10-22-334455 are invalid

Use a Custom validator to implement the second part of the validation.

If an HTTP POST request tries to add a person with an invalid phone number, the server should respond with an appropriate status code and error message.

![image](https://github.com/caballeroluis/fullstackopen/assets/111797757/a1381269-805a-4e32-abeb-00ffb83fcf40)


# Exercice 3.21 Deploying the database backend to production

Generate a new "full stack" version of the application by creating a new production build of the frontend, and copying it to the backend repository. Verify that everything works locally by using the entire application from the address http://localhost:3001/.

Push the latest version to Fly.io/Render and verify that everything works there as well.

NOTE: you should deploy the BACKEND to the cloud service. If you are using Fly.io the commands should be run in the root directory of the backend (that is, in the same directory where the backend package.json is). In case of using Render, the backend must be in the root of your repository.

You shall NOT be deploying the frontend directly at any stage of this part. It is just backend repository that is deployed throughout the whole part, nothing else.
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
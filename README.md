# Demo chat app

This is a demo chat app written with Express and socket.io. It expects a running Redis instance providing a pub/sub mechanism to coordinate between multiple servers.

It is a placeholder app representing a minimal version of a WebSocket server for testing purposes. As such, it includes a `Dockerfile` so that an image can be built and uploaded to e.g. [Docker Hub](https://hub.docker.com/). A public image of this app can be found [here](https://hub.docker.com/repository/docker/catherinemond/river-demo-redis). It is currently used for River beta deployment.

## A few useful commands:

Testing locally is more complex than it seems, because you also need to run Redis and tell your container how to communicate with it.

### A simple local testing scenario

This is to simply test the logic of your server without any reference to Redis.

- Open `server.js` and comment out the references to Redis (lines 5 and 23-25).
- In the same file, change the port the server listens on from 80 to 3000.
- In your terminal, run `node server.js`.
- In your browser, navigate to `localhost:3000`: you should see the demo app and be able to interact with it from multiple browser tabs.

### A more complex local testing scenario

- In `server.js` make sure to uncomment the references to Redis if you followed the instructions above: this is what we now want to test!
- The server should listen on port 3000.
- Once you've finished modifying the file, you can create a docker image with the following command: `docker build -t your-image-name .`
- For proper local testing, we need three running containers: a Redis instance and two instances of our demo server. You can use the following commands:

```
docker network create test
docker run --net=test --name redis -p 6379:6379 redis
docker run --net=test --name chat1 -p 3000:3000 -e "REDIS_HOST=redis" -e "REDIS_PORT=6379" your-image-name
docker run --net=test --name chat2 -p 3001:3000 -e "REDIS_HOST=redis" -e "REDIS_PORT=6379" your-image-name
```

A network is needed to allow the containers to communicate: this is created in the first line. You can then start the Redis container (line 2): you can give it any name you want and feel free to add the `-d` flag to run it as a background process.

The next two lines start two different instances of the demo app listening on port 3000 and 3001. This is done in order to mimic multiple WebSocket servers and make sure that Redis coordinates between them. The `-e` flag allows you to specify the environment variables expected by the app. You should be able to open your browser and navigate to `localhost:3000` and `localhost:3001` and use the demo app.

If everything works as expected, well done! You can stop the Docker containers by issuing the command `docker stop your-container-name`.

### Push your image to Docker Hub

Once you've made sure the app works locally, you're ready to upload your image to Docker Hub. Make sure to go back to the `server.js` file and have the server listen on **port 80**: this is what is needed for deployment.

After you've made the changes, go ahead and create a new Docker image by running the command: `docker build -t your-image-name .`

To push your image to Docker Hub:

- First, you need to tag your image: `docker image tag your-image-name your-username/your-image-name:latest`
- Make sure you're connected to Docker Hub by issuing `docker login` from your terminal.
- Finally, push the image with `docker push your-username/your-image-name:latest`

Be sure to take note of your repository name and make it public! This image will be needed to deploy your ECS cluster with Fargate.

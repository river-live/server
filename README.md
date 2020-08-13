# Minimal WebSocket Server

This is a WebSocket server written with Express and socket.io. It expects a running Redis instance providing a pub/sub mechanism to coordinate between multiple servers.

It is meant to deployed as an AWS ECS cluster using AWS Fargate. As such, it includes a `Dockerfile` so that an image can be built and uploaded to e.g. [Docker Hub](https://hub.docker.com/). A public image of this app can be found [here](https://hub.docker.com/repository/docker/catherinemond/river-demo-redis). It is currently used for River beta deployment.

### Push your image to Docker Hub

Once you've made sure the app works locally, you're ready to upload your image to Docker Hub. Make sure to go back to the `server.js` file and have the server listen on **port 80**: this is what is needed for deployment.

After you've made the changes, go ahead and create a new Docker image by running the command: `docker build -t your-image-name .`

To push your image to Docker Hub:

- First, you need to tag your image: `docker image tag your-image-name your-username/your-image-name:latest`
- Make sure you're connected to Docker Hub by issuing `docker login` from your terminal.
- Finally, push the image with `docker push your-username/your-image-name:latest`

Be sure to take note of your repository name and make it public! This image will be needed to deploy your ECS cluster with Fargate.

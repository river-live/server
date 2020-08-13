# WebSocket Server

This is a WebSocket server written with Express and [socket.io](https://socket.io/). It expects a running Redis instance providing a pub/sub mechanism to coordinate between multiple servers.

It is meant to be deployed as an AWS ECS cluster using [AWS Fargate](https://aws.amazon.com/fargate/). As such, it includes a `Dockerfile` so that an image can be built and uploaded to e.g. [Docker Hub](https://hub.docker.com/). A public image of this app can be found [here](https://hub.docker.com/repository/docker/catherinemond/river-demo-redis). It is currently used for River beta deployment.

If you're using River as is, there is nothing you need to do! This repository simply lets you have a look at what's going on inside your WebSocket server.

### Push your image to Docker Hub

**Note: this step is needed only if you fork and modify the River project.**

This is an open source project, feel free to fork it and modify it!

If you make changes to the WebSocket server, you will need to create a new Docker image and upload it to Docker Hub. Make sure to have the server listen on **port 80**: this is what is needed for deployment.

After you've made the changes, go ahead and create a new Docker image by running the command: `docker build -t your-image-name .`

To push your image to Docker Hub:

- First, you need to tag your image: `docker image tag your-image-name your-username/your-image-name:latest`
- Make sure you're connected to Docker Hub by issuing `docker login` from your terminal.
- Finally, push the image with `docker push your-username/your-image-name:latest`

Be sure to take note of your repository name and make it public! This image will be needed to deploy your ECS cluster with Fargate. Instructions can be found in the River [deploy repo](https://github.com/river-live/deploy) on how to use your Docker image within the CDK files.

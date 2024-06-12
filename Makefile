.PHONY: build-image
build-image:
	- docker build --platform linux/amd64 -t lambda-docker:0 .

.PHONY: run-locally
run-locally:
	- docker run --platform linux/amd64 -p 9000:8080 lambda-docker:0

.PHONY: build-and-run
build-and-run:
	- docker build --platform linux/amd64 -t lambda-docker:0 .
	- docker run --platform linux/amd64 -p 9000:8080 lambda-docker:0

.PHONY: build-compose
build-compose:
	-  docker-compose up --build

.PHONY: kill-local
kill-local:
	- docker stop lambda-docker:0
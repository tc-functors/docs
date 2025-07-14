all: build

build:
	npm start

release:
	npm run build

deps:
	npm install

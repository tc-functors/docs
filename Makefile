all: build

build:
	npm start

release:
	npm run build
	cp CNAME docs/

deps:
	npm install

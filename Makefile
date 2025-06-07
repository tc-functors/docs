all: build

build:
	cd src/docs && make
	cd src/site && cp -r * ../../

run:
	python -m http.server

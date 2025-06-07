all: build

build:
	cd src/docs && make
	cd src/site && cp -r * ../../dist/
	cp CNAME dist/

run:
	python -m http.server

all: build

build:
	cd src/docs && make

run:
	python -m http.server

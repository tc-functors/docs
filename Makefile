all: build

build:
	cd docs-src && make

run:
	cd dist && python -m http.server

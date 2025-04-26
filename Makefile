all: build

build:
	cd docs-src && make

run:
	python -m http.server

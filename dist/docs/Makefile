all: build

build:
	mkdir -p ../../dist/docs && mdbook build --dest-dir ../../dist/docs

run:
	mdbook serve --open --dest-dir ../../dist/docs

deps:
	cargo install mdbook --version 0.4.36
	cargo install mdbook-admonish
	cargo install mdbook-mermaid
	cargo install mdbook-toc
	mdbook-admonish install

clean:
	rm -rf dist

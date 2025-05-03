all: build

build:
	mdbook build --dest-dir ../docs

run:
	mdbook serve --open --dest-dir ../docs

deps:
	cargo install mdbook --version 0.4.36
	cargo install mdbook-admonish
	cargo install mdbook-mermaid
	cargo install mdbook-toc
	cargo install mdbook-embedify
	mdbook-admonish install

clean:
	rm -rf dist

# tamariba

## Tools required

- VSCode
- Docker

For the following tools, recommended to install using [asdf](https://asdf-vm.com).

- pnpm
- Node.js
- direnv

## commands

### Setup

```sh
cp .sample.envrc .envrc
direnv allow
make setup
```

### Start dev server

```sh
make dev
```

## Creating migration file

```sh
pnpm prisma:migrate --name migration_file_name
```

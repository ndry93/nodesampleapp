# nodesampleapp




## Conventions

### File Name

We prefer hyphens (kebab-case) **this-file-name** vs underscores (snake_case) this_file_name

## Development

Prerequisite

-   VSCode
-   Installed Docker
-   Node LTS
-   docker-compose newer than version 1.17.3

### Start development environment

-   Create `.env` file or run `cp .env.example .env`
-   Create `.npmrc` file or run `cp .npmrc.example .npmrc`

You can look for the example in the `.env.example` and `.npmrc.example`. Paste the actual token in newly created `.npmrc` file.

`.npmrc.example` will be where you would put non sensitive npm configs that you would like to be shared across your team.

Next up you can choose to run your development environment entirely inside Docker or to run the app server directly on your local machine.

#### Running app server inside Docker

-   Start the development cluster

```bash
docker-compose up -d
```

-   View consolidated logs via Docker Compose

```bash
docker-compose logs -f
```

-   Log into app container

```bash
# the command below will open a shell session inside our app container
docker exec -it nodesampleapp sh
# this is for executing CLI in dev env, for i.e. DB migration command like below
npm run migration:run
```

-   Shutdown development cluster

```bash
docker-compose down
```

#### Running app server directly on your local machine's environment

-   Start the db service in Docker

```bash
docker-compose up -d postgres
```

-   Start your app server

```bash
npm run start:dev
# you might also want to migrate the DB with this command below
npm run migration:run
```

-   Shutdown development cluster

```bash
docker-compose down
```

## Testing

Prerequisite

-   Installed Docker
-   Node LTS

### Run the test

Tests are split into two types

-   unit: which does not requires db instance
-   integration: which requires db instance

In order to run both unit and integration test use: `npm run test:all`

In order to run unit test only use: `npm run test`

In order to run `integration tests`, you need to have a local postgresql running for your test environment:

```bash
# dockest runs a test postgres container for your tests and run migrations for you before starting the test
# dockest will also spin the container down automatically and all data will be wiped clean
npm run test-integration:dockest
```

If you want to do TDD, run the test in watch mode or simply running the test without dockest, you can spin up the test postgres containers

```bash
# Start the test postgres container
docker-compose -f docker-compose.test.yml up -d

# Update the .env file to point to ports 54320 for the test postgres container
npm run migration:run

# Run the test
npm run test
```

## Database migration

Before continuing, please learn about the fundamentals of migration with TypeORM [here](https://medium.com/better-programming/typeorm-migrations-explained-fdb4f27cb1b3)

### On first time setting up the DB

Run migration

```bash
npm run migration:run
```

### If you made new changes to the db

Modifying columns in entities, or adding new entities (migration file is a class, start with CapitalLetter) Please refer to 1571751456489-Init.ts for changes to be made to the migration file to satisfy linting rules

It's a good idea to generate a new migration for every atomic changes made to the db

Generate migration

```bash
npm run migration:generate -- -n <migration-name> # eg. add-disbursement-column
```

### If you made a mistake on running migration

Revert will revert migration file by file

Revert migration

```bash
npm run migration:revert
```

### If you need a manual migration

For eg you need to add new extensions or simply custom migration

Create migration

```bash
npm run migration:create -- -n <MigrationName>
```
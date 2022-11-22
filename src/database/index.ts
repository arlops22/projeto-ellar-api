import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "projeto_ellar",
    migrationsRun: false,
    // synchronize: true,
    entities: [
        "src/app/models/*.ts"
    ],
    migrations: [
        "src/database/migrations/*.ts"
    ]
})

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource
    .initialize()
    .then(() => {
        console.log('Database successfully connected!!')
    })
    .catch((error) => console.log(error))

import "reflect-metadata";
import { DataSource } from "typeorm";

console.log('env', process.env.NODE_ENV)

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
        process.env.NODE_ENV === "prod"
        ? "build/app/models/*.{js,ts}"
        : "src/app/models/*.{js,ts}"
    ],
    migrations: [
        process.env.NODE_ENV === "prod"
        ? "build/database/migrations/*.{js,ts}"
        : "src/database/migrations/*.{js,ts}"
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

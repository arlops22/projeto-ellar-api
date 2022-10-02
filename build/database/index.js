"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Places_1 = require("../models/Places");
var AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "admin",
    database: "projeto-ellar",
    entities: [Places_1.Places],
    synchronize: true,
    logging: false,
});
// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    .then(function () {
    // here you can start to work with your database
})
    .catch(function (error) { return console.log(error); });
//# sourceMappingURL=index.js.map
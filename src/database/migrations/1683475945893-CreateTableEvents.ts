import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateTableEvents1683475945893 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'event',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'name',
                        type: 'varchar'
                    },
                    {
                        name: 'description',
                        type: 'varchar'
                    },
                    {
                        name: 'event_addressId',
                        type: 'int',
                        isNullable: true
                    },
                    {
                        name: 'event_categoryId',
                        type: 'int',
                        isNullable: true
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: 'event_address',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'cep',
                        type: 'varchar'
                    },
                    {
                        name: 'address',
                        type: 'varchar'
                    },
                    {
                        name: 'complement',
                        type: 'varchar'
                    },
                    {
                        name: 'neighborhood',
                        type: 'varchar'
                    },
                    {
                        name: 'number',
                        type: 'varchar'
                    },
                    {
                        name: 'city',
                        type: 'varchar'
                    },
                    {
                        name: 'state',
                        type: 'varchar'
                    },
                    {
                        name: 'latitude',
                        type: 'float8'
                    },
                    {
                        name: 'longitude',
                        type: 'float8'
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: 'event_category',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'name',
                        type: 'varchar'
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "event",
            new TableForeignKey({
                columnNames: ["event_addressId"],
                referencedColumnNames: ["id"],
                referencedTableName: "event_address",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "event",
            new TableForeignKey({
                columnNames: ["event_categoryId"],
                referencedColumnNames: ["id"],
                referencedTableName: "event_category",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'event_image',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'path',
                        type: 'varchar'
                    },
                    {
                        name: 'eventId',
                        type: 'int'
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "event_image",
            new TableForeignKey({
                columnNames: ["eventId"],
                referencedColumnNames: ["id"],
                referencedTableName: "event",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'event_disponibility',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'date',
                        type: 'varchar'
                    },
                    {
                        name: 'start_time',
                        type: 'varchar'
                    },
                    {
                        name: 'end_time',
                        type: 'varchar'
                    },
                    {
                        name: 'eventId',
                        type: 'int'
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "event_disponibility",
            new TableForeignKey({
                columnNames: ["eventId"],
                referencedColumnNames: ["id"],
                referencedTableName: "event",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const event_table = await queryRunner.getTable("event")
        
        const address_foreign_key = event_table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("event_addressId") !== -1,
        )
        if (address_foreign_key) {
            await queryRunner.dropForeignKey("event", address_foreign_key)
        }
        const category_foreign_key = event_table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("event_categoryId") !== -1,
        )
        if (category_foreign_key) {
            await queryRunner.dropForeignKey("event", category_foreign_key)
        }

        const image_table = await queryRunner.getTable("event_image")
        const imageForeignKey = image_table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("eventId") !== -1,
        )
        if (imageForeignKey) {
            await queryRunner.dropForeignKey("event_image", imageForeignKey)
        }

        const disponibility_table = await queryRunner.getTable("event_disponibility")
        const disponibilityForeignKey = disponibility_table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("eventId") !== -1,
        )
        if (disponibilityForeignKey) {
            await queryRunner.dropForeignKey("event_disponibility", disponibilityForeignKey)
        }
        
        await queryRunner.dropTable('event_disponibility');
        await queryRunner.dropTable('event_image');

        await queryRunner.dropTable('event_address');
        await queryRunner.dropTable('event_category');
        await queryRunner.dropTable('event');
    }

}

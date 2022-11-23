import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateTablePlacesSchedules1669154680751 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'places_schedules',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'weekDate',
                        type: 'int'
                    },
                    {
                        name: 'openingTime',
                        type: 'varchar'
                    },
                    {
                        name: 'closeTime',
                        type: 'varchar'
                    },
                    {
                        name: 'placeId',
                        type: 'int'
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "places_schedules",
            new TableForeignKey({
                columnNames: ["placeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "places",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("places_schedules")
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("placeId") !== -1,
        )
        if (foreignKey) {
            await queryRunner.dropForeignKey("places_schedules", foreignKey)
        }
        await queryRunner.dropTable('places_schedules');
    }

}

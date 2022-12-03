import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateTablePlacesSchedules1669154680751 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'place_schedule',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'week_date',
                        type: 'int'
                    },
                    {
                        name: 'opening_time',
                        type: 'varchar'
                    },
                    {
                        name: 'close_time',
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
            "place_schedule",
            new TableForeignKey({
                columnNames: ["placeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "place",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("place_schedule")
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("placeId") !== -1,
        )
        if (foreignKey) {
            await queryRunner.dropForeignKey("place_schedule", foreignKey)
        }
        await queryRunner.dropTable('place_schedule');
    }

}

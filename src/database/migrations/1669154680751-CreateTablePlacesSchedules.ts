import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateTablePlacesDisponibilites1669154680751 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'place_disponibility',
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
            "place_disponibility",
            new TableForeignKey({
                columnNames: ["placeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "place",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("place_disponibility")
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("placeId") !== -1,
        )
        if (foreignKey) {
            await queryRunner.dropForeignKey("place_disponibility", foreignKey)
        }
        await queryRunner.dropTable('place_disponibility');
    }

}

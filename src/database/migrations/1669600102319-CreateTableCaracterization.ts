import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateTableCaracterization1669600102319 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'place_caracterization',
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

        await queryRunner.createTable(
            new Table({
                name: 'place_caracterizations_place_caracterization',
                columns: [
                    {
                        name: 'placeId',
                        type: 'int',
                        isPrimary: true
                    },
                    {
                        name: 'placeCaracterizationId',
                        type: 'int',
                        isPrimary: true
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "place_caracterizations_place_caracterization",
            new TableForeignKey({
                columnNames: ["placeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "place",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "place_caracterizations_place_caracterization",
            new TableForeignKey({
                columnNames: ["placeCaracterizationId"],
                referencedColumnNames: ["id"],
                referencedTableName: "place_caracterization",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("place_caracterizations_place_caracterization")
        const placesForeignKey = table?.foreignKeys.find(
            (fk) => (fk.columnNames.indexOf("placeId") !== -1),
        )
        if (placesForeignKey) {
            await queryRunner.dropForeignKey("place_caracterizations_place_caracterization", placesForeignKey)
        }
        const caracterizationForeignKey = table?.foreignKeys.find(
            (fk) => (fk.columnNames.indexOf("placeCaracterizationId") !== -1),
        )
        if (caracterizationForeignKey) {
            await queryRunner.dropForeignKey("place_caracterizations_place_caracterization", caracterizationForeignKey)
        }
        await queryRunner.dropTable('place_caracterizations_place_caracterization');
        await queryRunner.dropTable('place_caracterization');
    }

}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateTableCaracterization1669600102319 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'caracterizations',
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
                name: 'places_caracterizations',
                columns: [
                    {
                        name: 'placesId',
                        type: 'int',
                        isPrimary: true
                    },
                    {
                        name: 'caracterizationsId',
                        type: 'int',
                        isPrimary: true
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "places_caracterizations",
            new TableForeignKey({
                columnNames: ["placesId"],
                referencedColumnNames: ["id"],
                referencedTableName: "places",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "places_caracterizations",
            new TableForeignKey({
                columnNames: ["caracterizationsId"],
                referencedColumnNames: ["id"],
                referencedTableName: "caracterizations",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("places_caracterizations")
        const placesForeignKey = table?.foreignKeys.find(
            (fk) => (fk.columnNames.indexOf("placesId") !== -1),
        )
        if (placesForeignKey) {
            await queryRunner.dropForeignKey("places_caracterizations", placesForeignKey)
        }
        const caracterizationForeignKey = table?.foreignKeys.find(
            (fk) => (fk.columnNames.indexOf("caracterizationsId") !== -1),
        )
        if (caracterizationForeignKey) {
            await queryRunner.dropForeignKey("places_caracterizations", caracterizationForeignKey)
        }
        await queryRunner.dropTable('places_caracterizations');
        await queryRunner.dropTable('caracterizations');
    }

}

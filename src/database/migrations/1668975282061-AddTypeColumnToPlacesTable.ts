import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm"

export class AddTypeColumnToPlacesTable1668975282061 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'types',
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

        await queryRunner.addColumn(
            'places',
            new TableColumn({
                name: "typeId",
                type: "int",
                isNullable: true
            }),
        );

        await queryRunner.createForeignKey(
            "places",
            new TableForeignKey({
                columnNames: ["typeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "types",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("places")
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("typeId") !== -1,
        )
        if (foreignKey) {
            await queryRunner.dropForeignKey("places", foreignKey)
        }
        await queryRunner.dropTable('types');
    }

}

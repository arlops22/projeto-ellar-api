import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm"

export class AddTypeColumnToPlacesTable1668975282061 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'type',
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
            "place",
            new TableColumn({
                name: 'typeId',
                type: 'int',
                isNullable: true
            }),
        );

        await queryRunner.createForeignKey(
            "place",
            new TableForeignKey({
                columnNames: ["typeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "type",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("place")
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("typeId") !== -1,
        )
        if (foreignKey) {
            await queryRunner.dropForeignKey("place", foreignKey)
        }
        await queryRunner.dropTable('type');
    }

}

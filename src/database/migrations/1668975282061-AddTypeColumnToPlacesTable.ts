import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm"

export class AddTypeColumnToPlacesTable1668975282061 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'place_type',
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
                        name: 'type_imageId',
                        type: 'int',
                        isNullable: true
                    }
                ]
            })
        );

        await queryRunner.addColumn(
            "place",
            new TableColumn({
                name: 'placeTypeId',
                type: 'int',
                isNullable: true
            }),
        );

        await queryRunner.createForeignKey(
            "place",
            new TableForeignKey({
                columnNames: ["placeTypeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "place_type",
                onDelete: "CASCADE",
            }),
        );
        
        await queryRunner.createTable(
            new Table({
                name: 'type_image',
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
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "place_type",
            new TableForeignKey({
                columnNames: ["type_imageId"],
                referencedColumnNames: ["id"],
                referencedTableName: "type_image",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("place")
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("placeTypeId") !== -1,
        )
        if (foreignKey) {
            await queryRunner.dropForeignKey("place", foreignKey)
        }

        const type_image_table = await queryRunner.getTable("type_image")
        const imageForeignKey = type_image_table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("type_imageId") !== -1,
        )
        if (imageForeignKey) {
            await queryRunner.dropForeignKey("type_image", imageForeignKey)
        }
        await queryRunner.dropTable('place_type');
    }

}

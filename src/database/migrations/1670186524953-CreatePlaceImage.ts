import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreatePlaceImage1670186524953 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'place_image',
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
                        name: 'placeId',
                        type: 'int'
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "place_image",
            new TableForeignKey({
                columnNames: ["placeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "place",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("place_image")
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("placeId") !== -1,
        )
        if (foreignKey) {
            await queryRunner.dropForeignKey("place_image", foreignKey)
        }
        await queryRunner.dropTable('place_image');
    }

}

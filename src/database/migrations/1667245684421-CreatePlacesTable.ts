import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreatePlacesTable1667245684421 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'place',
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
                        name: 'place_addressId',
                        type: 'int'
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: 'place_address',
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

        await queryRunner.createForeignKey(
            "place",
            new TableForeignKey({
                columnNames: ["place_addressId"],
                referencedColumnNames: ["id"],
                referencedTableName: "place_address",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("place")
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("place_addressId") !== -1,
        )
        if (foreignKey) {
            await queryRunner.dropForeignKey("place", foreignKey)
        }
        await queryRunner.dropTable('place_address');
        await queryRunner.dropTable('place');
    }

}
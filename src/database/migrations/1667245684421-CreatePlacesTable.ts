import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreatePlacesTable1667245684421 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'places',
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
                        name: 'category',
                        type: 'varchar'
                    },
                    {
                        name: 'addressId',
                        type: 'int'
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: 'places_address',
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
                        type: 'float4'
                    },
                    {
                        name: 'longitude',
                        type: 'float4'
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "places",
            new TableForeignKey({
                columnNames: ["addressId"],
                referencedColumnNames: ["id"],
                referencedTableName: "places_address",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("places")
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("addressId") !== -1,
        )
        if (foreignKey) {
            await queryRunner.dropForeignKey("places", foreignKey)
        }
        await queryRunner.dropTable('places_address');
        await queryRunner.dropTable('places');
    }

}
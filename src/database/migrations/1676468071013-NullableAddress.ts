import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class NullableAddress1676468071013 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'place',
            'place_addressId',
            new TableColumn({
                name: 'place_addressId',
                type: 'int',
                isNullable: true
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('place');
    }

}

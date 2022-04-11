import {MigrationInterface, QueryRunner} from "typeorm";

export class userScore1649688529344 implements MigrationInterface {
    name = 'userScore1649688529344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "score" numeric(21,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "score"`);
    }

}

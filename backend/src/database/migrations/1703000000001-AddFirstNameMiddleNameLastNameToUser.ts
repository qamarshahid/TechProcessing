import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFirstNameMiddleNameLastNameToUser1703000000001 implements MigrationInterface {
  name = 'AddFirstNameMiddleNameLastNameToUser1703000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "first_name" VARCHAR(255),
      ADD COLUMN "middle_name" VARCHAR(255),
      ADD COLUMN "last_name" VARCHAR(255)
    `);

    // Migrate existing full_name data to the new columns
    await queryRunner.query(`
      UPDATE "users" 
      SET 
        "first_name" = CASE 
          WHEN position(' ' in "full_name") > 0 THEN split_part("full_name", ' ', 1)
          ELSE "full_name"
        END,
        "last_name" = CASE 
          WHEN position(' ' in "full_name") > 0 THEN 
            CASE 
              WHEN array_length(string_to_array("full_name", ' '), 1) > 2 THEN 
                array_to_string(array_remove(string_to_array("full_name", ' '), split_part("full_name", ' ', 1)), ' ')
              ELSE split_part("full_name", ' ', 2)
            END
          ELSE ''
        END,
        "middle_name" = CASE 
          WHEN array_length(string_to_array("full_name", ' '), 1) > 2 THEN split_part("full_name", ' ', 2)
          ELSE ''
        END
    `);

    // Make first_name and last_name required
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "first_name" SET NOT NULL,
      ALTER COLUMN "last_name" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reconstruct full_name from the separate fields
    await queryRunner.query(`
      UPDATE "users" 
      SET "full_name" = TRIM(
        CONCAT_WS(' ', 
          "first_name", 
          CASE WHEN "middle_name" IS NOT NULL AND "middle_name" != '' THEN "middle_name" ELSE '' END,
          "last_name"
        )
      )
    `);

    // Remove the new columns
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "first_name",
      DROP COLUMN "middle_name", 
      DROP COLUMN "last_name"
    `);
  }
}

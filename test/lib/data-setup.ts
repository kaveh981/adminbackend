import "reflect-metadata";

import { injectable, inject } from 'inversify';
import { Employees, Roles, Menus, Users } from '../../model-layer';
import { QueryBuilder } from './exporter';
import * as Knex from 'knex';

@injectable()
class DataSetup {

    constructor( @inject('QueryBuilder') private repo: QueryBuilder) { }

    private suffix: string = `_backup`;
    private tables: [string] = ['employees', 'roles', 'menus', 'users','roles_employees_employees'];
    /**
     * Backup table Check if the table not exist return if the backup table exist return otherwise it create a backup table and copy from original into it then clear the original table
     * @param table - The name of the table that we want to backup.
     * @param suffix - The backup table name suffix which is optional and defaults to constant config.suffix
     * @returns A promise.
     */
    public async backupTable(table: string, suffix: string = this.suffix) {

        let newTable = table + suffix;
        console.log('Backing up table ' + table + '...');
        let hasBackup = await this.repo.getKnex().schema.hasTable(newTable);
        let hasTale = await this.repo.getKnex().schema.hasTable(table);


        if (!hasTale) {
            console.log(`Table ${table} could not be found.`);
            return;
        }

        if (hasBackup) {
            console.log(`Table ${table} is already backed up.`);
            return;
        }

        await this.repo.getKnex().transaction(async (trans) => {
            await trans.raw('SET foreign_key_checks=0');
            await trans.raw(`DROP TABLE IF EXISTS ${newTable}`);
            await trans.raw(`CREATE  TABLE ${newTable} AS SELECT * FROM ${table}`);
            await trans.raw('SET foreign_key_checks=1');
        });

        await this.clearTable(table);
        console.log(`Backed up table ${table}.`);

    }

    /**
     * Check if the backup table exist clears the original table.
     * @param table - The name of the table that we want to clear.
     * @param suffix - The clear table name suffix which is optional and defaults to constant BKP_SUFFIX.
     * @returns A promise.
     */
    public async clearTable(table: string, suffix: string = this.suffix) {

        let backup = table + suffix;

        let hasTable = await this.repo.getKnex().schema.hasTable(backup)

        if (!hasTable) {
            console.log('Backup table ' + backup + ' is not found. It is not safe to clear the table.');
            throw new Error('Table is missing.');
        }

        await this.repo.getKnex().transaction(async (trans) => {
            await trans.raw('SET foreign_key_checks=0');
            await trans.raw(`TRUNCATE ${table} `);
            await trans.raw('SET foreign_key_checks=1');
        });

    };

    /**
        * Restore a table.
        * @param table - The name of the table that we want to restore.
        * @param suffix - The backup table name suffix which is optional and defaults to constant BKP_SUFFIX.
        * @returns A promise.
        */
    public async restoreTable(table: string, suffix: string = this.suffix) {

        let backup = table + suffix;

        let hasBackup = await this.repo.getKnex().schema.hasTable(backup);
        let hasTable = await this.repo.getKnex().schema.hasTable(table);

        console.log('Restoring table ' + table + '...');

        if (!hasBackup) {
            console.log(`Back up table ${backup} could not be found.`);
            return;
        }

        if (!hasTable) {
            console.log(`Table ${backup} could not be found.`);
            return;
        }

        await this.clearTable(table);
        await this.repo.getKnex().transaction(async (trans) => {
            await trans.raw('SET foreign_key_checks=0');
            await trans.raw(`INSERT INTO ${table} SELECT * FROM ${backup}`);
            await trans.raw(`DROP TABLE ${backup}`);
            await trans.raw('SET foreign_key_checks=1');
        });

        console.log(`Restored table ${table}.`);

    }

    /**
     * Restore an array of tables.
     * @param [tables] - The name of tables that we want to restore.
     * @param suffix - The backup table name suffix which is optional and defaults to constant BKP_SUFFIX.
     * @returns A promise.
     */
    public async restoreTables(tables: string[] = this.tables, suffix: string = this.suffix) {

        await Promise.all(tables.map(async (table) => {
            await this.restoreTable(table, suffix);
        }));

    }

    /**
 * Clear an array of tables.
 * @param [tables] - The name of tables that we want to clear.
 * @param suffix - The clear table name suffix which is optional and defaults to constant BKP_SUFFIX.
 * @returns A promise.
 */
    public async clearTables(tables: string[] = this.tables, suffix: string = this.suffix) {

        await Promise.all(tables.map(async (table) => {
            await this.clearTable(table, suffix);
        }));

    }

    /**
 * Backup an array of tables.
 * @param [tables] - The name of tables that we want to backup.
 * @param suffix - The backup table name suffix which is optional and defaults to constant BKP_SUFFIX.
 * @returns A promise.
 */
    public async backupTables(tables: string[] = this.tables, suffix: string = this.suffix) {

        await Promise.all(tables.map(async (table) => {
            await this.backupTable(table, suffix);
        }));

    }

    public async testQuery() {
        await this.repo.getKnex().schema.dropTableIfExists('photo');
        let result =
            await this.repo.getKnex().schema.hasTable('users').then(function (exists) {
                if (!exists) {
                    console.log('not exist');
                }
            });
    }

}
export { DataSetup }


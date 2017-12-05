'use strict';

/** npm test -- -d /employees  */
/** node_modules */
// import 'reflect-metadata';
import * as program from 'commander';
import * as path from 'path';
const keypress = require('keypress');

/** Lib */
import { container, SuiteHandler, DataSetup } from './lib/exporter';


program.version('1.0.0')
    .option('-d, --directory [dir]', 'The directory which houses the tests.')
    .option('-r, --regex [regex]', 'A regular expression matching the test name.')
    .option('-b, --restore', 'Restore the database.')
    .option('-f --file [file]', 'Run the tests exported in a given file.')
    .parse(process.argv);

keypress(process.stdin);

let suiteManager: SuiteHandler;
let killCount: number = 0;
console.log(process.argv);
async function start() {
    let directory = program['directory'];
    let regex = program['regex'] && new RegExp(program['regex']);
    let restore = program['restore'];
    let file = program['file'];
    let testDirectory: string;
    //console.log(JSON.stringify(program['options']));

    if (!directory && !file && !restore) {

        console.log('Please specify a file (-f) or directory (-d).');
        process.exit(1);
    }

    if (file) {
        testDirectory = file;
    } else if (directory) {

        testDirectory = path.join('/test-cases', directory);

    }

    let dataSetup = container.get<DataSetup>('DataSetup');

   await dataSetup.backupTables();

    if (!restore) {
        suiteManager = new SuiteHandler(dataSetup, testDirectory, regex);
        await suiteManager.runSuite().catch(e => console.log(e));
    }

   await dataSetup.restoreTables();
    process.exit(0);

}

process.stdin.on('keypress', (ch, key) => {
    if (key && key.ctrl && key.name === 'c') {
        killCount++;

        if (suiteManager) {
            suiteManager.stopTesting();
        }

        if (killCount >= 3) {
            process.exit(1);
        }
    }
});

process.stdin['setRawMode'](true);
process.stdin.resume();

process.on('uncaughtException', () => { process.exit(1); });

start();


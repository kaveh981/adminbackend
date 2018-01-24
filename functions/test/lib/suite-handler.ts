'use strict';

/** node_modules */
import * as path from 'path';
import * as test from 'tape';
import * as fs from 'fs';
import Finder = require("fs-finder");

/** Lib */
import { TestHandler, DataSetup } from './exporter';

interface ITestCaseFunction {
    (assert: test.Test): Promise<void>;
}

/**
 * SuiteManager class. Loads all test files in the specified folder and includes any test cases that match a RegExp
 */
import { injectable, inject } from 'inversify';


@injectable()
class SuiteHandler {

    public shuttingDown: boolean = false;

    private testsPath: string;
    private regex: RegExp;
    private testCases: TestHandler[] = [];

    /**
     * Instance constructor. Assigns params and loads test cases
     * @param testsPath - the path to load tst files from
     * @param regex - the regular expression to describe test cases to load
     */
    constructor( @inject('DataSetup') private dataSetup: DataSetup, testsPath: string, regex: RegExp = /\.*/) {
        this.regex = regex;
        this.testsPath = path.join(__dirname, '../', testsPath);
        this.loadTests();
    }

    /**
     * Loads tests described by this test suite
     */
    private loadTests() {
        console.log('Tests are loaded from this directory: ' + this.testsPath);
        let testFiles: string[];
        // check if the path is a directory takes all files in that directory else takes the file itself
        if (fs.lstatSync(this.testsPath).isDirectory()) {
            testFiles = Finder.from(this.testsPath).findFiles('*.test.<[jt]>s');
        } else {
            testFiles = [this.testsPath];
        }
        testFiles.forEach((testFile: string) => {

            let fileExports: any = require(testFile);
            for (let testName in fileExports) {
                if (this.regex.test(testName)) {
                    let exported: ITestCaseFunction | ITestCaseFunction[] = fileExports[testName];

                    if (Array.isArray(exported)) {
                        exported.forEach((testFunction: ITestCaseFunction, i) => {
                            let testCase = new TestHandler(this.dataSetup, `${testName}_${('0' + (i + 1)).slice(-2)}`, testFunction);
                            this.testCases.push(testCase);
                        });
                    } else {
                        let testCase = new TestHandler(this.dataSetup, testName, exported);
                        this.testCases.push(testCase);
                    }
                }
            }

        });

    }

    /**
     * Runs all test cases loaded by calling runTest() on each of the testCases
     */
    public async runSuite() {

        for (let i = 0; i < this.testCases.length; i += 1) {

            // We are interrupting SIGINT, so we need to manually stop the testing.
            if (this.shuttingDown) {
                break;
            }

            let testCase = this.testCases[i];

            try {
                await testCase.runTest();
            } catch (error) {
                console.log(error);

                // DB errors include this message, so we can't continue.
                if (error.message.indexOf('cannot accept work') !== -1) {
                    break;
                }
            }
        }

    }

    public stopTesting() {
        this.shuttingDown = true;
    }

}

export { SuiteHandler }

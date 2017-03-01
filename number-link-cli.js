#! /usr/bin/env NODE_PATH=./lib node

// const cli_opt = require("commander");
// const this_package = require("./package.json");
const NumberLink = require("./lib/number-link");

/*
cli_opt.version(this_package.version)
    .usage("[-d] [-l limit] [puzzle]")
    .option("-d --debug", "Debug mode")
    .option("-l --limit [limit]", "limit of attempt count", parseInt)
    .on('--help', function() {
        console.log("  if puzzle is not specified, please input puzzle from stdin\n");
        console.log("  Puzzle format: <w>x<h>:<grid>");
        console.log("       w: width");
        console.log("       h: height");
        console.log("    grid: number and dot\n");
        console.log("  Puzzle example: 6x6:3......4.31........2.....1.4.2......\n")
    });

cli_opt.parse(process.argv);

puzzle = cli_opt.args.shift();
console.log(`Puzzle: ${puzzle}`);
*/

// const PUZZLE = "6x6:3......4.31........2.....1.4.2......";
// const PUZZLE = "10x10:12...........24.....35....63.............67....................51.................................74";
const PUZZLE = "10x10:1...................................2.......3...4................1.....5......3..2................45";

let start = Date.now();
matrix = NumberLink.initialize(PUZZLE);
console.log("-------- Puzzle --------")
NumberLink.showInConsole(matrix);

matrix = NumberLink.solve(matrix);
if (matrix !== null) {
    let spend_time = Date.now() - start;
    console.log("-------- Solved --------")
    NumberLink.showInConsole(matrix);
    console.log(`Time: ${spend_time / 1000} ms`);
} else {
    console.log("Unable to solve...");
}

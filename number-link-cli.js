#! /usr/bin/env NODE_PATH=./lib node

const cli_opt = require("commander");
const this_package = require("./package.json");
const NumberLink = require("./lib/number-link");

const solve = (puzzle) => {
    let start = Date.now();
    let matrix = NumberLink.initialize(puzzle);
    console.log("-------- Puzzle --------");
    NumberLink.showInConsole(matrix);

    matrix = NumberLink.solve(matrix);
    if (matrix !== null) {
        let spend_time = Date.now() - start;
        console.log("-------- Solved --------");
        NumberLink.showInConsole(matrix);
        console.log(`Time: ${spend_time / 1000} ms`);
    } else {
        console.log("Unable to solve...");
    }
    process.exit();
};

cli_opt.version(this_package.version)
    .usage("[puzzle]")
    .on('--help', function() {
        console.log("  if puzzle is not specified, please input puzzle from stdin\n");
        console.log("  Puzzle format: <w>x<h>:<grid>");
        console.log("       w: width");
        console.log("       h: height");
        console.log("    grid: numbers and dots\n");
        console.log("  Puzzle example: 6x6:3......4.31........2.....1.4.2......\n")
    });

cli_opt.parse(process.argv);

puzzle = cli_opt.args.shift();

if (puzzle !== undefined) {
    solve(puzzle);
} else {
    console.log("Please input puzzle.");

    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (user_input) => {
        puzzle = user_input.split(/\r?\n/)[0].replace(/^\s+/, '').replace(/\s+$/, '');
        if (puzzle !== "") {
            solve(puzzle)
        }
    });
}

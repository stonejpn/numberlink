'use strict';

const Logic = require("logic-solver");
const _ = require("underscore");

const Matrix = require("./matrix");
const Key = require("./element");
const ApplicationError = require("./application-error");

/**
 * NumberLink
 * @typedef {Object} Solver
 */
const NumberLink = {
    /**
     *
     * @param puzzle
     * @returns {Matrix}
     */
    initialize: (puzzle) => {
        let result = puzzle.match(/^(\d+)x(\d+):([\.1-9a-z]+)$/i);
        if (result === null) {
            throw new ApplicationError("Puzzle format is invalid.");
        }
        let width = parseInt(result[1]);
        let height = parseInt(result[2]);
        let grid = result[3];

        if (grid.length !== width * height) {
            throw new ApplicationError("Grid is too short.");
        }

        let matrix = new Matrix(width, height);
        matrix.parseGrid(grid);

        return matrix;
    },

    solve: (matrix) => {
        let logic = new Logic.Solver();
        let solution = matrix.constraints(logic).solve();;
        if (solution === null) {
            return null;
        }
        return matrix.solved(solution);
    },

    showInConsole: (matrix) => {
        let hr = "+";
        _.range(matrix.size.width).forEach((i) => {
            hr += "---";
            hr += (i === matrix.size.width - 1) ? "+" : "-";
        });

        console.log(hr);
        for (let y of _.range(matrix.size.height)) {
            let buffer = "|";
            let inner_hr = "|";
            for (let x of _.range(matrix.size.width)) {
                let key = Key.id(x, y);
                let value = matrix.elements[key];
                if (value === null) {
                    buffer += "   ";
                    inner_hr += "   ";
                    if (x < matrix.size.width - 1) {
                        buffer += " ";
                    }
                } else {
                    let {top, bottom, left, right} = matrix.isConnected(x, y);

                    if (left) {
                        buffer += "-";
                    } else {
                        buffer += " ";
                    }
                    if (matrix.isAnchor(key)) {
                        buffer += `${matrix.label(value)}`;
                    } else {
                        if (left && right) {
                            buffer += "-";
                        } else if (top && bottom) {
                            buffer += "|";
                        } else {
                            buffer += "+";
                        }
                    }

                    if (x < matrix.size.width - 1) {
                        if (right) {
                            buffer += "--";
                        } else {
                            buffer += "  ";
                        }
                    } else {
                        buffer += " ";
                    }

                    if (bottom) {
                        inner_hr += " | ";
                    } else {
                        inner_hr += "   "
                    }
                }
                if (x < matrix.size.width - 1) {
                    inner_hr += "+";
                }
            }
            buffer += "|";
            inner_hr += "|";
            console.log(buffer);
            if (y < matrix.size.height - 1) {
                console.log(inner_hr);
            }
        }
        console.log(hr + "\n");
    },
};

module.exports = NumberLink;

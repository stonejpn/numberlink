'use strict';

const Logic = require("logic-solver");
const _ = require("underscore");

const Matrix = require("./matrix");
const Key = require("./key");
const ApplicationError = require("./application-error");

/**
 * NumberLink
 * @typedef {Object} Solver
 */
const NumberLink = {
    initialize: (puzzle) => {
        let result = puzzle.match(/^(\d+)x(\d+):([\.1-9]+)$/);
        if (result === null) {
            throw new ApplicationError("Puzzle format is invalid.");
        }
        let width = parseInt(result[1]);
        let height = parseInt(result[2]);
        let grid = result[3];

        if (grid.length !== width * height) {
            throw new ApplicationError("Grid is too short.");
        }

        // Peerを作成
        Key.makePeers(width, height);

        let matrix = new Matrix(width, height);
        matrix.parseGrid(grid);

        return matrix;
    },

    solve: (matrix) => {
        let {logic, bit_map} = NumberLink.makeLogic(matrix);
        let solution = logic.solve();
        if (solution === null) {
            return null;
        }
        let solution_map = solution.getMap();

        matrix.eachElement((key, anchor_value) => {
            let bit = bit_map[key];
            matrix.setValue(key, solution.evaluate(bit));
        });

        return matrix;
    },

    /**
     * @param {Matrix} matrix
     */
    makeLogic: (matrix) => {
        let logic = new Logic.Solver();
        let {max_value, need_bits} = matrix.anchorStatus();
        let bit_map = {};

        const min_bit = Logic.constantBits(1);
        const max_bit = Logic.constantBits(max_value);

        // 一旦、すべてのElementのbitを作成
        matrix.eachElement((key, value) => {
            let elem_bit = Logic.variableBits(key, need_bits);

            Logic.greaterThanOrEqual(elem_bit, min_bit);
            Logic.lessThanOrEqual(elem_bit, max_bit);

            if (value !== null) {
                // Anchor
                logic.require(Logic.equalBits(elem_bit, Logic.constantBits(value)));
            }

            bit_map[key] = elem_bit;
        });

        // Peerの制約を付与
        matrix.eachElement((key, value) => {
            let peers = Key.Peers.get(key);
            let equals = [];
            if (value !== null) {
                // Anchor
                // 隣り合うどれか１つだけと同じ値
                for (let peer_key of peers) {
                    equals.push(Logic.equalBits(bit_map[key], bit_map[peer_key]))
                }
                logic.require(Logic.exactlyOne(equals));
            } else {
                // Blank
                // 「となりのElementと等しい」を作る
                for (let peer_key of peers) {
                    equals.push(Logic.equalBits(bit_map[key], bit_map[peer_key]))
                }
                if (equals.length === 2) {
                    // 角: 両方と同じ
                    logic.require(Logic.and(equals));
                } else if (equals.length === 3) {
                    // 辺: どれか一つと違う
                    let constraint = Logic.exactlyOne(
                        Logic.not(equals[0]),
                        Logic.not(equals[1]),
                        Logic.not(equals[2])
                    );
                    logic.require(constraint);
                } else {
                    //　どれか２つと同じ
                    let variation = [
                        [0, 1],
                        [0, 2],
                        [0, 3],
                        [1, 2],
                        [1, 3],
                        [2, 3]
                    ];
                    let constraints = [];
                    for (let [i1, i2] of variation) {
                        constraints.push(Logic.and(equals[i1], equals[i2]));
                    }
                    // variationのなかで、１つだけ成立する
                    logic.require(Logic.exactlyOne(constraints));
                }
            }
        });

        return {logic, bit_map};
    },

    showInConsole: (matrix) => {
        let hr = "+";
        _.range(0, matrix.width).forEach((i) => {
            hr += "---";
            hr += (i === matrix.width - 1) ? "+" : "-";
        });

        console.log(hr);
        for (let row of _.range(1, matrix.height + 1)) {
            let buffer = "|";
            let inner_hr = "|";
            for (let col of _.range(1, matrix.width + 1)) {
                let value = matrix.getValue(row, col);
                if (value === null) {
                    buffer += "   ";
                    inner_hr += "   ";
                    if (col < matrix.width) {
                        buffer += " ";
                    }
                } else {
                    let left = matrix.isConnectedLeft(row, col);
                    let right = matrix.isConnectedRight(row, col);
                    let top = matrix.isConnectedTop(row, col);
                    let bottom = matrix.isConnectedBottom(row, col);

                    if (left) {
                        buffer += "-";
                    } else {
                        buffer += " ";
                    }
                    if (matrix.isAnchor(row, col)) {
                        buffer += `${value}`;
                    } else {
                        if (left && right) {
                            buffer += "-";
                        } else if (left && (top || bottom)) {
                            buffer += "+";
                        } else if (right && (top || bottom)) {
                            buffer += "+";
                        } else {
                            buffer += "|";
                        }
                    }

                    if (col < matrix.width) {
                        if (matrix.isConnectedRight(row, col)) {
                            buffer += "--";
                        } else {
                            buffer += "  ";
                        }
                    } else {
                        buffer += " ";
                    }

                    if (matrix.isConnectedBottom(row, col)) {
                        inner_hr += " | ";
                    } else {
                        inner_hr += "   "
                    }
                }
                if (col < matrix.width) {
                    inner_hr += "+";
                }
            }
            buffer += "|";
            inner_hr += "|";
            console.log(buffer);
            if (row < matrix.height) {
                console.log(inner_hr);
            }
        }
        console.log(hr + "\n");
    },
};

module.exports = NumberLink;

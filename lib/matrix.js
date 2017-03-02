'use strict';

const Logic = require("logic-solver");
const _ = require("underscore");

const Key = require("./element");
const ApplicationError = require("./application-error");

/**
 * Matrix
 *
 * @property {Dimension} size
 * @property {ElementId[]} anchors
 * @property {Object.<ElementId, Number>} elements
 * @property {Object.<ElementId, ElementId[]>} peers
 * @property {Object.<String, Number>} labels
 * @property {Object.<ElementId, Bits>} bits;
 */
class Matrix {
    constructor(width, height) {
        this.size = {width, height};

        this.anchors = [];
        this.elements = {};
        this.peers = {};

        this.labels = {};
        this.bits = {};

        this.max_value = 0;
    }

    parseGrid(grid) {
        let next_value = 1;
        for (let y of _.range(this.size.height)) {
            let row_offset = y * this.size.width;
            for (let x of _.range(this.size.width)) {
                let c = grid[row_offset + x];
                let key = Key.id(x, y);

                this.elements[key] = null;

                if (c.match(/[\da-z]/i)) {
                    if (! this.labels.hasOwnProperty(c)) {
                        this.labels[c] = next_value;
                        next_value++;
                    }
                    let value = this.labels[c];
                    this.anchors.push(key);
                    this.elements[key] = value;
                }
                this.peers[key] = Element.peer(this.size, x, y);
            }
        }

        this.max_value = next_value - 1;
        let need_bits = Math.ceil(Math.log2(this.max_value));

        _.each(this.elements, (value, key) => {
            this.bits[key] = Logic.variableBits(key, need_bits);
        });
    }

    constraints(logic) {
        const min_bit = Logic.constantBits(1);
        const max_bit = Logic.constantBits(this.max_value);

        _.each(this.elements, (value, key) => {
            let equals = [];
            let peer_key;

            let curr_bit = this.bits[key];
            let is_anchor = this.isAnchor(key);

            // 最大値と最小値
            logic.require(Logic.greaterThanOrEqual(curr_bit, min_bit));
            logic.require(Logic.lessThanOrEqual(curr_bit, max_bit));

            // Anchorの値を固定
            if (is_anchor) {
                logic.require(Logic.equalBits(curr_bit, Logic.constantBits(value)));
            }

            // Peerの制約を付与
            // それぞれ「となりのElementと等しい」を作る
            for (peer_key of this.peers[key]) {
                equals.push(Logic.equalBits(curr_bit, this.bits[peer_key]))
            }

            if (is_anchor) {
                // Anchor
                // 隣り合うどれか１つだけと同じ値
                logic.require(Logic.exactlyOne(equals));
            } else {
                // Blank
                if (equals.length === 2) {
                    // 角: 両方と同じ
                    logic.require(Logic.and(equals));
                } else if (equals.length === 3) {
                    // 辺: ２つ同じ -> どれか一つと違う
                    logic.require(Logic.exactlyOne(
                        Logic.not(equals[0]),
                        Logic.not(equals[1]),
                        Logic.not(equals[2])
                    ));
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

        return logic;
    }

    solved(solution) {
        _.each(this.elements, (value, key) => {
            this.elements[key] = solution.evaluate(this.bits[key]);
        });
        return this;
    }

    isAnchor(key) {
        return this.anchors.includes(key);
    }

    isConnected(x, y) {
        let top = false, bottom = false, left = false, right = false;

        if (y > 0) {
            top = this.isEqual(Key.id(x, y), Key.id(x, y - 1));
        }
        if (y < this.size.height) {
            bottom = this.isEqual(Key.id(x, y), Key.id(x, y + 1));
        }
        if (x > 0) {
            left = this.isEqual(Key.id(x, y), Key.id(x - 1, y));
        }
        if (x < this.size.width) {
            right = this.isEqual(Key.id(x, y), Key.id(x + 1, y));
        }
        return {top, bottom, left, right};
    }

    isEqual(key1, key2) {
        return this.elements[key1] !== null && this.elements[key1] === this.elements[key2];
    }

    label(value) {
        return _.invert(this.labels)[value];
    }
}

module.exports = Matrix;

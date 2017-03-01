'use strict';

const _ = require("underscore");
const Key = require("./key");
const ApplicationError = require("./application-error");

/**
 * Matrix
 */
class Matrix {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.anchors = [];
        this.elements = {};
        this.max_anchor = 0;
    }

    parseGrid(grid) {
        for (let row of _.range(1, this.height + 1)) {
            let col = 1;
            let row_str = grid.substr((row - 1) * this.width, this.width);
            for (let c of row_str) {
                let key = Key.id(row, col);
                this.elements[key] = null;

                if (c.match(/\d/)) {
                    let value = parseInt(c);
                    this.anchors.push(key);
                    this.elements[key] = value;
                    if (value > this.max_anchor) {
                        this.max_anchor = value;
                    }
                }
                col++;
            }
        }
    }

    anchorStatus() {
        return {
            max_value: this.max_anchor,
            need_bits: Math.ceil(Math.log2(this.max_anchor + 1))
        };
    }

    isAnchor(row, col) {
        return this.anchors.includes(Key.id(row, col));
    }

    setValue(key, value) {
        this.elements[key] = value;
    }

    getValue(row, col) {
        return this.elements[Key.id(row, col)];
    }

    isConnectedTop(row, col) {
        if (row === 1) {
            return false;
        }
        return this.equals(Key.id(row, col), Key.id(row - 1, col));
    }
    isConnectedBottom(row, col) {
        if (row === this.height) {
            return false;
        }
        return this.equals(Key.id(row, col), Key.id(row + 1, col));
    }
    isConnectedLeft(row, col) {
        if (col === 1) {
            return false;
        }
        return this.equals(Key.id(row, col), Key.id(row, col - 1));
    }
    isConnectedRight(row, col) {
        if (col === this.width) {
            return false;
        }
        return this.equals(Key.id(row, col), Key.id(row, col + 1));
    }

    equals(key1, key2) {
        return this.elements[key1] !== null && this.elements[key1] === this.elements[key2];
    }

    eachElement(callback) {
        for (let row of _.range(1, this.height + 1)) {
            for (let col of _.range(1, this.width + 1)) {
                let key = Key.id(row, col);
                callback(key, this.elements[key]);
            }
        }
    }
}

module.exports = Matrix;

'use strict';

const {expect} = require("chai");
const Matrix = require("../lib/matrix");

describe("Matrix", () => {
    /**
     * @param {Matrix} matrix
     * @param {String} sample_grid
     */
    let [matrix, sample_grid] = [];

    beforeEach(() => {
        matrix = new Matrix(6, 6);
        sample_grid = '3......4.31........2.....1.4.2......';
    });

    it("parseGrid anchors", () => {
        matrix.parseGrid(sample_grid);

        // 個別の値
        expect(matrix.getValue(1, 1)).to.be.equal(3);
        expect(matrix.getValue(2, 2)).to.be.equal(4);
        expect(matrix.getValue(2, 4)).to.be.equal(3);
        expect(matrix.getValue(2, 5)).to.be.equal(1);
        expect(matrix.getValue(4, 2)).to.be.equal(2);
        expect(matrix.getValue(5, 2)).to.be.equal(1);
        expect(matrix.getValue(5, 4)).to.be.equal(4);
        expect(matrix.getValue(5, 6)).to.be.equal(2);

        expect(matrix.isAnchor(1, 1)).to.be.true;

        expect(matrix.getValue(6, 6)).to.be.null;
    });

    it("anchorStatus", () => {
        matrix.parseGrid(sample_grid);
        let status = matrix.anchorStatus();
        expect(status.max_value).to.be.equal(4);
        expect(status.need_bits).to.be.equal(3);

        // 強引に値を変えてみる
        matrix.max_anchor = 8;
        status = matrix.anchorStatus();
        expect(status.max_value).to.be.equal(8);
        expect(status.need_bits).to.be.equal(4);

        matrix.max_anchor = 15;
        status = matrix.anchorStatus();
        expect(status.need_bits).to.be.equal(4);

        matrix.max_anchor = 16;
        status = matrix.anchorStatus();
        expect(status.need_bits).to.be.equal(5);
    });

    it("eachElement", () => {
        let counter = 0;
        matrix.parseGrid(sample_grid);
        matrix.eachElement((key, anchor_value) => {
            counter++;

            if (key === '1,1') {
                expect(anchor_value).to.be.equal(3);
            } else if (key === '1,2') {
                expect(anchor_value).to.be.null;
            }
        });
        expect(counter).to.be.equal(36);
    });
});

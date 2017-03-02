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
        // 3->0 / 4->1 / 1->2 / 2->3
        expect(matrix.elements['0,0']).to.be.equal(0);
        expect(matrix.elements['1,1']).to.be.equal(1);
        expect(matrix.elements['3,1']).to.be.equal(0);
        expect(matrix.elements['4,1']).to.be.equal(2);
        expect(matrix.elements['1,3']).to.be.equal(3);
        expect(matrix.elements['1,4']).to.be.equal(2);
        expect(matrix.elements['3,4']).to.be.equal(1);
        expect(matrix.elements['5,4']).to.be.equal(3);

        expect(matrix.isAnchor('0,0')).to.be.true;

        expect(matrix.elements['5,5']).to.be.null;
    });

    it("parseGrid peers&bits", () => {
        matrix.parseGrid(sample_grid);

        let key = Element.id(1, 0);
        let to_be = ['1,1', '0,0', '2,0'];
        expect(matrix.peers[key]).to.be.eql(to_be);
        expect(matrix.bits[key]).not.to.be.null;
    });
});

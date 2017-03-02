'use strict';

const {expect} = require("chai");
const Element = require("../lib/element");

describe("Element", () => {
    it("make key", () => {
        expect(Element.id(3, 4)).to.be.equal('3,4');
    });

    it("makePeer", () => {
        let dimension = {width: 3, height: 3};

        // 角: ２つ
        let to_be = ['0,1', '1,0'];
        expect(Element.peer(dimension, 0, 0)).to.be.eql(to_be);

        // 辺: ３つ
        to_be = ['1,1', '0,2', '2,2'];
        expect(Element.peer(dimension, 1, 2)).to.be.eql(to_be);

        // 中央: ４つ
        to_be = ['1,0', '1,2', '0,1', '2,1'];
        expect(Element.peer(dimension, 1, 1)).to.be.eql(to_be);

        // 右下の角
        to_be = ['2,1', '1,2'];
        expect(Element.peer(dimension, 2, 2)).to.be.eql(to_be);
    });
});

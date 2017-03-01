'use strict';

const {expect} = require("chai");
const Key = require("../lib/key");

describe("Key", () => {
    it("make key", () => {
        expect(Key.id(3, 4)).to.be.equal('3,4');
    });

    it("makeList", () => {
        let to_be = ['1,1', '1,2', '2,1', '2,2'];
        expect(Key.makeList(2, 2)).to.be.eql(to_be);
    });

    it("makePeer", () => {
        Key.makePeers(3, 3);

        // 角２つ
        let to_be = ['2,1', '1,2'];
        expect(Key.Peers.get('1,1')).to.be.eql(to_be);

        // 辺３つ
        to_be = ['2,2', '3,1', '3,3'];
        expect(Key.Peers.get('3,2')).to.be.eql(to_be);

        // 中央４つ
        to_be = ['1,2', '3,2', '2,1', '2,3'];
        expect(Key.Peers.get('2,2')).to.be.eql(to_be);

        to_be = ['2,3', '3,2'];
        expect(Key.Peers.get('3,3')).to.be.eql(to_be);
    });
});

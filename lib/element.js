`use strict`;

/**
 * Element
 *
 * Elementを表すキーを作成
 */
Element = {
    /**
     * @typedef {String} ElementId
     *
     * @typedef {{width: Number, height: Number}} Dimension
     */


    Peers: null,

    /**
     * Keyを返す
     * @param {Number} y
     * @param {Number} x
     * @returns {ElementId}
     */
    id: (x, y) => {
        return `${x},${y}`;
    },

    /**
     *
     * @param {Dimension} dimension
     * @param {Number} x
     * @param {Number} y
     *
     * @return {ElementId[]}
     */
    peer: (dimension, x, y) => {
        let peer = [];
        // 上のElement
        if (y > 0) {
            peer.push(Element.id(x, y - 1));
        }
        // 下のElement
        if (y < dimension.height - 1) {
            peer.push(Element.id(x, y + 1));
        }
        // 左のElement
        if (x > 0) {
            peer.push(Element.id(x - 1, y));
        }
        // 右のElement
        if (x < dimension.width - 1) {
            peer.push(Element.id(x + 1, y));
        }
        return peer;
    },
};

module.exports = Element;

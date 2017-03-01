`use strict`;

/**
 * Key
 *
 * Elementを表すキーを作成
 */
Key = {
    /** @typedef {String} Key */

    Peers: new Map(),

    /**
     * Keyを返す
     * @param {Number} row
     * @param {Number} col
     * @returns {Key}
     */
    id: (row, col) => {
        return `${row},${col}`;
    },

    /**
     *
     * @param {Number} width
     * @param {Number} height
     * @returns {Key[]}
     */
    makeList: (width, height) => {
        let result = [];
        for (let row = 1; row <= height; row++) {
            for (let col = 1; col <= width; col++) {
                result.push(Key.id(row, col));
            }
        }
        return result;
    },

    makePeers: (width, height) => {
        Key.Peers = new Map();
        for (let row = 1; row <= height; row++) {
            for (let col = 1; col <= width; col++) {
                let peer = [];
                // 上のElement
                if (row > 1) {
                    peer.push(Key.id(row - 1, col));
                }
                // 下のElement
                if (row < height) {
                    peer.push(Key.id(row + 1, col));
                }
                // 左のElement
                if (col > 1) {
                    peer.push(Key.id(row, col - 1));
                }
                // 右のElement
                if (col < width) {
                    peer.push(Key.id(row, col + 1));
                }

                Key.Peers.set(Key.id(row, col), peer);
            }
        }
        return Key.Peers;
    }
};

module.exports = Key;

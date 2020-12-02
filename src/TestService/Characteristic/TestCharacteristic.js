const bleno = require('bleno')
const util = require('util')

const ResultCode = {
    SUCCESS : 0,
    FAILURE : 1,
    INVALID_OFFSET : 7
}

class TestCharacteristic {
    constructor() {
        util.inherits(TestCharacteristic, bleno.Characteristic)
        TestCharacteristic.super_.call(this, {
            uuid: "aaaaaaaabbbbccccddddeeeeeeee0101",
            properties: ["read"] // ['write', 'writeWithoutResponse', 'notify', 'indicate']
        })
    }
    async onReadRequest(offset, callback) {
        console.log("onRead")
        try {
            const dataToSend = "Hello, Sherbet!"
            let dataBuffer = Buffer.from(dataToSend)
            let resultCode = ResultCode.SUCCESS
            if (offset > dataBuffer.length) {
                resultCode = ResultCode.INVALID_OFFSET
                dataBuffer = null
            } else
                dataBuffer = dataBuffer.slice(offset)
            callback(resultCode, dataBuffer)
        } catch (error) {
            callback(ResultCode.FAILURE)
        }
    }
}


module.exports = TestCharacteristic
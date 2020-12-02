const bleno = require('bleno')
const util = require('util')
const TestCharacteristic = require("./Characteristics/TestCharacteristic")

class TestService {
    constructor() {
        util.inherits(TestService, bleno.PrimaryService)
        TestService.super_.call(this, {
            uuid : 'aaaaaaaabbbbccccddddeeeeeeee0100',
            characteristics : [
                new TestCharacteristic()
            ]
        })
    }
}
module.exports = TestService;
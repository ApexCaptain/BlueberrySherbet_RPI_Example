const { off } = require('bleno')
const EventEmitter = require('events').EventEmitter
const bleno = require('bleno')
const util = require('util')

const ResultCode = {
    SUCCESS : 0,
    FAILURE : 1,
    INVALID_OFFSET : 7
}

const Events = {
    NEW_NOTIFICATION : "newNotification"
}

class TestCharacteristic extends EventEmitter {
    constructor() {
        super()
        util.inherits(TestCharacteristic, bleno.Characteristic)
        TestCharacteristic.super_.call(this, {
            uuid: "aaaaaaaabbbbccccddddeeeeeeee0101",
            properties: ["read", "write", "writeWithoutResponse", "notify", "indicate"]
        })
        setInterval(() => {
            this.emit(Events.NEW_NOTIFICATION, {
                test1 : "data1",
                test2 : "data2",
                test3 : "data3",
                test4 : "data4"
            })
        }, 5000)
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

    
    async onWriteRequest(bledata, offset, withoutResponse, callback) {
        console.log('onWrite')
        try {
            const receivedData = bledata.toString()
            console.log(receivedData)
            if(!withoutResponse) callback(ResultCode.SUCCESS)
        } catch (error) {
            if(!withoutResponse) callback(ResultCode.FAILURE)
        }
    }

    onSubscribe(maxValueSize, updateValueCallback) {
        console.log("onSubscribe")
        this.on(Events.NEW_NOTIFICATION, function(data){
            this.notifyData(data, "$EoD", maxValueSize, updateValueCallback)
        }.bind(this))
    }

    notifyData(dataToSend, endOfDataString, maxValueSize, updateValueCallback) {
        console.log(dataToSend)
        let buffer
        if(typeof dataToSend == 'object') buffer = Buffer.from(JSON.stringify(dataToSend), 'utf-8')
        else buffer = Buffer.from(JSON.stringify(dataToSend), 'utf-8')
        while(buffer.length) {
            const datumParcel = buffer.slice(0, maxValueSize)
            buffer = buffer.slice(maxValueSize, buffer.length)
            updateValueCallback(datumParcel)
        }
        updateValueCallback(Buffer.from(endOfDataString))
    }

    onUnsubscribe() {

    }




}


module.exports = TestCharacteristic
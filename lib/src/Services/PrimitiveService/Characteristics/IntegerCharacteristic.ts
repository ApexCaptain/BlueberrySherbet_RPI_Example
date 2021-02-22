import bleno from 'bleno'
import {
    GattUUID, 
    ReadRequestCallback, WriteRequestCallback, UpdateValueCallback,
    ResultCode,
    notifyData
} from "../../../../Module.internal"
import {
    EventEmitter
} from 'events'

export class IntegerCharacteristic extends bleno.Characteristic {

    private static EVENT_NOTIFY = "eventNotify"
    private static sInstance : IntegerCharacteristic
    private static sEmitter = new EventEmitter()

    static get instance() : IntegerCharacteristic {
        if(!this.sInstance) this.sInstance = new IntegerCharacteristic()
        return this.sInstance
    }
    private constructor() {
        super({
            uuid : GattUUID.primitiveService.characteristics.integerCharacteristicUuid,
            properties : [
                "read",
                "write",
                "writeWithoutResponse",
                "notify"
            ]
        })
        let integerToNotify = 0
        setInterval(() => {
            IntegerCharacteristic.sEmitter.emit(IntegerCharacteristic.EVENT_NOTIFY, integerToNotify++)
        }, 5000)
    }

    private readData = 0
    onReadRequest(offset : number, callback : ReadRequestCallback) {
        try {
            const dataBuffer = Buffer.from(this.readData.toString())
            if(offset > dataBuffer.length) callback(ResultCode.INVALID_OFFSET)
            else {
                callback(ResultCode.SUCCESS, dataBuffer.slice(offset))
                this.readData++
            }
        } catch(error) { callback(ResultCode.FAILURE) }
    }

    onWriteRequest(data : Buffer, _ : number, withoutResponse : boolean, callback : WriteRequestCallback) {
        try {
            const receivedData = parseInt(data.toString())
            if(receivedData != NaN) console.info(`Received Data : ${receivedData}`)
            if(!withoutResponse) callback(ResultCode.SUCCESS)
        } catch(error) {
            if(!withoutResponse) callback(ResultCode.FAILURE)
        }
    }

    onSubscribe(maxValueSize : number, updateValueCallback : UpdateValueCallback) {
        IntegerCharacteristic.sEmitter.on(IntegerCharacteristic.EVENT_NOTIFY, (data : number) => {
            notifyData(data, maxValueSize, updateValueCallback, "$EoD")
        })
    }

    onUnsubscribe() {
        IntegerCharacteristic.sEmitter.removeAllListeners(IntegerCharacteristic.EVENT_NOTIFY)
    }

}
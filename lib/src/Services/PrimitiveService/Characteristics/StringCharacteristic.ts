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

export class StringCharacteristic extends bleno.Characteristic {

    private static EVENT_NOTIFY = "eventNotify"
    private static sInstance : StringCharacteristic
    private static sEmitter = new EventEmitter()

    static get instance() : StringCharacteristic {
        if(!this.sInstance) this.sInstance = new StringCharacteristic()
        return this.sInstance
    }
    private constructor() {
        super({
            uuid : GattUUID.primitiveService.characteristics.stringCharacteristicUuid,
            properties : [
                "read",
                "write",
                "writeWithoutResponse",
                "notify"
            ]
        })
        setInterval(() => {
            StringCharacteristic.sEmitter.emit(StringCharacteristic.EVENT_NOTIFY, "String notification data.")
        }, 5000)
    }

    onReadRequest(offset : number, callback : ReadRequestCallback) {
        try {
            const dataToSend = "Hello, Sherbet!"
            const dataBuffer = Buffer.from(dataToSend)
            if(offset > dataBuffer.length) callback(ResultCode.INVALID_OFFSET)
            else callback(ResultCode.SUCCESS, dataBuffer.slice(offset))
        } catch (error) { callback(ResultCode.FAILURE) }
    }

    onWriteRequest(data : Buffer, _ : number, withoutResponse : boolean, callback : WriteRequestCallback) {
        try {
            const receivedData = data.toString()
            console.info(`Received Data : ${receivedData}`)
            if(!withoutResponse) callback(ResultCode.SUCCESS)
        } catch (error) { 
            if(!withoutResponse) callback(ResultCode.FAILURE)
        }
    }

    onSubscribe(maxValueSize : number, updateValueCallback : UpdateValueCallback) {
        StringCharacteristic.sEmitter.on(StringCharacteristic.EVENT_NOTIFY, (data : string) => {
            notifyData(data, maxValueSize, updateValueCallback, "$EoD")
        })
    }

    onUnsubscribe() {
        StringCharacteristic.sEmitter.removeAllListeners(StringCharacteristic.EVENT_NOTIFY)
    }

}
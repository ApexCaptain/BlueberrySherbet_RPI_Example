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
            uuid : GattUUID.testService.characteristics.stringCharacteristicUuid,
            properties : [
                "read",
                "write",
                "writeWithoutResponse",
                "notify",
                "indicate",
            ]
        })
        setInterval(() => {
            StringCharacteristic.sEmitter.emit(StringCharacteristic.EVENT_NOTIFY, {
                test1 : "data1",
                test2 : "data2",
                test3 : "data3",
                test4 : "data4"
            })
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
        StringCharacteristic.sEmitter.on(StringCharacteristic.EVENT_NOTIFY, (data : any) => {
            notifyData(data, maxValueSize, updateValueCallback, "$EoD")
        })
    }

}
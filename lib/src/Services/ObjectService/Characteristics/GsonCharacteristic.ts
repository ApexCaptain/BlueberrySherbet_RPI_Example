import bleno from 'bleno'
import {
    GattUUID,
    ReadRequestCallback, WriteRequestCallback, UpdateValueCallback,
    ResultCode,
    notifyData,
    Person
} from "../../../../Module.internal"
import {
    EventEmitter
} from "events"

export class GsonCharacteristic extends bleno.Characteristic {

    private static EVENT_NOTIFY = `EVENT_NOTIFY_${GsonCharacteristic.name}`
    private static sInstance : GsonCharacteristic
    private static sEmitter = new EventEmitter()

    static get instance() : GsonCharacteristic {
        if(!this.sInstance) this.sInstance = new GsonCharacteristic()
        return this.sInstance
    }
    private constructor() {
        super({
            uuid : GattUUID.objectService.characteristics.gsonCharacteristicUuid,
            properties : [
                "read",
                "write",
                "notify"
            ]
        })
        setInterval(() => {
            GsonCharacteristic.sEmitter.emit(GsonCharacteristic.EVENT_NOTIFY, new Person("Bruce", 29))
        }, 5000)
    }

    onReadRequest(offset : number, callback : ReadRequestCallback) {
        try {
            const dataToSend = new Person(
                "John",
                25
            )
            const dataBuffer = Buffer.from(JSON.stringify(dataToSend.toJson()))
            if(offset > dataBuffer.length) callback(ResultCode.INVALID_OFFSET)
            else callback(ResultCode.SUCCESS, dataBuffer.slice(offset))
        } catch(error) { callback(ResultCode.FAILURE) }
    }

    onWriteRequest(data : Buffer, _ : number, withoutResponse : boolean, callback : WriteRequestCallback) {
        try {
            const receivedData = Person.fromJson(data.toString())
            console.info("Received Data :", receivedData)
            callback(ResultCode.SUCCESS)
        } catch(error) { callback(ResultCode.FAILURE) }
    }

    onSubscribe(maxValueSize : number, updateValueCallback : UpdateValueCallback) {
        GsonCharacteristic.sEmitter.on(GsonCharacteristic.EVENT_NOTIFY, (data : Person) => {
            notifyData(data, maxValueSize, updateValueCallback, "$EoD")
        })
    }

    onUnsubscribe() {
        GsonCharacteristic.sEmitter.removeAllListeners(GsonCharacteristic.EVENT_NOTIFY)
    }

}
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

export class JsonCharacteristic extends bleno.Characteristic {

    private static EVENT_NOTIFY = "eventNotify"
    private static sInstance : JsonCharacteristic
    private static sEmitter = new EventEmitter

    static get instance() : JsonCharacteristic {
        if(!this.sInstance) this.sInstance = new JsonCharacteristic()
        return this.sInstance
    }
    private constructor() {
        super({
            uuid : GattUUID.objectService.characteristics.jsonCharacteristicUuid,
            properties : [
                "read",
                "write",
                "writeWithoutResponse",
                "notify"
            ]
        })
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

}
import bleno from 'bleno'
import {
    GattUUID,
    ReadRequestCallback, WriteRequestCallback, UpdateValueCallback,
    ResultCode,
    notifyData,
    Animal
} from "../../../../Module.internal"
import {
    EventEmitter
} from 'events'

export class MoshiCharacteristic extends bleno.Characteristic {

    private static EVENT_NOTIFY = `EVENT_NOTIFY_${MoshiCharacteristic.name}`
    private static sInstance : MoshiCharacteristic
    private static sEmitter = new EventEmitter()

    static get instance() : MoshiCharacteristic {
        if(!this.sInstance) this.sInstance = new MoshiCharacteristic()
        return this.sInstance
    }
    private constructor() {
        super({
            uuid : GattUUID.objectService.characteristics.moshiCharacteristicUuid,
            properties : [
                'read',
                'write',
                'notify'
            ]
        })
        setInterval(() => {
            MoshiCharacteristic.sEmitter.emit(MoshiCharacteristic.EVENT_NOTIFY, new Animal("A-Long", "Maltese"))
        }, 5000)
    }

    onReadRequest(offset : number, callback : ReadRequestCallback) {
        try {
            const dataToSend = new Animal(
                "Tama",
                "Cat"
            )
        } catch(error) { callback(ResultCode.FAILURE) }
    }

    onWriteRequest(data : Buffer, _ : number, withoutResponse : boolean, callback : WriteRequestCallback) {
        try {
            const receivedData = Animal.fromJson(data.toString())
            console.info("Received Data : ", receivedData)
            callback(ResultCode.SUCCESS)
        } catch(error) { callback(ResultCode.FAILURE) }
    }

    onSubscribe(maxValueSize : number, updateValueCallback : UpdateValueCallback) {
        MoshiCharacteristic.sEmitter.on(MoshiCharacteristic.EVENT_NOTIFY, (data : Animal) => {
            notifyData(data, maxValueSize, updateValueCallback, "$EoD")
        })
    }

    onUnsubscribe() {
        MoshiCharacteristic.sEmitter.removeAllListeners(MoshiCharacteristic.EVENT_NOTIFY)
    }

}
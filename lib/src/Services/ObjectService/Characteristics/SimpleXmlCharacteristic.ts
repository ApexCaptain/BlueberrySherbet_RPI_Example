import bleno from 'bleno'
import {
    GattUUID,
    ReadRequestCallback, WriteRequestCallback, UpdateValueCallback,
    ResultCode,
    notifyData,
    Product
} from "../../../../Module.internal"
import {
    EventEmitter
} from 'events'

export class SimpleXmlCharacteristic extends bleno.Characteristic {

    private static EVENT_NOTIFY = `EVENT_NOTIFY_${SimpleXmlCharacteristic.name}`
    private static sInstance : SimpleXmlCharacteristic
    private static sEmitter = new EventEmitter()

    static get instance() : SimpleXmlCharacteristic {
        if(!this.sInstance) this.sInstance = new SimpleXmlCharacteristic()
        return this.sInstance
    }

    private constructor() {
        super({
            uuid : GattUUID.objectService.characteristics.simpleXmlCharacteristicUuid,
            properties : [
                "read",
                "write",
                "notify"
            ]
        })
        setInterval(() => {
            SimpleXmlCharacteristic.sEmitter.emit(SimpleXmlCharacteristic.EVENT_NOTIFY, new Product("Galaxy Tap S", 1200))
        }, 5000)
    }

    onReadRequest(offset : number, callback : ReadRequestCallback) {
        try {
            const dataToSend = new Product(
                "Galaxy S12",
                1500
            )
            const dataBuffer = Buffer.from(dataToSend.toXml())
            if(offset > dataBuffer.length) callback(ResultCode.INVALID_OFFSET)
            else callback(ResultCode.SUCCESS, dataBuffer.slice(offset))
        } catch(error) { callback(ResultCode.FAILURE) }
    }

    onWriteRequest(data : Buffer, _ : number, withoutResponse : boolean, callback : WriteRequestCallback) {
        try {
            const receivedData = Product.fromXml(data.toString())
            console.info("Received Data :", receivedData)
            callback(ResultCode.SUCCESS)
        } catch(error) { callback(ResultCode.FAILURE) }
    }

    onSubscribe(maxValueSize : number, updateValueCallback : UpdateValueCallback) {
        SimpleXmlCharacteristic.sEmitter.on(SimpleXmlCharacteristic.EVENT_NOTIFY, (data : Product) => {
            notifyData(data.toXml(), maxValueSize, updateValueCallback, "$EoD")
        })
    }

    onUnsubscribe() {
        SimpleXmlCharacteristic.sEmitter.removeAllListeners(SimpleXmlCharacteristic.EVENT_NOTIFY)
    }

}
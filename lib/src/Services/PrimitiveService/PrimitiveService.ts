import bleno from 'bleno'
import {
    GattUUID
} from "../../../Module.internal"
import {
    StringCharacteristic
} from "./Characteristics/StringCharacteristic"
import {
    IntegerCharacteristic
} from "./Characteristics/IntegerCharacteristic"
export class PrimitiveService extends bleno.PrimaryService{
    private static sInstance : PrimitiveService
    static get instance() : PrimitiveService {
        if(!this.sInstance) this.sInstance = new PrimitiveService()
        return this.sInstance
    }
    private constructor() {
        super({
            uuid : GattUUID.primitiveService.uuid,
            characteristics : [
                StringCharacteristic.instance,
                IntegerCharacteristic.instance
            ]
        })
    }
}
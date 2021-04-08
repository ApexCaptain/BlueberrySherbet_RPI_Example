import bleno from 'bleno'
import {
    GattUUID
} from "../../../Module.internal"
import {
    GsonCharacteristic
} from "./Characteristics/GsonCharacteristic"
import {
    MoshiCharacteristic
} from "./Characteristics/MoshiCharacteristic"
import {
    SimpleXmlCharacteristic
} from "./Characteristics/SimpleXmlCharacteristic"
export class ObjectService extends bleno.PrimaryService {
    private static sInstance : ObjectService
    static get instance() : ObjectService {
        if(!this.sInstance) this.sInstance = new ObjectService()
        return this.sInstance
    }
    private constructor() {
        super({
            uuid : GattUUID.objectService.uuid,
            characteristics : [
                GsonCharacteristic.instance,
                MoshiCharacteristic.instance,
                SimpleXmlCharacteristic.instance
            ]  
        })
    }
}
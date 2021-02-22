import bleno from 'bleno'
import {
    GattUUID
} from "../../../Module.internal"
import {
    JsonCharacteristic
} from "./Characteristics/JsonCharacteristic"
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
                JsonCharacteristic.instance
            ]  
        })
    }
}
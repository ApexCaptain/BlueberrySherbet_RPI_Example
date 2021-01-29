import bleno from 'bleno'
import {
    GattUUID
} from "../../../Module.internal"
import {
    StringCharacteristic
} from "./Characteristics/StringCharacteristic"
export class TestService extends bleno.PrimaryService{
    private static sInstance : TestService
    static get instance() : TestService {
        if(!this.sInstance) this.sInstance = new TestService()
        return this.sInstance
    }
    private constructor() {
        super({
            uuid : GattUUID.testService.uuid,
            characteristics : [
                StringCharacteristic.instance
            ]
        })
    }
}
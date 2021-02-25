import {
    BLE
} from "./Module.internal"
const main = async () => {
    
    const ble = BLE.instnce
    ble.startAdvertising()

}
main()
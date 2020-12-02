const BLE = require('./src/BLE')

const main = async () => {
    const ble = BLE.getInstance();
    await ble.startAdvertising();
    console.log("qweqwe")
}
main()

const bleno = require('bleno')
const shelljs = require('shelljs')

var _isSingletonInstantiate = false;
var _instance = null
const BleState = {
    UNKNOWN : "unknown",
    POWERED_ON : "poweredOn"
}
const Events = {
    ADVERTISING_START : "advertisingStart",
    STATE_CHANGE : "stateChange"
}

const TestService = require("./TestService/TestService")

class BLE {
    static getInstance() {
        if(!_instance) {
            _isSingletonInstantiate = true
            _instance = new BLE()
            _isSingletonInstantiate = false
        }
        return _instance
    }
    constructor() {
        if(!_isSingletonInstantiate) throw new Error(`${this.constructor.name} cannot be instantiated directly!`)
        shelljs.exec('sudo systemctl start bluetooth')

    }

    async startAdvertising() {
        const advertisingName = "SherbetTest"
        const setServices = (resolve, reject) => {
            bleno.startAdvertising(advertisingName)
            bleno.once(Events.ADVERTISING_START, err => {
                if(err) reject(err)
                else {
                    bleno.setServices([
                        new TestService()
                    ])
                    resolve()
                }
            })
        }
        return new Promise((resolve, reject) => {
            if(bleno.state == BleState.POWERED_ON) {
                setServices(resolve, reject)
            } else {
                const onStateChangeListener = state => {
                    if(state == BleState.POWERED_ON) {
                        bleno.removeListener(Events.STATE_CHANGE, onStateChangeListener)
                        setServices(resolve, reject)
                    }
                }
                bleno.on(Events.STATE_CHANGE, onStateChangeListener)
            }
        })

    }

}

module.exports = BLE;
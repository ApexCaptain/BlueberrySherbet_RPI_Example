
import bleno from 'bleno'
import {
    exec
} from 'shelljs'
import os from 'os'
import {
    PrimitiveService
} from "./Services/TestService/PrimitiveService"

export class BLE {
    private static sInstance : BLE;
    static get instnce() : BLE {
        if(!this.sInstance) this.sInstance = new BLE()
        return this.sInstance
    }

    private constructor() {
        if(os.type() == 'Linux') exec('sudo systemctl start bluetooth')
    }

    async startAdvertising() {
        const advertisingName = "SherbetTest_nodejs"
        const setServices = (resolve : (value? : any) => void, reject : (reason? : any) => void) => {
            bleno.startAdvertising(advertisingName)
            bleno.once('advertisingStart', err => {
                if(err) reject(err)
                else {
                    bleno.setServices([
                        PrimitiveService.instance
                    ])
                    resolve()
                }
            })
        }
        return new Promise((resolve, reject) => {
            if(bleno.state == "poweredOn")
                setServices(resolve, reject)
            else {
                const onStateChangeListener = (state : string) => {
                    if(state == "poweredOn") {
                        bleno.removeListener("stateChange", onStateChangeListener)
                        setServices(resolve, reject)
                    }
                }
                bleno.on("stateChange", onStateChangeListener)
            }
        })
    }
}
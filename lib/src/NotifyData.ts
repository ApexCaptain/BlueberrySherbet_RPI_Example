import {
    UpdateValueCallback
} from "../Module.internal"
export const notifyData = (dataToSend : any, maxValueSize : number, updateValueCallback : UpdateValueCallback, endOfDataString : string = "$EoD") => {
    let buffer = Buffer.from(JSON.stringify(dataToSend), 'utf-8')
    while(buffer.length) {
        const datumParcel = buffer.slice(0, maxValueSize)
        buffer = buffer.slice(maxValueSize, buffer.length)
        updateValueCallback(datumParcel)
    }
    updateValueCallback(Buffer.from(endOfDataString))
}
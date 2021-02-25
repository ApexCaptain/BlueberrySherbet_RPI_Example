import { isNotEmittedStatement } from "typescript"
import {
    xml2json, json2xml
} from "xml-js"

function staticImplements<T>() {
    return <U extends T>(constructor: U) => { constructor }
}

function pairToElement(key : string, value : any) {
    const type = Array.isArray(value) ? 'array' : typeof value//(typeof value == 'object'? "element" : typeof value)
    const elementToReturn : any = {
        type : "element",
        name : key,
        elements :
            type == 'array' || type == 'object' ?
                Object.entries(value).map(([key, value]) => pairToElement(type == 'array' ? `item` : key, value))
            :
                [
                    {
                        type : "text",
                        text : value
                    }
                ]
    }
    
    return elementToReturn
}

function createXml(
    jsonData : Object,
    declaration: {
        version?: string,
        encoding?: "utf-8" | "ascii" | "utf8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined
    } = {
        version: "1.0",
        encoding: "utf-8"
    }): string {
    return json2xml(JSON.stringify({
        declaration : {
            attributes : {
                version : declaration.version,
                encoding : declaration.encoding
            }
        },
        elements : [
            {
                type : "element",
                name : "note",
                elements : Object.entries(jsonData).map(([key, value]) => pairToElement(key, value))
            }
        ]
    }), {
        spaces: 4,
        compact: false
    })
}

function parseXml(xmlData : string) : any {
    const jsonData = JSON.parse(xml2json(xmlData, {
        spaces : 4,
        compact : true
    })).note
    delete jsonData["_attributes"]
    return Object.fromEntries(Object.entries(jsonData).map(([key, value]) => [key, (value as any)._text]))
}

interface Jsonifiable<T> {
    toJson(): T
}

interface JsonParsable<T, U> {
    fromJson(json: T | string): U
}

interface XMLifiable {
    toXml(): string
}

interface XMLParsable<T> {
    fromXml(xml: string): T
}

interface EtcProperties {
    [key: string]: any
}

interface IPerson {
    name: string
    age: number
}
@staticImplements<JsonParsable<IPerson, Person>>()
export class Person implements IPerson, Jsonifiable<IPerson> {

    constructor(public name: string, public age: number) { }

    toJson(): IPerson {
        return JSON.parse(JSON.stringify(this))
    }

    static fromJson(json: string | IPerson & EtcProperties): Person {
        if (typeof json == 'string') json = JSON.parse(json)
        json = json as Person
        return new Person(
            json.name,
            json.age
        )
    }
}

@staticImplements<XMLParsable<Product>>()
export class Product implements XMLifiable {
    constructor(public name: string, public price: number) { }

    toXml(): string {
        return createXml(JSON.parse(JSON.stringify(this)))
    }

    static fromXml(xml: string): Product {
        const jsonData = parseXml(xml)
        return new Product(
            jsonData.name,
            Number(jsonData.price)
        )
    }

}

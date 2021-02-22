function staticImplements<T>() {
    return <U extends T>(constructor : U) => {constructor}
}

interface Jsonifiable<T> {
    toJson() : T
}

interface JsonParsable<T, U> {
    fromJson(json : T) : U
}

interface EtcProperties {
    [key : string] : any
}

interface IPerson {
    name : string
    age : number
}
@staticImplements<JsonParsable<IPerson, Person>>()
export class Person implements IPerson, Jsonifiable<IPerson> {

    constructor(public name : string, public age : number) {}

    toJson() : IPerson {
        return JSON.parse(JSON.stringify(this))
    }

    static fromJson(json : IPerson & EtcProperties) : Person {
        return new Person(
            json.name,
            json.age
        )
    }
}

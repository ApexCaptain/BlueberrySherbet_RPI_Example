export const GattUUID = {
    primitiveService : {
        uuid : "aaaaaaaabbbbccccddddeeeeeeee0100" as const,
        characteristics : {
            stringCharacteristicUuid : "aaaaaaaabbbbccccddddeeeeeeee0101" as const,
            integerCharacteristicUuid : "aaaaaaaabbbbccccddddeeeeeeee0102" as const
        }
    },
    objectService : {
        uuid : "aaaaaaaabbbbccccddddeeeeeeee0200" as const,
        characteristics : {
            gsonCharacteristicUuid : "aaaaaaaabbbbccccddddeeeeeeee0201" as const,
            simpleXmlCharacteristicUuid : "aaaaaaaabbbbccccddddeeeeeeee0202" as const
        }
    }
}
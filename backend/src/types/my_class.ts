export namespace MyClass {

    export type Attribute = {
        id: number;
        name: string;
        type: string;
        value: string;
        createdAt: string;
    }

    export type StudentAttribute = {
        attributeId: number;
        attributeAlias: string;
        attributeName: string;
        attributeType: string;
        value: string;
    };

}
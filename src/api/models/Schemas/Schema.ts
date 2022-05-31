import { SchemaField } from "./SchemaField";

export class Schema {
    id?: number;
    entity?: string;
    fields?: Array<SchemaField>;
}
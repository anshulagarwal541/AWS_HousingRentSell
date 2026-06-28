const { SchemaHelper } = require("../helpers/dynamoDBSchemaType");

const getChatSchema = (raw_data) => {
    const item = {
        _id: SchemaHelper.asTypeWithDefaults({
            data: raw_data._id,
            required_value: true,
            type_value: "string",
            field_value: "_id"
        }),
        message: SchemaHelper.asTypeWithDefaults({
            data: raw_data.message,
            type_value: "string",
            required_value: true,
            default_value: [],
            field_value: "message"
        }),
        to: SchemaHelper.asTypeWithDefaults({
            data: raw_data.to,
            type_value: "string",
            required_value: true,
            field_value: "to"
        }),
        from: SchemaHelper.asTypeWithDefaults({
            data: raw_data.from,
            type_value: "string",
            required_value: true,
            field_value: "from"
        }),
        timestamp: SchemaHelper.asTypeWithDefaults({
            data: raw_data.timestamp,
            type_value: "string",
            required_value: true,
            field_value: "timestamp"
        })
    };
    return item;
}

module.exports = {getChatSchema};
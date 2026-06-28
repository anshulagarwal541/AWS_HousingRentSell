const { SchemaHelper } = require("../helpers/dynamoDBSchemaType");

const getQuerySchema = (raw_data) => {
    const item = {
        _id: SchemaHelper.asTypeWithDefaults({
            data: raw_data._id,
            type_value: "string",
            required_value: true,
            field_value: "_id"
        }),
        query: SchemaHelper.asTypeWithDefaults({
            data: raw_data.query,
            type_value: "string",
            required_value: true,
            field_value: "query"
        }),
        from: SchemaHelper.asTypeWithDefaults({
            data: raw_data.from,
            type_value: "string",
            field_value: "from"
        }),
        status: SchemaHelper.asTypeWithDefaults({
            data: raw_data.status,
            enum_values: ['resolved', 'pending'],
            default_value: "pending",
            type_value: "string",
            field_value: "status"
        }),
        reply: SchemaHelper.asTypeWithDefaults({
            data: raw_data.reply,
            type_value: "string",
            required_value: false,
            field_value: "reply"
        })
    };
    return item;
}


module.exports = {getQuerySchema};
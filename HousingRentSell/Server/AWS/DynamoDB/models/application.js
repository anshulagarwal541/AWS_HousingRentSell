const { SchemaHelper } = require("../helpers/dynamoDBSchemaType");

const getApplicationSchema = (raw_data) => {
    const item = {
        _id: SchemaHelper.asTypeWithDefaults({
            data: raw_data._id,
            required_value: true,
            type_value: "string",
            field_value: "_id"
        }),
        name: SchemaHelper.asTypeWithDefaults({
            data: raw_data.name,
            type_value: "string",
            required_value: true,
            field_value: "name"
        }),
        email: SchemaHelper.asTypeWithDefaults({
            data: raw_data.email,
            type_value: "string",
            required_value: true,
            field_value: "email"
        }),
        phone: SchemaHelper.asTypeWithDefaults({
            data: raw_data.phone,
            type_value: "number",
            required_value: true,
            field_value: "phone"
        }),
        date: SchemaHelper.asTypeWithDefaults({
            data: raw_data.date,
            type_value: "date",
            required_value: true,
            field_value: "date"
        }),
        message: SchemaHelper.asTypeWithDefaults({
            data: raw_data.message,
            type_value: "string",
            required_value: false,
            field_value: "message"
        }),
        property: SchemaHelper.asTypeWithDefaults({
            data: raw_data.property,
            type_value: "string",
            field_value: "property"
        }),
        user: SchemaHelper.asTypeWithDefaults({
            data: raw_data.user,
            type_value: "string",
            field_value: "user"
        }),
        agent: SchemaHelper.asTypeWithDefaults({
            data: raw_data.agent,
            type_value: "string",
            field_value: "agent"
        }),
        controller: SchemaHelper.asTypeWithDefaults({
            data: raw_data.controller,
            type_value: "string",
            field_value: "controller"
        }),
        status: SchemaHelper.asTypeWithDefaults({
            data: raw_data.status,
            type_value: "string",
            enum_values: ['pending', 'contacted'],
            field_value: "status",
            default_value: "pending"
        }),
    };
    return item;
};


module.exports = {getApplicationSchema};
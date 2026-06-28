const { SchemaHelper } = require("../helpers/dynamoDBSchemaType");


const getUserSchema = (raw_data) => {
    const newUser = {
        _id: SchemaHelper.asTypeWithDefaults({
            data: raw_data._id,
            type_value: "string",
            required_value: true,
            field_value: "_id"
        }),
        username: SchemaHelper.asTypeWithDefaults({
            data: raw_data.username,
            type_value: "string",
            required_value: true,
            field_value: "username"
        }),
        email: SchemaHelper.asTypeWithDefaults({
            data: raw_data.email,
            type_value: "string",
            required_value: true,
            field_value: "email"
        }),
        password: SchemaHelper.asTypeWithDefaults({
            data: raw_data.password,
            type_value: "string",
            required_value: true,
            field_value: "password"
        }),
        phone: SchemaHelper.asTypeWithDefaults({
            data: raw_data.phone,
            type_value: "number",
            required_value: true,
            field_value: "phone"
        }),
        reviews: SchemaHelper.asTypeWithDefaults({
            data: raw_data.reviews,
            type_value: "object",
            default_value: [],
            field_value: "reviews"
        }),
        queries: SchemaHelper.asTypeWithDefaults({
            data: raw_data.queries,
            type_value: "object",
            default_value: [],
            field_value: "queries"
        }),
        applications: SchemaHelper.asTypeWithDefaults({
            data: raw_data.applications,
            type_value: "object",
            default_value: [],
            field_value: "applications"
        }),
        ownedHouses: SchemaHelper.asTypeWithDefaults({
            data: raw_data.ownedHouses,
            type_value: "object",
            default_value: [],
            field_value: "ownedHouses"
        }),
    };
    return newUser;
}



module.exports = { getUserSchema };
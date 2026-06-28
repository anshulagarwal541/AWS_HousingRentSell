const { SchemaHelper } = require("../helpers/dynamoDBSchemaType");


const getTeamSchema = (raw_data) => {
    const team = {
        _id: SchemaHelper.asTypeWithDefaults({
            data: raw_data._id,
            type_value: "string",
            required_value: true,
            field_value: "id"
        }),
        image: SchemaHelper.asTypeWithDefaults({
            data: raw_data.image,
            type_value: "string",
            required_value: false,
            field_value: "image"
        }),
        name: SchemaHelper.asTypeWithDefaults({
            data: raw_data.name,
            type_value: "string",
            required_value: true,
            field_value: "name"
        }),
        position: SchemaHelper.asTypeWithDefaults({
            data: raw_data.position,
            type_value: "string",
            required_value: true,
            field_value: "position"
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
        pin: SchemaHelper.asTypeWithDefaults({
            data: raw_data.pin,
            type_value: "number",
            required_value: true,
            field_value: "pin"
        }),
        memberId: SchemaHelper.asTypeWithDefaults({
            data: raw_data.memberId,
            type_value: "string",
            required_value: true,
            field_value: "memberId"
        }),
        assignedHouses: SchemaHelper.asTypeWithDefaults({
            data: raw_data.assignedHouses,
            type_value: "object",
            default_value: [],
            field_value: "assignedHouses"
        }),
        reviews: SchemaHelper.asTypeWithDefaults({
            data: raw_data.reviews,
            type_value: "object",
            default_value: [],
            field_value: "reviews"
        }),
        totalRating: SchemaHelper.asTypeWithDefaults({
            data: raw_data.totalRating,
            type_value: "number",
            default_value: 0,
            field_value: "totalRatings"
        }),
        chats: SchemaHelper.asTypeWithDefaults({
            data: raw_data.chats,
            type_value: "object",
            default_value: [],
            field_value: "chats"
        }),
        applications: SchemaHelper.asTypeWithDefaults({
            data: raw_data.applications,
            type_value: "object",
            default_value: [],
            field_value: "applications"
        }),
    }
    return team;
}


module.exports = { getTeamSchema };
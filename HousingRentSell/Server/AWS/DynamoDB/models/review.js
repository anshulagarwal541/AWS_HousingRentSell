const { SchemaHelper } = require("../helpers/dynamoDBSchemaType");


const getReviewSchema = (raw_data) => {
    const item = {
        _id: SchemaHelper.asTypeWithDefaults({
            data: raw_data._id,
            type_value: "string",
            required_value: true,
            field_value: "_id"
        }),
        review: SchemaHelper.asTypeWithDefaults({
            data: raw_data.review,
            type_value: "string",
            field_value: "review"
        }),
        rating: SchemaHelper.asTypeWithDefaults({
            data: raw_data.rating,
            type_value: "number",
            required_value: true,
            field_value: "rating"
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
    };
    return item;
}


module.exports = { getReviewSchema };



const { SchemaHelper } = require("../helpers/dynamoDBSchemaType");

const getHouseSchema = (raw_data) => {
    const house = {
        _id: SchemaHelper.asTypeWithDefaults({ data: raw_data._id, required_value: true, type_value: "string", field_value: "_id" }),
        address: SchemaHelper.asTypeWithDefaults({ data: raw_data.address, type_value: "string", required_value: true, field_value: "address" }),
        rooms: SchemaHelper.asTypeWithDefaults({ data: raw_data.rooms, required_value: true, min_value: 1, type_value: "number", field_value: "rooms" }),
        bath: SchemaHelper.asTypeWithDefaults({ data: raw_data.bath, required_value: true, min_value: 1, type_value: "number", field_value: "bath" }),
        area: SchemaHelper.asTypeWithDefaults({ data: raw_data.area, required_value: true, min_value: 1, type_value: "number", field_value: "area" }),
        category: SchemaHelper.asTypeWithDefaults({
            data: raw_data.category,
            enum_values: ["industrial", "residential", "commercial"],
            default_value: "residential",
            type_value: "string",
            field_value: "category"
        }),
        images: SchemaHelper.asTypeWithDefaults({
            data: raw_data.images,
            type_value: "object",
            default_value: [],
            field_value: "images"
        }),
        agent: SchemaHelper.asTypeWithDefaults({
            data: raw_data.agent,
            type_value: "string",
            required_value: false,
            field_value: "agent"
        }),
        controller: SchemaHelper.asTypeWithDefaults({
            data: raw_data.controller,
            type_value: "string",
            required_value: false,
            field_value: "controller"
        }),
        applications: SchemaHelper.asTypeWithDefaults({
            data: raw_data.applications,
            type_value: "object",
            default_value: [],
            field_value: "applications"
        }),
        latitude: SchemaHelper.asTypeWithDefaults({ data: raw_data.latitude, required_value: true, type_value: "number", field_value: "latitude" }),
        longitude: SchemaHelper.asTypeWithDefaults({ data: raw_data.longitude, required_value: true, type_value: "number", field_value: "longitude" }),
        companySellStatus: SchemaHelper.asTypeWithDefaults({
            data: raw_data.companySellStatus,
            required_value: true,
            enum_values: ["pending", "sold"],
            default_value: "pending",
            field_value: "companySellStatus"
        }),
        userSellStatus: SchemaHelper.asTypeWithDefaults({
            data: raw_data.userSellStatus,
            required_value: true,
            enum_values: ["none", "pending", "waiting", "sold", "rejected"],
            default_value: "none",
            type_value: "string",
            field_value: "userSellStatus"
        }),
        sellerType: SchemaHelper.asTypeWithDefaults({
            data: raw_data.sellerType,
            required_value: true,
            enum_values: ["user", "company"],
            default_value: "company",
            type_value: "string",
            field_value: "sellerType"
        }),
        seller: SchemaHelper.asTypeWithDefaults({
            required_value: false,
            data: raw_data.seller,
            field_value: "seller"
        }),
        totalPrice: SchemaHelper.asTypeWithDefaults({
            type_value: "number",
            required_value: true,
            min_value: 0,
            data: raw_data.totalPrice,
            field_value: "totalPrice"
        }),
        emiPrice: SchemaHelper.asTypeWithDefaults({
            data: raw_data.emiPrice,
            type_value: "number",
            min_value: 0,
            required_value: true,
            field_value: "emiPrice"
        }),
        owner: SchemaHelper.asTypeWithDefaults({
            type_value: "string",
            required_value: false,
            data: raw_data.owner,
            field_value: "owner"
        })
    }
    return house;
}

module.exports = { getHouseSchema };
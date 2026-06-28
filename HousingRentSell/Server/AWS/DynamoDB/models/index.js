const { getApplicationSchema } = require("./application.js");
const { getReviewSchema } = require("./review.js");
const { getChatSchema } = require("./chat.js");
const { getUserSchema } = require("./user.js");
const { getHouseSchema } = require("./house.js");
const { getTeamSchema } = require("./team.js");
const { getQuerySchema } = require("./query.js");


module.exports = {
    TableSchemas:{
        getApplicationSchema,
        getChatSchema,
        getHouseSchema,
        getQuerySchema,
        getReviewSchema,
        getTeamSchema,
        getUserSchema
    }
};
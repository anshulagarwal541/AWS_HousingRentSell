const { client: dynamoDBClient } = require('../helpers/table_commands_dynamoDB');
const { CreateTableCommand, DeleteTableCommand, ListTablesCommand, DescribeTableCommand, ScanCommand, GetItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require("uuid");

const { UserTableCommands } = require("./user_table_command");
const { TeamTableCommands } = require("./team_table_command");
const { TableSchemas } = require("../models/index");

const TableName = "House";



const listProperties = async () => {
    try {
        const params = {
            TableName: TableName
        }
        const scanCommand = new ScanCommand(params);
        const result = await dynamoDBClient.send(scanCommand);
        return result.Items.map(item => unmarshall(item));
    }
    catch (error) {
        console.error("Error scanning table:", error);
        throw error;
    }
};


const getHouseByFilter = async (filter) => {
    try {
        const params = {
            TableName: TableName,
            FilterExpression: filter.expression,
            ExpressionAttributeValues: filter.values
        };
        if (filter.names) {
            params.ExpressionAttributeNames = filter.names;
        }
        const scanCommand = new ScanCommand(params);
        const result = await dynamoDBClient.send(scanCommand);
        return result.Items.map(item => unmarshall(item));
    }
    catch (error) {
        console.error("Error scanning table with filter:", error);
        throw error;
    }
};


async function getPropertyById(id) {
    // Fetch the house by ID
    const houseResult = await dynamoDBClient.send(new GetItemCommand({
        TableName: "House",
        Key: { _id: { S: id } }
    }));

    if (!houseResult.Item) return null;

    const property = unmarshall(houseResult.Item);

    // Fetch related agent, controller, seller
    const agentScan = await dynamoDBClient.send(new ScanCommand({ TableName: "Team" }));
    const teams = agentScan.Items.map(item => unmarshall(item));

    const userScan = await dynamoDBClient.send(new ScanCommand({ TableName: "User" }));
    const users = userScan.Items.map(item => unmarshall(item));

    property.agent = teams.find(t => t._id === property.agent) || null;
    property.controller = teams.find(t => t._id === property.controller) || null;
    property.seller = users.find(u => u._id === property.seller) || null;

    return property;
}


const getHouseById = async (id) => {
    try {
        if(!id)
        {
            return null;
        }
        const params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        const house = await dynamoDBClient.send(new GetItemCommand(params));
        if (house.Item) {
            return unmarshall(house.Item);
        }
        return null;
    } catch (e) {
        throw e;
    }
}

async function checkSchema(tableName) {
    try {
        const result = await dynamoDBClient.send(new DescribeTableCommand({ TableName: tableName }));
        console.log("KeySchema:", result.Table.KeySchema);
        console.log("AttributeDefinitions:", result.Table.AttributeDefinitions);
    } catch (err) {
        console.error("Error describing table:", err);
    }
}

const createNewHouse = async (houseData) => {
    try {
        let newHouse = {
            _id: uuidv4(),
            ...houseData
        };
        newHouse = TableSchemas.getHouseSchema(newHouse);
        console.log(newHouse)
        const params = {
            TableName: TableName,
            Item: newHouse
        };
        await dynamoDBClient.send(new PutCommand(params));
        return newHouse;
    }
    catch (error) {
        console.error("Error creating new house:", error);
        throw error;
    }
};


const getUserHouseById = async (id) => {
    try {
        const params = {
            TableName: "House",
            Key: { _id: { S: id } }
        };
        const houseResult = await dynamoDBClient.send(new GetItemCommand(params));
        if (!houseResult.Item) return null;

        let house = unmarshall(houseResult.Item);

        if (house.seller) {
            const houseSeller = await UserTableCommands.findUserById(house.seller);

            // Populate owned houses with actual house objects
            if (Array.isArray(houseSeller.ownedHouses)) {
                const populatedHouses = await Promise.all(
                    houseSeller.ownedHouses.map(hId => getPropertyById(hId))
                );
                houseSeller.ownedHouses = populatedHouses.filter(Boolean);
            }

            house.seller = houseSeller;
        }

        return house;
    } catch (e) {
        throw e;
    }
};


const updateHouse = async (houseId, updatedHouse) => {
    try {
        if(!houseId)
        {
            return null;
        }
        const existingHouseResult = await dynamoDBClient.send(
            new GetItemCommand({
                TableName: TableName,
                Key: { _id: { S: houseId } }
            })
        );

        if (!existingHouseResult.Item) {
            throw new Error("House not found");
        }

        const existingHouse = unmarshall(existingHouseResult.Item);

        const newHouse = TableSchemas.getHouseSchema({ ...existingHouse, ...updatedHouse });

        const params = {
            TableName: TableName,
            Item: newHouse
        };

        await dynamoDBClient.send(new PutCommand(params));
        return newHouse;
    } catch (error) {
        console.error("Error updating house:", error);
        throw error;
    }
}


const deleteHouseById = async (id) => {
    try {
        if(!id)
        {
            console.error("Unable to delete House because id is empty");
        }
        const params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        const house = await dynamoDBClient.send(new DeleteItemCommand(params));
    }
    catch(e){
        throw e;
    }
}

module.exports = {
    HouseTableCommands: {
        listProperties,
        getHouseByFilter,
        getPropertyById,
        checkSchema,
        createNewHouse,
        getUserHouseById,
        getHouseById,
        updateHouse,
        deleteHouseById
    }
};
const { client: dynamoDBClient } = require('../helpers/table_commands_dynamoDB');
const { CreateTableCommand, DeleteTableCommand, ListTablesCommand, DescribeTableCommand, ScanCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { TableSchemas } = require("../models/index");

const TABLE_NAME = "User";


const findUserByUsername = async (username) => {
    try {
        if(!username)
        {
            return null;
        }
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": { S: username }
            }
        };
        const scanCommand = new ScanCommand(params);
        const result = await dynamoDBClient.send(scanCommand);
        if (result.Items.length === 0) {
            return null; // User not found
        }
        return unmarshall(result.Items[0]); // Return the first matching user
    } catch (error) {
        console.error("Error scanning table for user:", error);
        throw error;
    }
};


const findUserByEmail = async (email) => {
    try {
        if(!email)
        {
            return null;
        }
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": { S: email }
            }
        };
        const scanCommand = new ScanCommand(params);
        const result = await dynamoDBClient.send(scanCommand);
        if (result.Items.length === 0) {
            return null; // User not found
        }
        return unmarshall(result.Items[0]); // Return the first matching user
    } catch (error) {
        console.error("Error scanning table for user:", error);
        throw error;
    }
};


const listUserByFilter = async (filter) => {
    try {
        const params = {
            TableName: TABLE_NAME,
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
}


const findUserByFilter = async (filter) => {
    try {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: filter.expression,
            ExpressionAttributeValues: filter.values
        };
        if (filter.names) {
            params.ExpressionAttributeNames = filter.names;
        }
        const scanCommand = new ScanCommand(params);
        const result = await dynamoDBClient.send(scanCommand);
        return unmarshall(result.Items[0])
    }
    catch (error) {
        console.error("Error scanning table with filter:", error);
        throw error;
    }
}


const createUser = async (username, phone, email, password) => {
    let newUser = {
        _id: uuidv4(),
        username,
        phone,
        email,
        password,
        type: TABLE_NAME
    };
    newUser = TableSchemas.getUserSchema(newUser);
    const putCommand = new PutCommand({
        TableName: TABLE_NAME,
        Item: newUser
    });
    await dynamoDBClient.send(putCommand);
    return newUser;
};

const updateUser = async (id, updatedUserData) => {
    try {
        if(!id)
        {
            return null;
        }
        const existingUserResult = await dynamoDBClient.send(
            new GetItemCommand({
                TableName: TABLE_NAME,
                Key: { _id: { S: id } }
            })
        );

        if (!existingUserResult.Item) {
            throw new Error("User not found");
        }

        const existingUser = unmarshall(existingUserResult.Item);

        const newUser = TableSchemas.getUserSchema({ ...existingUser, ...updatedUserData });

        const params = {
            TableName: TABLE_NAME,
            Item: newUser
        };

        await dynamoDBClient.send(new PutCommand(params));
        return newUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}


const findUserById = async (id) => {
    try {
        if(!id)
        {
            return null;
        }
        const params = {
            TableName: TABLE_NAME,
            Key: { _id: { S: id } }
        }
        const getUser = await dynamoDBClient.send(new GetItemCommand(params));
        if (getUser.Item) {
            return unmarshall(getUser.Item);
        }
        else {
            return null;
        }
    } catch (e) {
        throw e;
    }
}


const getAllUsers = async () => {
    try {
        const params = {
            TableName: TABLE_NAME
        };
        const scanCommand = new ScanCommand(params);
        const result = await dynamoDBClient.send(scanCommand);
        if (result.Items && result.Items.length > 0) {
            return result.Items.map(user => unmarshall(user));
        }
        return [];
    }
    catch (e) {
        throw e;
    }
}

module.exports = {
    UserTableCommands: {
        findUserByUsername,
        findUserByEmail,
        createUser,
        listUserByFilter,
        findUserByFilter,
        updateUser,
        findUserById,
        getAllUsers
    }
};
const { client: dynamoDBClient } = require('../helpers/table_commands_dynamoDB');
const { CreateTableCommand, DeleteTableCommand, ListTablesCommand, DescribeTableCommand, ScanCommand, QueryCommand, PutItemCommand, GetItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { TableSchemas } = require("../models/index");

const TableName = "Chat";


const getChatById = async (id) => {
    try {
        if(!id)
        {
            return null;
        }
        const params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        const chat = await dynamoDBClient.send(new GetItemCommand(params));
        if (chat.Item) {
            return unmarshall(chat.Item);
        }
        return null;
    }
    catch (e) {
        throw e;
    }
}

const getAllChats = async () => {
    try {
        const params = {
            TableName: TableName
        };
        const allChats = await dynamoDBClient.send(new ScanCommand(params));
        if (allChats.Items.length > 0) {
            return allChats.Items.map(a => unmarshall(a));
        }
        return [];
    }
    catch (e) {
        throw e;
    }
}


const getChatByFilter = async (filter) => {
    try {
        const params = {
            TableName: TableName,
            FilterExpression: filter.expression,
            ExpressionAttributeValues: filter.values
        };
        if (filter.names) {
            params.ExpressionAttributeNames = filter.names;
        }
        const chats = await dynamoDBClient.send(new ScanCommand(params));
        return chats.Items.map(app => unmarshall(app));
    }
    catch (e) {
        throw e;
    }
}

const createChat = async (chat) => {
    try {
        let newChat = {
            _id: uuidv4(),
            ...chat
        };
        newChat = TableSchemas.getChatSchema(newChat);
        const params = {
            TableName: TableName,
            Item: newChat
        }
        await dynamoDBClient.send(new PutCommand(params));
        return newChat;
    }
    catch (e) {
        throw e;
    }
}

const updateChat = async (id, updatedContent) => {
    try {
        if(!id)
        {
            return null;
        }
        let params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        let chat = await dynamoDBClient.send(new GetItemCommand(params));
        if (!chat.Item) {
            throw new Error(`Chat with ${id} not found. Can't Update`);
        }
        chat = unmarshall(chat.Item);
        updatedContent = TableSchemas.getChatSchema({
            ...chat,
            ...updatedContent
        });
        params = {
            TableName: TableName,
            Item: updatedContent
        };
        await dynamoDBClient.send(new PutCommand(params));
        return updatedContent;
    }
    catch (e) {
        throw e;
    }
}

const deleteChatById = async (id) => {
    try {
        if(!id)
        {
            console.error("Unable to delete Chat because id is empty");
        }
        const params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        await dynamoDBClient.send(new DeleteItemCommand(params));
        return {success: "ok"};
    }
    catch(e)
    {
        throw e;
    }
}


module.exports = {
    ChatTableCommands: {
        getAllChats,
        getChatByFilter,
        getChatById,
        deleteChatById,
        updateChat,
        createChat
    }
};
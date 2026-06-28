const { client: dynamoDBClient } = require('../helpers/table_commands_dynamoDB');
const { CreateTableCommand, DeleteTableCommand, ListTablesCommand, DescribeTableCommand, ScanCommand, QueryCommand, PutItemCommand, GetItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { TableSchemas } = require("../models/index");

const TableName = "Query";



const getQueryById = async (id) => {
    try {
        if(!id)
        {
            return null;
        }
        const params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        const query = await dynamoDBClient.send(new GetItemCommand(params));
        if (query.Item) {
            return unmarshall(query.Item);
        }
        return null;
    }
    catch (e) {
        throw e;
    }
}

const getAllQueries = async () => {
    try {
        const params = {
            TableName: TableName
        };
        const allQueries = await dynamoDBClient.send(new ScanCommand(params));
        if (allQueries.Items.length > 0) {
            return allQueries.Items.map(a => unmarshall(a));
        }
        return [];
    }
    catch (e) {
        throw e;
    }
}


const getQueriesByFilter = async (filter) => {
    try {
        const params = {
            TableName: TableName,
            FilterExpression: filter.expression,
            ExpressionAttributeValues: filter.values
        };
        if (filter.names) {
            params.ExpressionAttributeNames = filter.names;
        }
        const queries = await dynamoDBClient.send(new ScanCommand(params));
        return queries.Items.map(app => unmarshall(app));
    }
    catch (e) {
        throw e;
    }
}

const createQuery = async (chat) => {
    try {
        let newQuery = {
            _id: uuidv4(),
            ...chat
        };
        newQuery = TableSchemas.getQuerySchema(newQuery);
        const params = {
            TableName: TableName,
            Item: newQuery
        }
        await dynamoDBClient.send(new PutCommand(params));
        return newQuery;
    }
    catch (e) {
        throw e;
    }
}

const updateQuery = async (id, updatedContent) => {
    try {
        if(!id)
        {
            return null;
        }
        let params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        let query = await dynamoDBClient.send(new GetItemCommand(params));
        if (!query.Item) {
            throw new Error(`Query with ${id} not found. Can't Update`);
        }
        query = unmarshall(query.Item);
        updatedContent = TableSchemas.getQuerySchema({
            ...query,
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

const deleteQueryById = async (id) => {
    try {
        if(!id)
        {
            console.error("Unable to delete Query because id is empty");
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
    QueryTableCommands:{
        getAllQueries,
        getQueriesByFilter,
        getQueryById,
        createQuery,
        updateQuery,
        deleteQueryById
    }
};
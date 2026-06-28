const { client: dynamoDBClient } = require('../helpers/table_commands_dynamoDB');
const { CreateTableCommand, DeleteTableCommand, ListTablesCommand, DescribeTableCommand, ScanCommand, QueryCommand, PutItemCommand, GetItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { TableSchemas } = require("../models/index");

const TableName = "Application";



const getApplicationById = async (id) => {
    try {
        if (!id) {
            return null;
        }
        const params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        const application = await dynamoDBClient.send(new GetItemCommand(params));
        if (application.Item) {
            return unmarshall(application.Item);
        }
        return null;
    }
    catch (e) {
        throw e;
    }
}

const getAllApplication = async () => {
    try {
        const params = {
            TableName: TableName
        };
        const allApplications = await dynamoDBClient.send(new ScanCommand(params));
        if (allApplications.Items.length > 0) {
            return allApplications.Items.map(a => unmarshall(a));
        }
        return [];
    }
    catch (e) {
        throw e;
    }
}


const getApplicationByFilter = async (filter) => {
    try {
        const params = {
            TableName: TableName,
            FilterExpression: filter.expression,
            ExpressionAttributeValues: filter.values
        };
        if (filter.names) {
            params.ExpressionAttributeNames = filter.names;
        }
        const applications = await dynamoDBClient.send(new ScanCommand(params));
        return applications.Items.map(app => unmarshall(app));
    }
    catch (e) {
        throw e;
    }
}

const createApplication = async (application) => {
    try {
        let newApplication = {
            _id: uuidv4(),
            ...application
        };
        newApplication = TableSchemas.getApplicationSchema(newApplication);
        const params = {
            TableName: TableName,
            Item: newApplication
        }
        await dynamoDBClient.send(new PutCommand(params));
        return newApplication;
    }
    catch (e) {
        throw e;
    }
}

const updateApplication = async (id, updatedContent) => {
    try {
        if (!id) {
            return null;
        }
        let params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        let application = await dynamoDBClient.send(new GetItemCommand(params));
        if (!application.Item) {
            throw new Error(`Application with ${id} not found. Can't Update`);
        }
        application = unmarshall(application.Item);
        updatedContent = {
            ...application,
            ...updatedContent
        };
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

const deleteApplicationById = async (id) => {
    try {
        if (!id) {
            console.error("Unable to delete application because id is empty");
            return;
        }
        const params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        await dynamoDBClient.send(new DeleteItemCommand(params));
        return { success: "ok" };
    }
    catch (e) {
        throw e;
    }
}

module.exports = {
    ApplicationTableCommands: {
        getAllApplication,
        getApplicationByFilter,
        getApplicationById,
        updateApplication,
        createApplication,
        deleteApplicationById
    }
};
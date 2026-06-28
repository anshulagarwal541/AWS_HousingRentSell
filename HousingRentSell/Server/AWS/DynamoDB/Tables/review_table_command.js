const { client: dynamoDBClient } = require('../helpers/table_commands_dynamoDB');
const { CreateTableCommand, DeleteTableCommand, ListTablesCommand, DescribeTableCommand, ScanCommand, QueryCommand, PutItemCommand, GetItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { TableSchemas } = require("../models/index");


const TableName = "Review";


const getReviewById = async (id) => {
    try {
        if(!id)
        {
            console.log("Unable to get Review because id is empty");
            return null;
        }
        const params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        const review = await dynamoDBClient.send(new GetItemCommand(params));
        if (review.Item) {
            return unmarshall(review.Item);
        }
        return null;
    }
    catch (e) {
        throw e;
    }
}

const getAllReviews = async () => {
    try {
        const params = {
            TableName: TableName
        };
        const allReviews = await dynamoDBClient.send(new ScanCommand(params));
        if (allReviews.Items.length > 0) {
            return allReviews.Items.map(a => unmarshall(a));
        }
        return [];
    }
    catch (e) {
        throw e;
    }
}


const getReviewsByFilter = async (filter) => {
    try {
        const params = {
            TableName: TableName,
            FilterExpression: filter.expression,
            ExpressionAttributeValues: filter.values
        };
        if (filter.names) {
            params.ExpressionAttributeNames = filter.names;
        }
        const reviews = await dynamoDBClient.send(new ScanCommand(params));
        return reviews.Items.map(app => unmarshall(app));
    }
    catch (e) {
        throw e;
    }
}

const createReview = async (review) => {
    try {
        let newReview = {
            _id: uuidv4(),
            ...review
        };
        newReview = TableSchemas.getReviewSchema(newReview);
        const params = {
            TableName: TableName,
            Item: newReview
        }
        await dynamoDBClient.send(new PutCommand(params));
        return newReview;
    }
    catch (e) {
        throw e;
    }
}

const updateReview = async (id, updatedContent) => {
    try {
        if(!id)
        {
            console.log("Unable to update Review because id is empty");
            return null;
        }
        let params = {
            TableName: TableName,
            Key: { _id: { S: id } }
        };
        let review = await dynamoDBClient.send(new GetItemCommand(params));
        if (!review.Item) {
            throw new Error(`Query with ${id} not found. Can't Update`);
        }
        review = unmarshall(review.Item);
        updatedContent = TableSchemas.getReviewSchema({
            ...review,
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

const deleteReviewById = async (id) => {
    try {
        if(!id)
        {
            console.error("Unable to delete Review because id is empty");
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
    ReviewTableCommands:{
        getAllReviews,
        getReviewById,
        getReviewsByFilter,
        createReview,
        updateReview,
        deleteReviewById
    }
};
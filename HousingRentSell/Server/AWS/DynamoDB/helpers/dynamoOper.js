const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'HousingRentSell';

const client = new DynamoDBClient({ region: REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const putItem = async (item) => {
  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };
  await ddbDocClient.send(new PutCommand(params));
};

const getItem = async (key) => {
  const params = {
    TableName: TABLE_NAME,
    Key: key,
  };
  const result = await ddbDocClient.send(new GetCommand(params));
  return result.Item;
};

const deleteItem = async (key) => {
  const params = {
    TableName: TABLE_NAME,
    Key: key,
  };
  await ddbDocClient.send(new DeleteCommand(params));
};

module.exports = {
  putItem,
  getItem,
  deleteItem,
};

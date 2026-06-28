require('dotenv').config();
const { DynamoDBClient, CreateTableCommand, DeleteTableCommand, ListTablesCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: `${process.env.AWS_REGION}` });

async function createTable() {
    const params = [
        {
            TableName: "Team",
            AttributeDefinitions: [
                { AttributeName: "_id", AttributeType: "S" } // Primary Key attribute
            ],
            KeySchema: [
                { AttributeName: "_id", KeyType: "HASH" } // Partition Key
            ],
            BillingMode: "PAY_PER_REQUEST" // on-demand capacity
        },
        {
            TableName: "House",
            AttributeDefinitions: [
                { AttributeName: "_id", AttributeType: "S" }
            ],
            KeySchema: [
                { AttributeName: "_id", KeyType: "HASH" }
            ],
            BillingMode: "PAY_PER_REQUEST"
        },
        {
            TableName: "Chat",
            AttributeDefinitions: [
                { AttributeName: "_id", AttributeType: "S" }
            ],
            KeySchema: [
                { AttributeName: "_id", KeyType: "HASH" }
            ],
            BillingMode: "PAY_PER_REQUEST"
        },
        {
            TableName: "Application",
            AttributeDefinitions: [
                { AttributeName: "_id", AttributeType: "S" }
            ],
            KeySchema: [
                { AttributeName: "_id", KeyType: "HASH" }
            ],
            BillingMode: "PAY_PER_REQUEST"
        },
        {
            TableName: "Query",
            AttributeDefinitions: [
                { AttributeName: "_id", AttributeType: "S" }
            ],
            KeySchema: [
                { AttributeName: "_id", KeyType: "HASH" }
            ],
            BillingMode: "PAY_PER_REQUEST"
        },
        {
            TableName: "Review",
            AttributeDefinitions: [
                { AttributeName: "_id", AttributeType: "S" }
            ],
            KeySchema: [
                { AttributeName: "_id", KeyType: "HASH" }
            ],
            BillingMode: "PAY_PER_REQUEST"
        },
        {
            TableName: "User",
            AttributeDefinitions: [
                { AttributeName: "_id", AttributeType: "S" }
            ],
            KeySchema: [
                { AttributeName: "_id", KeyType: "HASH" }
            ],
            BillingMode: "PAY_PER_REQUEST"
        },
    ];

    try {
        for (const param of params) {
            const data = await client.send(new CreateTableCommand(param));
            console.log(`Table ${param.TableName} created:`, data);
        }
    } catch (err) {
        console.error("Error creating table:", err);
    }
}

async function deleteTableIfExists(tableName) {
  try {
    // Check if table exists
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    console.log(`Table ${tableName} exists. Deleting...`);

    const result = await client.send(new DeleteTableCommand({ TableName: tableName }));
    console.log(`Table ${tableName} deleted:`, result);
  } catch (err) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`Table ${tableName} does not exist. Skipping delete.`);
    } else {
      console.error(`Error deleting table ${tableName}:`, err);
    }
  }
}

async function deleteTables() {
  const tables = ["Application", "Chat", "House", "Query", "Review", "User", "Team"];
  for (const table of tables) {
    await deleteTableIfExists(table);
  }
}


async function checkConnection() {
  try {
    const result = await client.send(new ListTablesCommand({}));
    console.log("******* Connected! Tables:", result.TableNames);
  } catch (err) {
    console.error("******* DynamoDB connection failed:", err);
  }
}

async function waitForTableActive(tableName) {
  let status = "CREATING";
  while (status !== "ACTIVE") {
    const result = await client.send(new DescribeTableCommand({ TableName: tableName }));
    status = result.Table.TableStatus;
    console.log(`Waiting for ${tableName}... Current status: ${status}`);
    if (status !== "ACTIVE") {
      await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5s
    }
  }
  console.log(`Table ${tableName} is ACTIVE!`);
}


module.exports = {
    createTable,
    deleteTables,
    checkConnection,
    waitForTableActive,
    client
};
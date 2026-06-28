const { client: dynamoDBClient } = require('../helpers/table_commands_dynamoDB');
const { CreateTableCommand, DeleteTableCommand, ListTablesCommand, DescribeTableCommand, ScanCommand, QueryCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { TableSchemas } = require("../models/index");

const TableName = "Team";


async function listTeamsWithRelations() {
  const teamScan = await dynamoDBClient.send(new ScanCommand({ TableName: "Team" }));
  const teams = teamScan.Items.map(item => unmarshall(item));

  // Get all houses, reviews, chats
  const houseScan = await dynamoDBClient.send(new ScanCommand({ TableName: "House" }));
  const houses = houseScan.Items.map(item => unmarshall(item));

  const reviewScan = await dynamoDBClient.send(new ScanCommand({ TableName: "Review" }));
  const reviews = reviewScan.Items.map(item => unmarshall(item));

  const chatScan = await dynamoDBClient.send(new ScanCommand({ TableName: "Chat" }));
  const chats = chatScan.Items.map(item => unmarshall(item));

  // Attach relationships
  teams.forEach(team => {
    team.assignedHouses = houses.filter(h => team.assignedHouses?.includes(h._id));
    team.reviews = reviews.filter(r => r.teamId === team._id);
    team.chats = chats.filter(c => c.teamId === team._id);
  });

  return teams;
};

const findTeamMemberByFilter = async (filter) => {
  try {
    const params = {
      TableName: TableName,
      FilterExpression: filter.expression,
      ExpressionAttributeValues: filter.values
    };
    if (filter.names) {
      params.ExpressionAttributeNames = filter.names;
    }
    const result = await dynamoDBClient.send(new ScanCommand(params));
    if (result.Items.length > 0) {
      return unmarshall(result.Items[0]);
    }
    return null;
  } catch (error) {
    console.error("Error finding team member by filter:", error);
    throw error;
  }
};


async function findTeamMemberByIdPopulatedReviewsAndHouses(id) {
  try {
    const result = await dynamoDBClient.send(
      new GetItemCommand({
        TableName: TableName,
        Key: { _id: { S: id } }
      })
    );

    if (!result.Item) return null;
    let member = unmarshall(result.Item);

    const houseResult = await dynamoDBClient.send(
      new ScanCommand({
        TableName: "House",
        FilterExpression: "#agent = :agent",
        ExpressionAttributeNames: {
          "#agent": "agent"   // define the alias
        },
        ExpressionAttributeValues: {
          ":agent": { S: id }
        }
      })
    );
    member.assignedHouses = houseResult.Items.map(i => unmarshall(i));

    const reviewResult = await dynamoDBClient.send(
      new ScanCommand({
        TableName: "Review",
        FilterExpression: "#agent = :agent",
        ExpressionAttributeNames: {
          "#agent": "agent"   // define the alias
        },
        ExpressionAttributeValues: {
          ":agent": { S: id }
        }
      })
    );
    let reviews = reviewResult.Items.map(i => unmarshall(i));

    for (let r of reviews) {
      const userResult = await dynamoDBClient.send(
        new GetItemCommand({
          TableName: "User",
          Key: { _id: { S: r.user } }
        })
      );
      r.user = userResult.Item ? unmarshall(userResult.Item) : null;
    }
    member.reviews = reviews;

    return member;
  } catch (error) {
    console.error("Error finding team member by ID:", error);
    throw error;
  }
};


const createTeamMember = async (member) => {
  try {
    let newMember = {
      _id: uuidv4(),
      ...member
    };
    newMember = TableSchemas.getTeamSchema(newMember)
    const params = {
      TableName: TableName,
      Item: newMember
    };
    await dynamoDBClient.send(new PutCommand(params));
    return newMember;
  } catch (e) {
    console.error("Error creating team member:", e);
    throw e;
  }
};


const updateTeamMember = async (id, updatedFields) => {
  try {
    if (!id) {
      console.log("Unable to update Team because id is empty");
      return null;
    }
    const existingMemberResult = await dynamoDBClient.send(
      new GetItemCommand({
        TableName: "Team",
        Key: { _id: { S: id } }
      })
    );

    if (!existingMemberResult.Item) {
      throw new Error("Team member not found");
    }

    const existingMember = unmarshall(existingMemberResult.Item);

    const newMember = TableSchemas.getTeamSchema({ ...existingMember, ...updatedFields });

    const params = {
      TableName: TableName,
      Item: newMember
    };

    await dynamoDBClient.send(new PutCommand(params));
    return newMember;
  } catch (error) {
    console.error("Error updating team member:", error);
    throw error;
  }
};


const getTeamMemberById = async (id) => {
  try {
    if (!id) {
      console.log("Unable to get Team because id is empty");
      return null;
    }
    const params = {
      TableName: TableName,
      Key: { _id: { S: id } }
    };
    const teamMember = await dynamoDBClient.send(new GetItemCommand(params));
    if (teamMember.Item) {
      return unmarshall(teamMember.Item);
    }
    else {
      return null;
    }
  } catch (e) {
    throw e;
  }
}


const getAllTeam = async () => {
  const params = {
    TableName: TableName
  };
  const team = await dynamoDBClient.send(new ScanCommand(params));
  if (team.Items.length > 0) {
    return team.Items.map(team => {
      return unmarshall(team);
    });
  }
  else {
    throw new Error("No Team Members found");
  }
}

module.exports = {
  TeamTableCommands: {
    listTeamsWithRelations,
    findTeamMemberByFilter,
    findTeamMemberByIdPopulatedReviewsAndHouses,
    createTeamMember,
    updateTeamMember,
    getTeamMemberById,
    getAllTeam
  }
};
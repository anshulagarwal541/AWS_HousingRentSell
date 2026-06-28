require('dotenv').config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

const { teamDetails } = require("../../../Helpers/teams.js");
const { houses } = require("../../../Helpers/house.js");
const { listFiles } = require("../../S3/Helpers/s3_setup.js");

const { createTable, deleteTables, checkConnection, waitForTableActive } = require("./table_commands_dynamoDB");
const { TeamTableCommands } = require("../Tables/team_table_command.js");
const { HouseTableCommands } = require("../Tables/house_table_command.js");

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

async function updateData() {
  try {
    // Reset tables
    await checkConnection();
    await new Promise(resolve => setTimeout(resolve, 10000));
    await deleteTables();
    await new Promise(resolve => setTimeout(resolve, 10000));
    await createTable();

    const tables = ["Team", "House", "Chat", "Application", "Query", "Review", "User"];
    for (const t of tables) {
      await waitForTableActive(t);
    }

    // Seed teams
    const teamRecords = [];
    for (let x = 0; x < teamDetails.length; x++) {
      let newTeam = {
        name: teamDetails[x].name,
        position: teamDetails[x].position,
        phone: teamDetails[x].phone,
        email: teamDetails[x].email,
        pin: teamDetails[x].pin,
        memberId: `HRS12092002-${x + 1}`,
        type: "Team",
        assignedHouses: [],
        image: "https://res.cloudinary.com/dqhecj3tf/image/upload/v1701343469/cld-sample.jpg"
      };

      // Use helper to create team
      newTeam = await TeamTableCommands.createTeamMember(newTeam);
      teamRecords.push(newTeam);
    }

    const ceoAgent = teamRecords.find(t => t.position === "CEO");

    // Seed houses
    for (let x = 0; x < houses.length; x++) {
      let newHouse = {
        ...houses[x],
        totalPrice: 649900,
        emiPrice: 850,
        images: [],
        controller: ceoAgent._id
      };

      // Geocode
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${houses[x].address}&apiKey=${process.env.GEOAPIFY_KEY}`
        );
        const result = await response.json();
        if (result.features && result.features.length > 0) {
          newHouse.latitude = result.features[0].geometry.coordinates[1];
          newHouse.longitude = result.features[0].geometry.coordinates[0];
        } else {
          newHouse.longitude = 38.53;
          newHouse.latitude = 77.03;
        }
      } catch (error) {
        console.log("Geoapify error", error);
      }

      // S3 images
      const listS3HouseImagesKey = await listFiles(process.env.AWS_S3_BUCKET_NAME);
      listS3HouseImagesKey.Contents.forEach((obj) => {
        if (obj.Key.startsWith("house_images/")) {
          newHouse.images.push(obj.Key);
        }
      });

      // Assign random agent
      let randomIndex = Math.floor(Math.random() * (teamRecords.length - 1)) + 1;
      const teamMember = teamRecords[randomIndex];
      newHouse.agent = teamMember._id;

      // Update team’s assigned houses
      if (!Array.isArray(teamMember.assignedHouses)) {
        teamMember.assignedHouses = [];
      }
      // Create house
      newHouse = await HouseTableCommands.createNewHouse(newHouse);

      teamMember.assignedHouses.push(newHouse._id);
      ceoAgent.assignedHouses.push(newHouse._id);
      await TeamTableCommands.updateTeamMember(teamMember._id, teamMember);

    }
    await TeamTableCommands.updateTeamMember(ceoAgent._id, {
      assignedHouses: ceoAgent.assignedHouses
    });
    console.log("Data seeded into DynamoDB successfully!");
  } catch (e) {
    console.error("Error seeding data:", e);
  }
}

updateData();

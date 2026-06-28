require('dotenv').config();

const express = require('express');
const router = express.Router();
const { sign } = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const fetch = require("node-fetch");

//  Middlewares
const { validateTeam } = require("../middlewares/index");

// S3
const { uploadFile, getPresignedUrlForImages } = require('../AWS/S3/Helpers/s3_setup.js');
const multer = require("multer");
const upload = multer({ dest: "uploads/" })
const fs = require("fs");
const path = require("path");

// DynamoDB
const { HouseTableCommands } = require('../AWS/DynamoDB/Tables/house_table_command.js');
const { TeamTableCommands } = require('../AWS/DynamoDB/Tables/team_table_command.js');
const { UserTableCommands } = require('../AWS/DynamoDB/Tables/user_table_command.js');
const { ReviewTableCommands } = require('../AWS/DynamoDB/Tables/review_table_command.js');
const { ApplicationTableCommands } = require('../AWS/DynamoDB/Tables/application_table_command.js');
const { QueryTableCommands } = require('../AWS/DynamoDB/Tables/queries_table_command.js');
const { ChatTableCommands } = require('../AWS/DynamoDB/Tables/chat_table_commad.js');

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;



// ---------------- Routes --------------------
//---------------------------------------------
//---------------------------------------------
// ----------------- get ----------------------
//---------------------------------------------
//---------------------------------------------
router.get('/getTeam', validateTeam, async (req, res) => {
    try {
        const team = await TeamTableCommands.getTeamMemberById(req.member._id);
        res.json(team);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.get('/getMember', validateTeam, async (req, res) => {
    try {
        let teamMember = await TeamTableCommands.getTeamMemberById(req.member._id);
        const allHouses = await HouseTableCommands.listProperties();
        const allUsers = await UserTableCommands.getAllUsers();
        const allTeam = await TeamTableCommands.getAllTeam();
        const teamMemberReviewFilter = {
            expression: "#agent = :agent",
            names: {
                "#agent": "agent"
            },
            values: {
                ":agent": { "S": req.member._id }
            }
        };
        let teamMemberReview = await ReviewTableCommands.getReviewsByFilter(teamMemberReviewFilter);
        teamMemberReview = teamMemberReview.map(review => ({
            ...review,
            user: allUsers.find(u => u._id === review.user)
        }));
        teamMember.reviews = teamMemberReview;
        teamMember.assignedHouses = teamMember.assignedHouses.map(houseId => allHouses.find(house => house._id === houseId));
        const allChats = await ChatTableCommands.getAllChats();
        let teamMemberChats = allChats.filter(chat => chat.from === req.member._id || chat.to === req.member._id);
        teamMemberChats = teamMemberChats.map(chat => ({
            ...chat,
            from: allTeam.find(t => t._id === chat.from),
            to: allTeam.find(t => t._id === chat.to)
        }));
        // After building teamMemberChats
        teamMemberChats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Assign sorted chats
        teamMember.chats = teamMemberChats;

        const uniqueChats = [];
        const seenPairs = new Set();

        teamMember.chats.forEach(chat => {
            // Normalize the pair so "A-B" and "B-A" are treated the same
            const pairKey = [chat.from._id, chat.to._id].sort().join("-");

            if (!seenPairs.has(pairKey)) {
                seenPairs.add(pairKey);
                uniqueChats.push(chat);
            }
        });

        let ans = {
            ...teamMember,
            chats: uniqueChats
        };
        console.log("ans = ", ans);
        res.json({
            ...teamMember,
            chats: uniqueChats
        });
    }
    catch (e) {
        res.json({ error: e.message })
    }
})


router.get('/allPeopleChats', validateTeam, async (req, res) => {
    try {
        let allTeams = await TeamTableCommands.getAllTeam();

        allTeams = await Promise.all(
            allTeams.map(async (teamMember) => {

                const assignedHouses = await Promise.all(
                    teamMember.assignedHouses.map(async (houseId) => {
                        const memberHouse = await HouseTableCommands.getHouseById(houseId);

                        const memberHouseReviews = await Promise.all(
                            (memberHouse.reviews || []).map(async (reviewId) => {
                                const r = await ReviewTableCommands.getReviewById(reviewId);
                                const user = await UserTableCommands.findUserById(r.user);
                                return { ...r, user };
                            })
                        );

                        const memberHouseChats = await Promise.all(
                            (memberHouse.chats || []).map(async (chatId) => {
                                const c = await ChatTableCommands.getChatById(chatId);
                                const user = await UserTableCommands.findUserById(c.to);
                                return { ...c, to: user };
                            })
                        );

                        return { ...memberHouse, reviews: memberHouseReviews, chats: memberHouseChats };
                    })
                );

                return { ...teamMember, assignedHouses };
            })
        );

        const filteredTeams = allTeams.filter(team => team.memberId !== req.member.memberId);
        res.json(filteredTeams);
    } catch (e) {
        res.json({ error: e.message });
    }
});






// ---------------- Routes --------------------
//---------------------------------------------
//---------------------------------------------
// ----------------- POST ---------------------
//---------------------------------------------
//---------------------------------------------
router.post('/addProperties', validateTeam, async (req, res) => {
    try {
        const data = req.body;
        const controllerFilter = {
            expression: "memberId = :memberId",
            values: {
                ":memberId": { "S": "HRS12092002-1" }
            }
        }
        const controller = await TeamTableCommands.findTeamMemberByFilter(controllerFilter);

        const agentFilter = {
            expression: "memberId = :memberId",
            values: {
                ":memberId": { "S": data.agentId }
            }
        };
        const agent = await TeamTableCommands.findTeamMemberByFilter(agentFilter);
        let newProperty = {
            address: data.address,
            bath: Number(data.bath),
            rooms: Number(data.rooms),
            area: Number(data.area),
            totalPrice: Number(data.totalPrice),
            emiPrice: Number(data.emiPrice),
            category: data.category
        };
        newProperty.images = data.urls;
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${data.address}&apiKey=${process.env.GEOAPIFY_KEY}`, { method: 'GET' });
        const result = await response.json();
        if (result.features && result.features.length > 0) {
            newProperty.latitude = result.features[0].geometry.coordinates[1]; // Note: latitude is the second coordinate
            newProperty.longitude = result.features[0].geometry.coordinates[0];
        } else {
            newProperty.latitude = 0.0;
            newProperty.longitude = 4.5;
        }
        newProperty.controller = controller._id;
        newProperty.agent = agent._id;
        const newCreatedHouse = await HouseTableCommands.createNewHouse(newProperty);
        agent.assignedHouses.push(newCreatedHouse._id);
        controller.assignedHouses.push(newCreatedHouse._id);
        await TeamTableCommands.updateTeamMember(agent._id, agent);
        await TeamTableCommands.updateTeamMember(controller._id, controller);
        res.json("submitted Successfully");
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.post('/removeUserHouse', validateTeam, async (req, res) => {
    try {
        const userHouse = await HouseTableCommands.getHouseById(req.body.houseId);
        let houseSeller = await UserTableCommands.findUserById(userHouse.seller);
        await HouseTableCommands.updateHouse(userHouse._id, {
            userSellStatus: "rejected"
        });
        await UserTableCommands.updateUser(userHouse.seller, {
            assignedHouses: houseSeller.ownedHouses.filter((house) => house !== userHouse._id)
        });
        res.json("You have successfully rejected the house..")
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.post('/setHouseWaiting', validateTeam, async (req, res) => {
    const house = await HouseTableCommands.getHouseById(req.body.houseId);
    if (house) {
        const agentParams = {
            expression: "memberId = :memberId",
            values: {
                ":memberId": { "S": req.body.agentId }
            }
        };
        const agent = await TeamTableCommands.findTeamMemberByFilter(agentParams);
        await HouseTableCommands.updateHouse(house._id, {
            agent: agent._id,
            userSellStatus: "waiting"
        });
        res.json("Request generated. Please wait for the owner's approval.")
    }
    else {
        res.json({ error: "Opps something invalid occured..." })
    }
})


router.post('/sellProperty', validateTeam, async (req, res) => {
    try {
        const data = req.body;
        let property = await HouseTableCommands.getHouseById(data.propertyId);
        if (property.companySellStatus === "sold")
        {
            return res.json({error:"This house is sold. You are no longer owner of this property"});
        }
        const user = await UserTableCommands.findUserById(data.owner);
        const agent = await TeamTableCommands.getTeamMemberById(property.agent);
        const controller = await TeamTableCommands.getTeamMemberById(property.controller);
        await UserTableCommands.updateUser(user._id, {
            ownedHouses: [...(user.ownedHouses || []), property._id]
        });
        await HouseTableCommands.updateHouse(property._id, {
            companySellStatus: "sold",
            owner: user._id,
        });
        await TeamTableCommands.updateTeamMember(property.controller, {
            assignedHouses: controller.assignedHouses.filter((p) => p !== property._id)
        });
        await TeamTableCommands.updateTeamMember(property.agent, {
            assignedHouses: agent.assignedHouses.filter((p) => p !== property._id)
        });
        res.json("Property sold Successfully...")
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.post('/deleteProperty', validateTeam, async (req, res) => {
    try {
        const data = req.body;
        const house = await HouseTableCommands.getHouseById(data.propertyId);
        if (house.companySellStatus === "sold")
        {
            return res.json({error:"This house is sold. You are no longer owner of this property"});
        }
        const agent = await TeamTableCommands.getTeamMemberById(data.agentId);
        const controllerFilter = {
            expression: "memberId = :memberId",
            values: {
                ":memberId": { "S": "HRS12092002-1" }
            }
        };
        const controller = await TeamTableCommands.findTeamMemberByFilter(controllerFilter);
        if (house.applications.length > 0) {
            for (const applicationId of house.applications) {
                await ApplicationTableCommands.deleteApplicationById(applicationId);
            }
        }
        await HouseTableCommands.updateHouse(house._id, {
            seller: null,
            controller: null,
            agent: null,
            applications: []
        });
        await TeamTableCommands.updateTeamMember(agent._id, {
            assignedHouses: agent.assignedHouses.filter((h) => h !== house._id)
        });
        await TeamTableCommands.updateTeamMember(controller._id, {
            assignedHouses: controller.assignedHouses.filter((h) => h !== house._id)
        });
        await HouseTableCommands.deleteHouseById(house._id);
        res.json("Property removed from database successfully...!!");
    }
    catch (e) {
        res.json({ error: e.message });
    }
})



router.post('/fetchMessages', validateTeam, async (req, res) => {
    const allTeam = await TeamTableCommands.getAllTeam();
    let allMessages = await ChatTableCommands.getAllChats();
    allMessages = allMessages.map(chat => ({
        ...chat,
        from: allTeam.find(t => t._id === chat.from),
        to: allTeam.find(t => t._id === chat.to)
    }));
    let allMessage1 = allMessages.filter((message) => (
        (message.from._id == req.body.user2 && message.to._id == req.body.user1) || (message.to._id == req.body.user2 && message.from._id == req.body.user1)));
    allMessage1.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.json(allMessage1);
})



router.post('/getAppliedUsers', validateTeam, async (req, res) => {
    try {
        const data = req.body;
        let property = await HouseTableCommands.getHouseById(data.houseId);
        property.applications = await Promise.all(
            property.applications.map(async (applicationId) => {
                const appl = await ApplicationTableCommands.getApplicationById(applicationId);
                const user = await UserTableCommands.findUserById(appl.user);
                return { ...appl, user };
            })
        );
        const users = [];
        property.applications.forEach((house) => {
            users.push(house.user);
        })
        res.json(users);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.post('/getApplications', validateTeam, async (req, res) => {
    try {
        const data = req.body;
        let employee = await TeamTableCommands.getTeamMemberById(req.member._id);
        employee.applications = await Promise.all(
            employee.applications.map(async (application) => {
                let appl = await ApplicationTableCommands.getApplicationById(application);
                const user = await UserTableCommands.findUserById(appl.user);
                const agent = await TeamTableCommands.getTeamMemberById(appl.agent);
                const property = await HouseTableCommands.getHouseById(appl.property);
                const controller = await TeamTableCommands.getTeamMemberById(appl.controller);
                return { ...appl, user: user, agent: agent, property: property, controller: controller };
            })
        );

        const allApplications = employee.applications.filter((application) => application.status === data.status)
        res.json(allApplications);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})


router.post('/updateApplication', validateTeam, async (req, res) => {
    try {
        const data = req.body;
        let currApplication = await ApplicationTableCommands.getApplicationById(data._id);
        await ApplicationTableCommands.updateApplication(currApplication._id, {
            status: "contacted"
        });
        let employee = await TeamTableCommands.getTeamMemberById(req.member._id);
        employee.applications = await Promise.all(
            employee.applications.map(async (application) => {
                let appl = await ApplicationTableCommands.getApplicationById(application);
                const user = await UserTableCommands.findUserById(appl.user);
                const agent = await TeamTableCommands.getTeamMemberById(appl.agent);
                const property = await HouseTableCommands.getHouseById(appl.property);
                const controller = await TeamTableCommands.getTeamMemberById(appl.controller);
                return { ...appl, user: user, agent: agent, property: property, controller: controller };
            })
        );
        const allApplications = employee.applications.filter((application) => application.status === "pending")
        res.json(allApplications);
    }
    catch (e) {
        res.json({ error: e.message })
    }
})


router.post('/getQueriesTeam', validateTeam, async (req, res) => {
    try {
        const data = req.body;
        const filter = {
            expression: "#status = :status",
            names: {
                "#status": "status"
            },
            values: {
                ":status": { "S": data.status }
            }
        };
        let allQueries = await QueryTableCommands.getQueriesByFilter(filter);
        allQueries = await Promise.all(
            allQueries.map(async (query) => ({
                ...query,
                from: await UserTableCommands.findUserById(query.from)
            }))
        );
        res.json(allQueries)
    }
    catch (e) {
        res.json({ error: e.message })
    }
})



router.post('/queryReply', validateTeam, async (req, res) => {
    try {
        const data = req.body;
        let query = await QueryTableCommands.getQueryById(data.queryId);
        await QueryTableCommands.updateQuery(query._id, {
            reply: data.reply,
            status: "resolved"
        });
        const filter = {
            expression: "#status = :status",
            names: {
                "#status": "status"
            },
            values: {
                ":status": { "S": "pending" }
            }
        };
        let allQueries = await QueryTableCommands.getQueriesByFilter(filter);
        allQueries = await Promise.all(
            allQueries.map(async (query) => ({
                ...query,
                from: await UserTableCommands.findUserById(query.from)
            }))
        );
        res.json(allQueries);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})



router.post('/postMessages', validateTeam, async (req, res) => {
    const data = req.body;
    console.log(data);
    let newMessage = { message: data.message, timestamp: new Date().toISOString() };
    newMessage.from = data.from;
    newMessage.to = data.to;
    newMessage = await ChatTableCommands.createChat(newMessage);
    const toGuy = await TeamTableCommands.getTeamMemberById(newMessage.to);
    const fromGuy = await TeamTableCommands.getTeamMemberById(newMessage.from);
    await TeamTableCommands.updateTeamMember(newMessage.to, {
        chats: [...(toGuy.chats), newMessage._id]
    });
    await TeamTableCommands.updateTeamMember(newMessage.from, {
        chats: [...(fromGuy.chats), newMessage._id]
    });
    let allMessages = await ChatTableCommands.getAllChats();
    allMessages = await Promise.all(
        allMessages.map(async (message) => ({
            ...message,
            to: await TeamTableCommands.getTeamMemberById(message.to),
            from: await TeamTableCommands.getTeamMemberById(message.from)
        }))
    );
    const allMessage1 = allMessages.filter((message) => (
        (message.from._id.toString() == data.to && message.to._id.toString() == data.from) || (message.to._id.toString() == data.to && message.from._id.toString() == data.from)
    ));
    allMessage1.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.json(allMessage1);

})


router.post('/updateDetails', validateTeam, async (req, res) => {
    const data = req.body;
    try {
        await TeamTableCommands.updateTeamMember(data._id, {
            name: data.name,
            email: data.email,
            phone: Number(data.phone)
        });
        res.json("done");
    }
    catch (e) {
        res.json({ error: e.message });
    }
})



module.exports = {
    TeamRoutes:{
        router
    }
};
require('dotenv').config();

const express = require('express');
const router = express.Router();
const { sign } = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const fetch = require("node-fetch");

//  Middlewares
const { validateUser } = require("../middlewares/index");

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
// ----------------- GET ----------------------
//---------------------------------------------
//---------------------------------------------
router.get('/getUser', validateUser, async (req, res) => {
    try {
        let user = await UserTableCommands.findUserById(req.user._id);
        const queryFilter = {
            expression: "#from = :from",
            names: {
                "#from": "from"
            },
            values: {
                ":from": { "S": req.user._id }
            }
        };
        let userQueries = await QueryTableCommands.getQueriesByFilter(queryFilter);
        userQueries = userQueries.map(query => ({
            ...query,
            from: { _id: user._id, username: user.username, email: user.email }
        }));
        user.queries = userQueries;
        res.json(user);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})







// ---------------- Routes --------------------
//---------------------------------------------
//---------------------------------------------
// ----------------- POST ---------------------
//---------------------------------------------
//---------------------------------------------
router.post('/userSellProperty', validateUser, async (req, res) => {
    try {
        const data = req.body;
        const currentUser = await UserTableCommands.findUserById(req.user._id);
        let newHouse = {
            address: data.address,
            rooms: Number(data.rooms),
            bath: Number(data.bath),
            area: Number(data.area),
            totalPrice: Number(data.totalPrice),
            emiPrice: Number(data.emiPrice),
            price: Number(data.totalPrice),
            category: data.category,
            images: data.urls,
            sellerType: "user",
            seller: currentUser._id,
            userSellStatus: "pending"
        }
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${data.address}&apiKey=${process.env.GEOAPIFY_KEY}`, { method: 'GET' });
        const result = await response.json();
        if (result.features && result.features.length > 0) {
            newHouse.latitude = result.features[0].geometry.coordinates[1]; // Note: latitude is the second coordinate
            newHouse.longitude = result.features[0].geometry.coordinates[0];
        } else {
            newHouse.latitude = 0.0;
            newHouse.longitude = 4.5;
        }
        newHouse = await HouseTableCommands.createNewHouse(newHouse);
        currentUser.ownedHouses.push(newHouse._id);
        await UserTableCommands.updateUser(currentUser._id, currentUser);
        res.json("submitted Successfully");
    }
    catch (e) {
        res.json({ error: e.message })
    }
})


router.post('/rejectCompanyRequest', validateUser, async (req, res) => {
    try {
        const userHouse = await HouseTableCommands.getPropertyById(req.body.houseId);
        await HouseTableCommands.updateHouse(userHouse._id, {
            userSellStatus: "pending",
            agent: null
        });
        const houseFilter = {
            expression: "sellerType = :sellerType AND userSellStatus = :userSellStatus",
            values: {
                ":sellerType": { "S": "user" },
                ":userSellStatus": { "S": "pending" }
            }
        };
        let allUserHouses = await HouseTableCommands.getHouseByFilter(houseFilter);
        const allUsers = await UserTableCommands.getAllUsers();
        allUserHouses = allUserHouses.map(house => {
            const sellerObj = allUsers.find(u => u._id === house.seller);
            return {
                ...house,
                seller: sellerObj || null
            };
        });
        let allHouses = allUserHouses.filter((house) => house.seller._id === req.user._id);
        allHouses = await Promise.all(
            allHouses.map(house => ({
                ...house,
                images: house.images.map(image => getPresignedUrlForImages(process.env.AWS_S3_BUCKET_NAME, image))
            }))
        );
        res.json(allHouses)
    }
    catch (e) {
        res.json({ error: e.message });
    }
})

router.post('/approveCompanyRequest', validateUser, async (req, res) => {
    try {
        if (!req.body.houseId) {
            return res.json({ error: "houseId is required" });
        }

        const userHouse = await HouseTableCommands.getHouseById(req.body.houseId);
        if (!userHouse) {
            return res.json({ error: "House not found" });
        }

        const houseSeller = await UserTableCommands.findUserById(userHouse.seller);
        const houseAgent = await TeamTableCommands.getTeamMemberById(userHouse.agent);
        const controllerParams = {
            expression: "memberId = :memberId",
            values: {
                ":memberId": { "S": "HRS12092002-1" }
            }
        };
        const controller = await TeamTableCommands.findTeamMemberByFilter(controllerParams);

        if (!houseSeller || !houseAgent || !controller) {
            return res.json({ error: "Required seller, agent, or controller data is missing" });
        }

        houseAgent.assignedHouses = Array.isArray(houseAgent.assignedHouses) ? houseAgent.assignedHouses : [];
        controller.assignedHouses = Array.isArray(controller.assignedHouses) ? controller.assignedHouses : [];
        houseAgent.assignedHouses.push(userHouse._id);
        controller.assignedHouses.push(userHouse._id);

        houseSeller.ownedHouses = Array.isArray(houseSeller.ownedHouses) ? houseSeller.ownedHouses : [];
        houseSeller.ownedHouses = houseSeller.ownedHouses.filter((houseId) => houseId !== req.body.houseId);

        await TeamTableCommands.updateTeamMember(houseAgent._id, houseAgent);
        await TeamTableCommands.updateTeamMember(controller._id, controller);
        await UserTableCommands.updateUser(houseSeller._id, houseSeller);

        await HouseTableCommands.updateHouse(userHouse._id, {
            seller: houseSeller._id,
            agent: houseAgent._id,
            controller: controller._id,
            userSellStatus: "sold",
            sellerType: "company"
        });

        const houseFilter = {
            expression: "sellerType = :sellerType AND userSellStatus = :userSellStatus",
            values: {
                ":sellerType": { "S": "user" },
                ":userSellStatus": { "S": "pending" }
            }
        };
        let allUserProperties = await HouseTableCommands.getHouseByFilter(houseFilter);
        let allUsers = await UserTableCommands.getAllUsers();
        allUserProperties = allUserProperties.map(house => ({
            ...house,
            seller: allUsers.find(u => u._id === house.seller) || null
        }));
        let properties = allUserProperties.filter((property) => property.seller._id === req.user._id);
        properties = await Promise.all(
            properties.map(house => ({
                ...house,
                images: house.images.map(image => getPresignedUrlForImages(process.env.AWS_S3_BUCKET_NAME, image))
            }))
        );
        res.json(properties);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})

router.post('/getUserHouses', validateUser, async (req, res) => {
    try {
        const data = req.body;
        const allUsers = await UserTableCommands.getAllUsers();
        const allAgents = await TeamTableCommands.getAllTeam();
        if (data.status == "bought") {
            const houseFilter = {
                expression: "companySellStatus = :companySellStatus",
                values: {
                    ":companySellStatus": { "S": "sold" }
                }
            };
            let allUserProperties = await HouseTableCommands.getHouseByFilter(houseFilter);
            allUserProperties = await Promise.all(
                allUserProperties.map(house => ({
                    ...house,
                    seller: allUsers.find(u => u._id === house.seller),
                    owner: allUsers.find(u => u._id === house.owner),
                    agent: allAgents.find(a => a._id === house.agent)
                }))
            );
            const userProperties = allUserProperties.filter((property) => property.owner._id === req.user._id);
            allUserProperties = await Promise.all(
                allUserProperties.map(async (property) => ({
                    ...property,
                    images: await Promise.all(
                        property.images.map(async (image) =>
                            getPresignedUrlForImages(process.env.AWS_S3_BUCKET_NAME, image, 3600)
                        )
                    )
                }))
            );
            res.json(allUserProperties);
        }
        else {
            const houseFilter = {
                expression: "userSellStatus = :userSellStatus AND seller = :seller",
                values: {
                    ":userSellStatus": { "S": data.status },
                    ":seller": { "S": req.user._id }
                }
            };
            let allUserProperties = await HouseTableCommands.getHouseByFilter(houseFilter);
            allUserProperties = await Promise.all(
                allUserProperties.map(house => ({
                    ...house,
                    seller: allUsers.find(u => u._id === house.seller)
                }))
            );
            allUserProperties = await Promise.all(
                allUserProperties.map(async (property) => ({
                    ...property,
                    images: await Promise.all(
                        property.images.map(async (image) =>
                            getPresignedUrlForImages(process.env.AWS_S3_BUCKET_NAME, image, 3600)
                        )
                    )
                }))
            );
            res.json(allUserProperties);
        }
    }
    catch (e) {
        res.json({ error: e.message });
    }
})

router.post('/queries', validateUser, async (req, res) => {
    try {
        const data = req.body;
        let newQuery = {
            query: data.query
        }
        // const user = await User.findById(data.from);
        let user = await UserTableCommands.findUserById(data.from);
        newQuery.from = user._id;
        newQuery = await QueryTableCommands.createQuery(newQuery);
        await UserTableCommands.updateUser(user._id, {
            queries: [...(user.queries || []), newQuery._id]
        });
        res.json("done");
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.post('/submitApplication', validateUser, async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const applicationFilter = {
            expression: "#user =  :user AND #property = :property",
            names: {
                "#user": "user",
                "#property": "property"
            },
            values: {
                ":user": { "S": req.user._id },
                ":property": { "S": data.propertyId }
            }
        };
        const hasApplied = await ApplicationTableCommands.getApplicationByFilter(applicationFilter);
        if (hasApplied.length > 0) {
            return res.json({ error: "You have already applied for this property. Either wait for a call or directly contact the agent..!!" })
        }
        let newApplication = {
            name: data.name,
            email: data.email,
            phone: Number(data.phone),
            date: data.date,
            message: data.message,
            property: data.propertyId,
            agent: data.agent,
            controller: data.controller,
            user: req.user._id
        };
        newApplication = await ApplicationTableCommands.createApplication(newApplication);
        const member = await TeamTableCommands.getTeamMemberById(data.agent);
        const controller = await TeamTableCommands.getTeamMemberById(data.controller);
        const house = await HouseTableCommands.getHouseById(data.propertyId);
        const user = await UserTableCommands.findUserById(req.user._id);
        await TeamTableCommands.updateTeamMember(member._id, {
            applications: [...(member.applications || []), newApplication._id]
        });
        await TeamTableCommands.updateTeamMember(controller._id, {
            applications: [...(controller.applications || []), newApplication._id]
        });
        await HouseTableCommands.updateHouse(house._id, {
            applications: [...(house.applications || []), newApplication._id]
        });
        await UserTableCommands.updateUser(user._id, {
            applications: [...(user.applications || []), newApplication._id]
        });
        res.json("done");
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.post('/getQueriesUser', validateUser, async (req, res) => {
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


router.post('/review', validateUser, async (req, res) => {
    try {
        const data = req.body;
        let agent = await TeamTableCommands.getTeamMemberById(data.agent);
        const agentReviews = await Promise.all(
            agent.reviews.map(async (review) => {
                const r = await ReviewTableCommands.getReviewById(review);
                return r;
            })
        );
        const user = await UserTableCommands.findUserById(data.user);
        const userHasReviewed = agentReviews.some(review => review.user == data.user);
        if (!userHasReviewed) {
            let newReview = {
                review: data.review,
                rating: Number(data.rating)
            };
            newReview.user = data.user;
            newReview.agent = data.agent;
            newReview = await ReviewTableCommands.createReview(newReview);
            let sum = 0;
            agentReviews.forEach((review) => { sum += review.rating })
            await TeamTableCommands.updateTeamMember(agent._id, {
                reviews: [...(agent.reviews), newReview._id],
                totalRating: Number((sum) / (agent.reviews.length+1))
            });
            await UserTableCommands.updateUser(data.user, {
                reviews: [...(user.reviews), newReview._id]
            });
            res.json(agent);
        }
        else {
            res.json({ error: "User has already submitted the review" });
        }

    }
    catch (e) {
        res.json({ error: e.message });
    }
})


module.exports = {
    UserRoutes: {
        router
    }
};
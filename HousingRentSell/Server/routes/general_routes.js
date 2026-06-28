require('dotenv').config();

const express = require('express');
const router = express.Router();
const { sign } = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const fetch = require("node-fetch");

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
router.get('/', (req, res) => {
    res.send("welcome...");
})


router.get('/properties', async (req, res) => {
    try {
        const allProperties = await HouseTableCommands.listProperties();
        allCompanyProperties = allProperties.filter((property) => (property.sellerType === "company" && property.companySellStatus === "pending"))
        res.json(allCompanyProperties);
    } catch (e) {
        res.json({ error: "No properties found in the database.." });
    }
})


router.get('/teams', async (req, res) => {
    try {
        const allTeams = await TeamTableCommands.listTeamsWithRelations();
        res.json(allTeams);
    }
    catch (e) {
        res.json({ error: "Sorry no members found in database.." });
    }
})


router.get('/properties/:id', async (req, res) => {
    const { id } = req.params;
    let property = await HouseTableCommands.getHouseById(id);
    if (property) {
        const agent = await TeamTableCommands.getTeamMemberById(property.agent);
        const controller = await TeamTableCommands.getTeamMemberById(property.controller);
        const seller = await UserTableCommands.findUserById(property.seller);
        property.agent = agent;
        property.controller = controller;
        property.seller = seller;
        property.images = await Promise.all(
            property.images.map(image =>
                getPresignedUrlForImages(process.env.AWS_S3_BUCKET_NAME, image, 3600)
            )
        );
        res.json(property);
    }
    else {
        res.json({ error: "Sorry can't find the property with the selected id..." })
    }
})


router.get('/property/:id/images', async (req, res) => {
    const { id } = req.params;
    const property = await HouseTableCommands.getPropertyById(id);
    if (property) {
        const propertyImages = await Promise.all(
            property.images.map(image =>
                getPresignedUrlForImages(process.env.AWS_S3_BUCKET_NAME, image, 3600)
            )
        );
        if (propertyImages) {
            res.json(propertyImages);
        }
        else {
            res.json({ error: "No property images..!!!" });
        }
    }
    else {
        res.json({ error: "No property !!" });
    }
})


router.get('/team/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const teamMember = await TeamTableCommands.findTeamMemberByIdPopulatedReviewsAndHouses(id);
        res.json(teamMember);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.get('/getMember/:id', async (req, res) => {
    const { id } = req.params;
    const member = await TeamTableCommands.getTeamMemberById(id);
    res.json(member);
})





// ---------------- Routes --------------------
//---------------------------------------------
//---------------------------------------------
// ----------------- POST ---------------------
//---------------------------------------------
//---------------------------------------------
router.post('/propertyCategory', async (req, res) => {
    try {
        const data = req.body;
        const allProperties = await HouseTableCommands.listProperties();
        if (!allProperties) {
            return res.json({ error: "Company is not selling any property right now.." })
        }
        allCompanyProperties = allProperties.filter((property) => (property.sellerType === "company" && property.companySellStatus === "pending"))
        const filteredProp = allCompanyProperties.filter((house) => house.category === data.category);
        res.json(filteredProp);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.post('/properties', async (req, res) => {
    try {
        const filters = req.body;
        const filter = {
            expression: "sellerType = :sellerType AND companySellStatus = :status",
            values: {
                ":sellerType": { "S": "company" },
                ":status": { "S": "pending" }
            }
        };

        let allProperties = await HouseTableCommands.getHouseByFilter(filter);
        if (filters.rooms) {
            const filtered = allProperties.filter((p) => parseInt(p.rooms) == parseInt(filters.rooms));
            allProperties = filtered;
        }
        if (filters.minPrice) {
            const filtered = allProperties.filter((p) => parseInt(p.totalPrice) >= parseInt(filters.minPrice));
            allProperties = filtered;
        }
        if (filters.maxPrice) {
            const filtered = allProperties.filter((p) => parseInt(p.totalPrice) <= parseInt(filters.maxPrice));
            allProperties = filtered;
        }
        if (filters.category) {
            const filtered = allProperties.filter((p) => p.category === filters.category);
            allProperties = filtered;
        }
        if (filters.country) {
            const filtered = allProperties.filter((p) => p.address.toLowerCase().includes(filters.country.toLowerCase()));
            allProperties = filtered;
        }
        if (filters.city) {
            const filtered = allProperties.filter((p) => p.address.toLowerCase().includes(filters.city.toLowerCase()));
            allProperties = filtered;
        }
        if (allProperties.length == 0) {
            return res.json({ error: "No properties found in the database.." })
        }
        res.json(allProperties);
    } catch (e) {
        // "No properties found in the database.."
        res.json({ error: e.message });
    }
})


router.post('/signup', async (req, res) => {
    try {
        const usernameLoggedIn = await UserTableCommands.findUserByUsername(req.body.username);
        const emailLoggedIn = await UserTableCommands.findUserByEmail(req.body.email);
        if (usernameLoggedIn) {
            return res.json({ error: "Username already registered !!" })
        }
        else if (emailLoggedIn) {
            return res.json({ error: "Email already registered !!" })
        }
        else {
            const password = await bcrypt.hash(req.body.password, 10);
            let newUser = await UserTableCommands.createUser(req.body.username, Number(req.body.phone), req.body.email, password);
            newUser = await UserTableCommands.findUserByEmail(req.body.email);
            const accessToken = sign({
                username: newUser.username,
                _id: newUser._id
            }, process.env.SECRET_KEY);
            res.json(accessToken);
        }
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.post('/login', async (req, res) => {
    try {
        const user = await UserTableCommands.findUserByUsername(req.body.username);
        if (!user) {
            return res.json({ error: "You must create an account first !!" })
        }
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
            const accessToken = sign({ username: req.body.username, _id: user._id }, process.env.SECRET_KEY);
            res.json(accessToken);
        }
        else {
            res.json({ error: "The username or password is incorrect..!!" });
        }
    }
    catch (e) {
        res.json({ error: e.message })
    }
})


router.post('/memberLogin', async (req, res) => {
    if (isNaN(req.body.pin)) {
        return res.json({ error: "The member-id or pin is incorrect..!!" })
    }
    const filter = {
        expression: "memberId = :memberId AND pin = :pin",
        values: {
            ":memberId": { "S": req.body.memberId },
            ":pin": { "N": req.body.pin.toString() }
        }
    };
    const teamMember = await TeamTableCommands.findTeamMemberByFilter(filter);
    if (teamMember) {
        const accessMemberToken = sign({ memberId: req.body.memberId, _id: teamMember._id }, process.env.SECRET_KEY);
        res.json(accessMemberToken);
    }
    else {
        res.json({ error: "The member-id or pin is incorrect..!!" });
    }
})


router.post('/upload', upload.array('file', 10), async (req, res) => {
    try {
        const files = req.files;
        const urls = [];

        for (const file of files) {
            // Read file from local temp storage
            const fileContent = fs.readFileSync(file.path);

            // Create a unique key for S3
            const key = `house_images/${path.basename(file.originalname)}`;

            // Upload to S3
            await uploadFile(S3_BUCKET_NAME, key, fileContent);

            urls.push(key);

            // Clean up temp file
            fs.unlinkSync(file.path);
        }
        res.json({ urls });
    } catch (e) {
        console.error("Upload error:", e);
        res.json({ error: e.message });
    }
})


router.post('/getHouses', async (req, res) => {
    try {
        const data = req.body;
        const houseParams = {
            expression: "userSellStatus = :userSellStatus",
            values: {
                ":userSellStatus": { "S": data.status }
            }
        };
        let allUsersProperties = await HouseTableCommands.getHouseByFilter(houseParams);
        const allUsers = await UserTableCommands.getAllUsers();

        allUsersProperties = await Promise.all(allUsersProperties.map(async (house) => ({
            ...house,
            seller: allUsers.find(u => u._id === house.seller),
            images: await Promise.all(
                house.images.map(async (image) => getPresignedUrlForImages(process.env.AWS_S3_BUCKET_NAME, image, 3600))
            )
        })));
        res.json(allUsersProperties);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


router.post('/findProperty', async (req, res) => {
    try {
        const data = req.body;
        const allProperties = await HouseTableCommands.listProperties();
        const properties = allProperties.filter((property) => (property.sellerType === "company" && property.companySellStatus === "pending"))
        const found = [];
        properties.forEach((property) => {
            if (data.city && property.address.toLowerCase().includes(data.city.toLowerCase())) {
                found.push(property);
            }
            else if (data.category && property.category === data.category) {
                found.push(property)
            }
            else if (data.price && property.price <= data.price) {
                found.push(property);
            }
        })
        res.json(found);
    }
    catch (e) {
        res.json({ error: e.message });
    }
})


module.exports = {
    GeneralRoutes:{
        router
    }
};
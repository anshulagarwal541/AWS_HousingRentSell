const mongoose = require('mongoose');
const Review = require('../models/Review.js');
const User = require('../models/User.js');
const Team = require('../models/team.js');
const House = require("../models/house.js");
const Chat = require('../models/Chat.js');
const Application = require('../models/Application.js');
const Query = require('../models/Queries.js');
const { teamDetails } = require('./teams.js');
const { houses, images } = require('./house.js');
const { storage, cloudinary } = require('../Cloudinary/index.js');
const multer = require('multer');
const upload = multer({ storage });
const fetch = require('node-fetch');
const pp="afknFg6nXg1bMFvt"
mongoose.connect('mongodb+srv://anshulagarwal541:anshulagarwal12@cluster0.yk9vu1g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("Sucessfully connected to mongoose database...");
        updateData();
    })
    .catch((e) => {
        console.log("Failed to connect to database....");
    })


const updateData = async () => {
    try {
        await Application.deleteMany();
        await Chat.deleteMany();
        await Query.deleteMany();
        await User.deleteMany();
        await Team.deleteMany();
        await House.deleteMany();
        await Review.deleteMany();
        for (let x = 0; x < teamDetails.length; x++) {
            const newTeam = new Team({
                name: teamDetails[x].name,
                position: teamDetails[x].position,
                phone: teamDetails[x].phone,
                email: teamDetails[x].email,
                pin: teamDetails[x].pin,
                memberId: `HRS12092002-${x + 1}`
            });
            await newTeam.save();
        }
        for (let x = 0; x < houses.length; x++) {
            const newHouse = new House(houses[x]);
            newHouse.totalPrice = 649900;
            newHouse.emiPrice = 850
            var requestOptions = {
                method: 'GET',
            };

            try {
                const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${houses[x].address}&apiKey=3b2d887ed6174074818fb94898b584f7`, requestOptions);
                const result = await response.json();
                if (result.features && result.features.length > 0) {
                    newHouse.latitude = result.features[0].geometry.coordinates[1]; // Note: latitude is the second coordinate
                    newHouse.longitude = result.features[0].geometry.coordinates[0];
                } else {
                    newHouse.longitude = 38.53;
                    newHouse.latitude = 77.03;
                }
            } catch (error) {
                console.log('error', error);
            }
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: 'houseRentSell',
                max_results: images.length // Adjust as needed; Cloudinary limits the number of results
            });
            result.resources.forEach(resource => {
                newHouse.images.push(resource.secure_url);
                // Here you can process each image as needed, for example, save the URL to a database
            });
            await newHouse.save();
        }
        const ceoAgent = await Team.findOne({ position: "CEO" });
        const allHouses = await House.find();
        allHouses.forEach(async (house) => {
            house.controller = ceoAgent._id;
            if (!ceoAgent.assignedHouses) {
                ceoAgent.assignedHouses = house;
            }
            else {
                ceoAgent.assignedHouses.push(house);
            }
            let randomIndex = Math.floor(Math.random() * (teamDetails.length - 1)) + 1;
            const teamMember = await Team.findOne({ name: teamDetails[randomIndex].name });
            house.agent = teamMember._id;
            if (!teamMember.assignedHouses) {
                teamMember.assignedHouses = house;
            }
            else {
                teamMember.assignedHouses.push(house);
            }
            await teamMember.save();
            await house.save();
        })
        await ceoAgent.save();
        const allTeams = await Team.find();
        allTeams.forEach(async (team) => {
            team.image = "https://res.cloudinary.com/dqhecj3tf/image/upload/v1701343469/cld-sample.jpg";
            await team.save();
        })
    }
    catch(e)
    {
        console.log(e.message)
    }
}


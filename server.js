const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('./models/Users');
const Events = require('./models/Events');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


// Connecting to the Mongodb database
mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(()=>{
    console.log("Connected to database!");
}).catch((err)=>{
    console.log(err.message);
})

const app = express();

// Parsing the request body to Json
app.use(express.json());
// Allowing all origins to be able to make the request to the server
app.use(cors());


// Creating the registration route
app.post('/register',async(req,res)=>{
    const {name,email, password} = req.body;
    try{
        if(!name || !email || !password){
            res.status(400).json({message : 'please enter all the details'});
        }

        const existingUser = await Users.findOne({email});
        if(existingUser){
            res.status(400).json({message : 'user already exists'});
            return;
        }

        const hashing_password = await bcrypt.hash(password,10);

        const newUser = new Users({
                id : new mongoose.Types.ObjectId().toString(),
                name,
                email,
                password:hashing_password
            }
        )

        await newUser.save();
        res.status(201).json({message : 'user registered successfully'});

    }
    catch(error){
        console.error('Error while registering :',error);
        res.status(404).json({message : 'An error occured during the registration of a new user'});
    }
})



// Creating the login route
app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try{
        if(!email || password){
            res.status(400).json({error : 'Email and Password must be provided'});
            return;
        }

        const myUser = await Users.findOne({email});
        if(!myUser){
            res.status(400).json({message:'given user not found'});
            return;
        }

        const match_password = await bcrypt.compare(password,myUser.password);
        if(!match_password){
            res.status(401).json({error : 'Invalid email or the password'});
        }

        const accessToken = jwt.sign({id : myUser.id , email : myUser.email},ACCESS_TOKEN_SECRET , {expiresIn : '1h'});


        res.status(200).json({
            message  : 'Login Successful',
            accessToken
        });
        return;
    }   
    catch(error){
        console.error('Error occured while logging in : ',error);
        res.status(400).json({error : ' Error occured while logging in'});
        return;
    }
})


// Creating the middleware before it can Access the other routes below this middleware to check if the user is logged in or not.
app.use((req,res,next)=>{
    const {authorization } = req.headers;
    if(!authorization || !authorization.startsWith("Bearer ")){
        res.sendStatus(401);
        return;
    }
    const token = authorization.split(" ")[1];  // getting an Accesstoken from the request

    try{
        const decoded = jwt.verify(token,ACCESS_TOKEN_SECRET);
        next();
    }
    catch(error){
        console.error('Invalid token or expired token',error);
        res.status(400).json({error : 'Access Denied. Invalid or expired token'});
    }
})



// This route will create an event
app.post('/createEvent',async(req,res)=>{
    const {name , date, capacity , availableSeats} = req.body;

    try{
        if(!name || !date || !capacity || !availableSeats){
            res.status(400).json({message : 'please provide all the details of an event'});
            return;
        }

        const newEvent = new Events({
            id : mongoose.Types.ObjectId().toString(),
            name,
            date,
            capacity,   
            availableSeats
        })

        await newEvent.save();
        res.status(200).json({message : "Event created Successfully"});
        return;
    }
    catch(error){
        console.error('Error while creating an event !',error);
        res.status(404).json({message : 'Could not create an event'});
        return;
    }
})



// This route will give all the required events.
app.get('/allEvents',async(req,res)=>{
    try{
        const myEvents = await Events.find(); // gives all of the events
        res.status(200).json({myEvents});
        return;
    }
    catch(error){
        console.error('Could not fetch the all events',error);
        res.status(400).json({message:'Error occured while fetching events'});
        return;
    }
})


// Updating an existing event in the database 

app.put('/updateEvent',async(req,res)=>{
    const id = req.params;
    const {name,date,capacity,availableSeats} = req.body;

    try{
        if(!name || !date || !capacity || !availableSeats){
            res.status(404).json({message : 'Field to update has not been provided'
            });
            return;
        }

        const updateEvent = await Events.findOneAndUpdate({
          id  
        },{
            ...(name && {name}),
            ...(date && {date}),
            ...(capacity && {capacity}),
            ...(availableSeats && {availableSeats})
        },{
            new : true
        });

        if(!updateEvent){
            res.status(404).json({message : 'Event not found'});
            return;
        }

        res.status(200).json({message : 'The event has been successfully updated'});
        return;

    }
    catch(error){
        console.error('Could not update Event',error);
        res.status(400).json({message : 'Event Could not be Updated'});
    }
});


// This route will find and delete on particular event.
app.delete('/deleteEvent/:id',async(req,res)=>{
    const id = req.params;
    try{
        const myEvent = await Events.findOneAndDelete({id}); // finding the event with given id and deleting it 
        if(!myEvent){
            res.status(404).json({message : 'Event does not exist'});
            return;
        }
        res.status(200).json({message : 'Event Deleted Successfully'});
        return;
    }
    catch(error){
        console.error('Error deleting an event',error);
        res.status(404).json({message : 'could not delete an event'});
        return;
    }
})


app.listen(7000, ()=>{
    console.log("server started on localhost:7000");
})

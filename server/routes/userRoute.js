import express from 'express';
import { createUser, BookedVisits, getallBookings, cancelBookedVisit, toFav, getAllFavourites } from '../controllers/userController.js';

const router = express.Router();

// POST /api/user/register
router.post('/register', createUser);

// POST /api/user/bookVisit/:id
router.post('/BookedVisits/:id', BookedVisits);

// POST /api/user/allBookings
router.post('/allBookings', getallBookings);

// POST /api/user/cancelBooking/:propertyId
router.post('/cancelBooking/:propertyId', cancelBookedVisit);

// POST /api/user/fav/:propertyId
router.post('/toFav/:propertyId',toFav); 

//POST /api/user/getAllFav/:propertyId
router.post('/getAllFav', getAllFavourites);



export { router as userRoute };


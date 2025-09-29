import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

// Create user
export const createUser = asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // ✅ Initialize BookedVisits as empty array
  const user = await prisma.user.create({
    data: {
      email,
      name,
      BookedVisits: [], // fix: ensures BookedVisits is never null
    },
  });

  res.status(201).json({ message: "User created successfully", user });
});

// Book a visit to a property
export const BookedVisits = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params; // property ID

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const bookedVisits = user.BookedVisits || [];

  // Check if property already booked
  if (bookedVisits.some((visit) => visit.propertyId === id)) {
    return res
      .status(400)
      .json({ message: "You have already booked a visit for this property" });
  }

  await prisma.user.update({
    where: { email },
    data: {
      BookedVisits: { push: { propertyId: id, date } },
    },
  });

  res.status(200).json({ message: "Visit booked successfully" });
});

// Get all booked visits for a user
export const getallBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const bookings = await prisma.user.findUnique({
    where: { email },
    select: { BookedVisits: true },
  });

  // ✅ Always return array, even if user has no bookings
  if (!bookings) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ BookedVisits: bookings.BookedVisits || [] });
});

// Functionality to cancel a booked visit
export const cancelBookedVisit = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { propertyId } = req.params;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email: email },
      select: { BookedVisits: true } // Added missing comma
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.BookedVisits.findIndex(visit => visit.propertyId === propertyId);

    if (index === -1) { 
      return res.status(404).json({ message: "Booking not found" });
    } else {
      user.BookedVisits.splice(index, 1);

      await prisma.user.update({
        where: { email: email },
        data: {
          BookedVisits: user.BookedVisits
        }
      });

      res.send("Booking cancelled successfully");
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//function to add a residency in favourite list of a user
export const toFav = asyncHandler(async (req, res) => { 
   const { email } = req.body;
   const { propertyId } = req.params;
   try {
     const user = await prisma.user.findUnique({ 
      where: { email: email },
     });
     if(user.favResidenciesID.includes(propertyId)){
      const updateU = await prisma.user.update({
        where: { email},
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter(id => id !== propertyId)
          }
        }
      });
      res.send({message: "residency removed from favourites"});
     } else{
      const updateUser = await prisma.user.update({ 
        where: { email },
        data: {
          favResidenciesID: {
            push: propertyId
          }
        }
     })
      res.send({message: "Updated Favourites Successfully" , user: updateUser});
    }

   }catch (error) {
    throw new Error(error.message);
   }
});
//function to get all favourite residencies of a user
export const getAllFavourites = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const favResd = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true }
    }); 
    res.status(200).send(favResd);
  }catch (error) {
    throw new Error(error.message);
  }


});
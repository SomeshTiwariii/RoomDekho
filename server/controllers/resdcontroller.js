import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

// Create residency
export const createResidency = asyncHandler(async (req, res) => {
  const { title, description, address, price, images, city, country, facilities, userEmail } = req.body.data;
  console.log(req.body.data);

  try {
    // Ensure user exists
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error(`User with email ${userEmail} does not exist`);
    }

    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        address,
        price,
        images,
        city,
        country,
        facilities,
        owner: { connect: { email: userEmail } },
      },
    });

    res.send({ message: 'Residency created successfully', residency });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Residency with this address already exists');
    }
    throw new Error(error.message);
  }
});

// Get all residencies ✅ minimal addition
export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await prisma.residency.findMany();
  res.json({ residencies });
});

// Get a single residency by ID

export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const residency = await prisma.residency.findUnique({ 
      where: { id }
    });
    res.send(residency);
  } catch (error) {
    throw new Error(error.message);
  }
});

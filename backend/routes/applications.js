const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET all applications (for Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Parse the JSON string back to an object for the frontend
    const formattedApps = applications.map(app => ({
      ...app,
      formData: JSON.parse(app.formData)
    }));
    
    res.json(formattedApps);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET single application by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await prisma.application.findUnique({
      where: { id }
    });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({
      ...application,
      formData: JSON.parse(application.formData)
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// POST new application (from Frontend Submit)
router.post('/', async (req, res) => {
  try {
    const { id, loanType, loanAmount, loanTenure, loanPurpose, fullName, email, ...otherFormData } = req.body;
    
    // If id is not provided by the frontend, Prisma will generate it. 
    // In our case, the frontend generates a UUID and passes it, but we can accept it or ignore it.
    // Let's store all the form fields inside formData string.
    
    const newApp = await prisma.application.create({
      data: {
        id: id || undefined, // use frontend generated ID if available
        fullName: fullName || 'Unknown',
        email: email || 'Unknown',
        loanType: loanType || 'personal',
        loanAmount: Number(loanAmount) || 0,
        formData: JSON.stringify(req.body)
      }
    });
    
    res.status(201).json({
      message: 'Application created successfully',
      applicationId: newApp.id
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// PATCH application status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedApp = await prisma.application.update({
      where: { id },
      data: { status }
    });
    
    res.json(updatedApp);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

module.exports = router;

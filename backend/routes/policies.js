const express = require("express");
const Policy = require("../models/Policy");
const Policyholder = require("../models/Policyholder");
const router = express.Router();

// @route   GET /api/policies
// @desc    Get all available policies
// @access  Public
router.get("/", async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/policies
// @desc    Create a new policy (Admin Only)
// @access  Private (Admin)
router.post("/", async (req, res) => {
  const { name, description, coverageAmount, premium, category } = req.body;

  if (!name || !description || !coverageAmount || !premium || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newPolicy = new Policy({
      name,
      description,
      coverageAmount,
      premium,
      category,
    });

    await newPolicy.save();
    res.status(201).json(newPolicy);
  } catch (error) {
    console.error("Error creating policy:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/policies/take
// @desc    Take a policy (User selects a policy)
// @access  Private (Authenticated Users handled by API Gateway)
router.post("/take", async (req, res) => {
  const { policyId, userEmail } = req.body;

  if (!policyId || !userEmail) {
    return res.status(400).json({ message: "Policy ID and user email are required" });
  }

  try {
    // Check if user already has a policy
    const existingPolicyholder = await Policyholder.findOne({ email: userEmail });
    if (existingPolicyholder) {
      return res.status(400).json({ message: "You already have a policy" });
    }

    // Create a new policyholder entry
    const newPolicyholder = new Policyholder({ email: userEmail, policyId });
    await newPolicyholder.save();

    // Update enrolledUsers in Policy
    await Policy.findByIdAndUpdate(policyId, { $push: { enrolledUsers: userEmail } });

    res.status(201).json({ message: "Policy taken successfully!" });
  } catch (error) {
    console.error("Error taking policy:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch policies for the logged-in user
router.post("/my-policies", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find the policyholder entry for the given email
    const policyholder = await Policyholder.findOne({ email });
    if (!policyholder) {
      return res.status(404).json({ message: "No policy found for this user" });
    }

    // Find the policy details using the policyId
    const policy = await Policy.findById(policyholder.policyId);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.json(Array.isArray(policy) ? policy : [policy]);
  } catch (error) {
    console.error("Error fetching user's policies:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/policies/:id
// @desc    Delete a policy (Admin Only)
// @access  Private (Admin - Handled by API Gateway)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the policy exists
    const policy = await Policy.findById(id);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    // Remove the policy reference from policyholders
    await Policyholder.deleteMany({ policyId: id });

    // Delete the policy itself
    await Policy.findByIdAndDelete(id);

    res.json({ message: "Policy deleted successfully" });
  } catch (error) {
    console.error("Error deleting policy:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

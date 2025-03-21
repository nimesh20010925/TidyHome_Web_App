import homeModel from "../Models/homeModel.js";
import userModel from "../Models/userModel.js";

export const createHomeController = async (req, res) => {
  try {
    const { homeName, number_of_members, homePhone, address, ownerID } = req.body;

    if (!homeName || !number_of_members || !homePhone || !address || !ownerID) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findById(ownerID);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.role !== "homeOwner") {
      return res.status(400).json({ success: false, message: "User is not authorized to create a home" });
    }

    const newHome = new homeModel({ homeName, ownerID, number_of_members, homePhone, address });

    const home = await newHome.save();

    user.homeID = home._id;
    await user.save();

    res.status(201).json({ success: true, message: "Home created successfully", home });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in creating home", error: error.message });
  }
};

// Controller to fetch homes owned by the relevant owner
export const getHomesByOwnerController = async (req, res) => {
  try {
    const ownerID = req.user._id; 

    const homes = await homeModel.find({ ownerID: ownerID }); // Query homes by owner ID

    if (homes.length === 0) {
      return res.status(404).json({ success: false, message: "No homes found for this owner" });
    }

    res.status(200).json({ success: true, homes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching homes", error: error.message });
  }
};
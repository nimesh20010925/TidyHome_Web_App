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

export const getMyHomeController = async (req, res) => {
  try {
    const userID = req.user._id;

    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.homeID) {
      return res.status(404).json({ success: false, message: "No home assigned to this user" });
    }

    const home = await homeModel.findById(user.homeID);
    if (!home) {
      return res.status(404).json({ success: false, message: "Home not found" });
    }

    res.status(200).json({ success: true, home });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching home", error: error.message });
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

// In your homeController.js
export const updateHomeController = async (req, res) => {
  try {
    const { homeID } = req.params;
    const { homeName, number_of_members, homePhone, address } = req.body;
    const userID = req.user._id; // Assuming you're using authentication middleware

    // Validate required fields
    if (!homeName || !number_of_members || !homePhone || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if home exists
    const home = await homeModel.findById(homeID);
    if (!home) {
      return res.status(404).json({ success: false, message: "Home not found" });
    }

    // Verify the user is the owner of this home
    if (home.ownerID.toString() !== userID.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this home" });
    }

    // Update home details
    const updatedHome = await homeModel.findByIdAndUpdate(
      homeID,
      { homeName, number_of_members, homePhone, address },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Home updated successfully", home: updatedHome });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating home", error: error.message });
  }
};
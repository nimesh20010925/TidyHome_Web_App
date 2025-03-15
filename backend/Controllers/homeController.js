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

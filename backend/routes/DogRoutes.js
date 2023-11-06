const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();

const {
  Dog,
  Catcher,
  Doctor,
  DailyMonitoring,
  CareTaker,
} = require("../models/Dog");
const Image = require('../models/Image');
const Kennel = require("../models/Kennel");

const authenticateToken = require("../middleware/authenticateToken");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
  }
})
// const fileUpload = multer({ dest: "uploads/" });
const fileUpload = multer({ storage: storage });

// List Dogs
router.get("/", authenticateToken, async (req, res) => {
  try {
    const dogs = await Dog.find()
      .populate({
        path: "catcherDetails",
        populate: {
          path: "catcher",
          select: "_id name contactNumber role",
        },
      })
      .populate({
        path: "vetDetails",
        populate: {
          path: "vet",
          select: "_id name contactNumber role",
        },
      })
      .populate({
        path: "careTakerDetails",
        populate: {
          path: "careTaker",
          select: "_id name contactNumber role",
        },
      })
      .populate("kennel");

    res.status(200).json(dogs);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users" });
  }
});

// Retreieve Dog
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const dogId = req.params.id;
    const dog = await Dog.findById(dogId)
      .populate({
        path: "catcherDetails",
        populate: {
          path: "catcher",
          select: "_id name contactNumber role",
        },
      })
      .populate({
        path: "catcherDetails",
        populate: {
          path: "catcher",
          select: "_id name contactNumber role",
        },
      })
      .populate({
        path: "vetDetails",
        populate: {
          path: "vet",
          select: "_id name contactNumber role",
        },
      })
      .populate({
        path: "careTakerDetails",
        populate: {
          path: "careTaker",
          select: "_id name contactNumber role",
        },
      })
      .populate("kennel");

    if (!dog) {
      return res.status(404).json({ error: "Dog not found" });
    }

    res.status(200).json(dog);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving dog" });
  }
});

// Retreieve dog by kennel id
router.get("/kennel/:kennelId", authenticateToken, async (req, res) => {
  const kennelId = req.params.kennelId;
  try {
    const kennel = await Kennel.findOne({ kennelId });

    if (!kennel) {
      return res.status(404).json({ message: "Kennel not found" });
    }

    const dog = await Dog.findOne({ kennel: kennel._id })
      .populate({
        path: "catcherDetails",
        populate: {
          path: "catcher",
          select: "_id name contactNumber role",
        },
      })
      .populate({
        path: "vetDetails",
        populate: {
          path: "vet",
          select: "_id name contactNumber role",
        },
      })
      .populate({
        path: "careTakerDetails",
        populate: {
          path: "careTaker",
          select: "_id name contactNumber role",
        },
      })
      .populate("kennel");

    res.status(200).json(dog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving dogs by kennel ID : " + error.message });
  }
});

// Delete Dog
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const dogId = req.params.id;
    const deletedDog = await Dog.findByIdAndRemove(dogId);

    if (!deletedDog) {
      return res.status(404).json({ error: "Dog not found" });
    }

    res.status(200).json({ message: "Dog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting dog" });
  }
});

// Create Dog - just update the details in dog, no updation in foriegn keys
router.post("/", authenticateToken, fileUpload.fields([
  { name: 'spotPhoto', maxCount: 1 },
  { name: 'additionalPhotos[]', maxCount: 4 },
]), async (req, res, next) => {
  try {
    // Extract catcher data from the request
    const {
      catchingLocation,
      locationDetails,
    } = req.body;

    const imageRefs = [];

    // Save the spotPhoto to the database
    if (req.files['spotPhoto'] && req.files['spotPhoto'].length > 0) {
      const spotPhoto = req.files['spotPhoto'][0];
      // Assuming you have an Image model to save image details, create and save it
      const image = new Image({
        name: spotPhoto.originalname,
        filename: spotPhoto.filename,
        path: spotPhoto.path,
      });
      await image.save();
      imageRefs.push(image._id);
    }

    // Save the additionalPhotos to the database
    if (req.files['additionalPhotos[]'] && req.files['additionalPhotos[]'].length > 0) {
      const additionalPhotos = req.files['additionalPhotos[]'];
      for (const photo of additionalPhotos) {
        // Create and save each additional photo to the Image model
        const image = new Image({
          name: photo.originalname,
          filename: photo.filename,
          path: photo.path,
        });
        await image.save();
        imageRefs.push(image._id);
      }
    }

    // Create a new Catcher model | !!! If catcher exists then go ahead wihtpout creating
    const catcher = new Catcher({
      catcher: req.user.userId, // Assuming userId is accessible through req.user
      catchingLocation,
      locationDetails,
      spotPhoto: imageRefs[0], // Assign the first image as the spotPhoto
    });

    for (let i of imageRefs.slice(1)) {
      catcher.additionalPhotos.push(i)
    }
    await catcher.save();

    // Create a new Dog model and link it to the catcher
    const dog = new Dog({
      catcherDetails: catcher._id,
    });

    dog.caseNumber = await Dog.generateCaseNumber(); // Generate a case number
    await dog.save();

    res.status(201).json({ message: "Case generated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating a dog case : " + error.message });
  }
});

// Update catcherDetails in dog
router.put("/:id/update/catcher", authenticateToken, async (req, res) => {
  try {
    const dogId = req.params.id;
    const catcherDetails = req.body.catcherDetails;

    console.log(catcherDetails);
    const dog = await Dog.findById(dogId);
    if (!dog) {
      res.status(404).json({ error: "Dog not found" });
    }

    const updatedDog = await Catcher.findByIdAndUpdate(
      dog.catcherDetails,
      catcherDetails,
      { new: true }
    );

    res.status(200).json(updatedDog);
  } catch (error) {
    res.status(500).json({
      error: "Error updating catcherDetails in dog : " + error.message,
    });
  }
});

// Update vetDetails in dog
router.put("/:id/update/vet", authenticateToken, async (req, res) => {
  try {
    const dogId = req.params.id;
    const vetDetailsData = req.body.vetDetails;

    if (["vet", "admin"].includes(req.user.role)) {
      // Check if the dog has an existing vetDetails
      const dog = await Dog.findById(dogId);
      if (!dog) {
        return res.status(404).json({ error: "Dog not found" });
      }

      if (!dog.vetDetails) {
        // Create a new vetDetails document and link it to the dog
        const vetDetails = new Doctor({
          vet: req.user.userId,
          ...vetDetailsData,
        });
        await vetDetails.save();

        dog.vetDetails = vetDetails._id;
      } else {
        // Update the existing vetDetails
        const existingVetDetails = await Doctor.findByIdAndUpdate(
          dog.vetDetails,
          vetDetailsData,
          { new: true }
        );
      }

      await dog.save();
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized Access Requested." });
    }

    return res
      .status(200)
      .json({ message: "Vet details updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error updating vet details" });
  }
});

// Add or Update caretaker reports in dog and add to caretakerDetails's reports
router.post("/:id/caretaker/report", authenticateToken, async (req, res) => {
  try {
    const dogId = req.params.id;
    const careTakerDetails = req.body.careTakerDetails;
    const reportData = req.body.reportData;

    if (["caretaker", "admin"].includes(req.user.role)) {
      let dog = await Dog.findById(dogId);

      if (!dog) {
        return res.status(404).json({ error: "Dog not found" });
      }

      if (!dog.careTakerDetails) {
        // Create a new caretaker document and link it to the dog
        const careTakerDetails = new CareTaker({ careTaker: req.user.userId });
        await careTakerDetails.save();

        dog.careTakerDetails = careTakerDetails._id;
      }
      const dailyReport = new DailyMonitoring(reportData);
      await dailyReport.save();

      dog = await dog.populate("careTakerDetails");
      dog.careTakerDetails.reports.push(dailyReport._id);

      await dog.careTakerDetails.save();
      await dog.save();
      res.status(200).json({ message: "Created new report" });
    } else {
      res.status(403).json({ message: "Unauthorized Access" });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error updating careTakerDetails in do :" + error.message,
    });
  }
});

module.exports = router;

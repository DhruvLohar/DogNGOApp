const express = require("express");
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const router = express.Router();

const {
  Dog,
  Catcher,
  Doctor,
  DailyMonitoring,
  CareTaker,
} = require("../models/Dog");
const Image = require("../models/Image");
const Kennel = require("../models/Kennel");

const authenticateToken = require("../middleware/authenticateToken");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});
// const fileUpload = multer({ dest: "uploads/" });
const fileUpload = multer({ storage: storage });

router.post("/report/xlsx", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const dogs = await Dog.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate({
      path: "catcherDetails",
      select: "spotPhoto",
      populate: {
        path: "spotPhoto",
        model: "Image",
        select: "path",
      },
    });

    res.status(200).json(dogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating reports : " + error.message });
  }
});

router.get("/:id/report/xlsx", async (req, res) => {
  const BASE_URL = `${req.protocol}://${req.hostname}:3500/`;

  try {
    if (req) {
      const dogId = req.params.id;
      const dog = await Dog.findById(dogId).populate([
        {
          path: "catcherDetails",
          populate: [
            {
              path: "catcher",
              select: "_id name contactNumber role",
            },
            {
              path: "spotPhoto",
              select: "path",
            },
          ],
        },
        {
          path: "vetDetails",
          populate: [
            {
              path: "vet",
              select: "_id name contactNumber role",
            },
            {
              path: "surgeryPhoto",
              select: "path",
            },
          ],
        },
        {
          path: "careTakerDetails",
          populate: [
            {
              path: "careTaker",
              select: "_id name contactNumber role",
            },
            {
              path: "reports",
              populate: {
                path: "photo",
                select: "path",
              },
            },
          ],
        },
        {
          path: "kennel",
        },
      ]);

      if (!dog) {
        return res.status(404).json({ error: "Dog not found" });
      }

      const workBook = XLSX.utils.book_new();

      if (dog) {
        const dogDetails = [
          {
            "Dog ID": dog._id.toString(),
            // "Dog Name": dog.dogName,
            "Dog's Main Color": dog.mainColor,
            "Dog Gender": dog.gender,
            Description: dog.description,
            // "Is Agressive?": dog.agression,
          },
        ];
        const ddws = XLSX.utils.json_to_sheet(dogDetails);
        XLSX.utils.book_append_sheet(workBook, ddws, "Dog Details");
      }

      if (dog.catcherDetails) {
        const catcherDetails = [
          {
            "Catcher ID": dog.catcherDetails.catcher._id.toString(),
            Name: dog.catcherDetails.catcher.name,
            "Contact Number": dog.catcherDetails.catcher.contactNumber,
            "Catching Location": dog.catcherDetails.catchingLocation,
            "Catching Location Details": dog.catcherDetails.locationDetails,
            "Releasing Location": dog.catcherDetails.releasingLocation,
            "Catched At": dog.catcherDetails.createdAt.toString(),
            "Spot Photo": {
              t: "s",
              v: "Click to open photo",
              l: { Target: BASE_URL + dog.catcherDetails.spotPhoto.path },
              s: { font: { color: { rgb: "0000FFFF" }, underline: true } },
            },
          },
        ];
        const cdws = XLSX.utils.json_to_sheet(catcherDetails);
        XLSX.utils.book_append_sheet(workBook, cdws, "Catcher Details");
      }

      if (dog.vetDetails) {
        const vetDetails = [
          {
            "Vet ID": dog.vetDetails.vet._id.toString(),
            Name: dog.vetDetails.vet.name,
            "Contact Number": dog.vetDetails.vet.contactNumber,
            "Surgery date": dog.vetDetails.surgeryDate.toString(),

            "Surgery Photo": {
              t: "s",
              v: "Click to open photo",
              l: { Target: BASE_URL + dog.vetDetails.surgeryPhoto.path },
              s: { font: { color: { rgb: "0000FFFF" }, underline: true } },
            },
          },
        ];
        Object.keys(dog.vetDetails._doc).map((key, i) => {
          if (
            ![
              "surgeryPhoto",
              "additionalPhotos",
              "surgeryDate",
              "createdAt",
              "updatedAt",
              "additionalNotesPhotos",
            ].includes(key)
          ) {
            vetDetails[0] = { ...vetDetails[0], [key]: dog.vetDetails[key] };
          }
        });
        const vdws = XLSX.utils.json_to_sheet(vetDetails);
        XLSX.utils.book_append_sheet(workBook, vdws, "Vet Details");
      }

      if (dog.careTakerDetails) {
        const careTakerDetails = [
          {
            "Caretaker ID": dog.careTakerDetails.careTaker._id.toString(),
            Name: dog.careTakerDetails.careTaker.name,
            "Contact Number": dog.careTakerDetails.careTaker.contactNumber,
          },
        ];

        const reportsDetails = [];
        dog.careTakerDetails.reports.map((report) => {
          reportsDetails.push({
            "Report ID": report._id.toString(),
            "Food Intake": report.foodIntake,
            "Water Intake": report.waterIntake,
            Antibiotics: report.antibiotics,
            Painkiller: report.painkiller,

            // "Observations": report.observations,
            Photo: {
              t: "s",
              v: "Click to open photo",
              l: { Target: BASE_URL + report.photo.path },
              s: { font: { color: { rgb: "0000FFFF" }, underline: true } },
            },
            Date: report.date.toString(),
          });
        });

        const ctws = XLSX.utils.json_to_sheet([
          ...careTakerDetails,
          ...reportsDetails,
        ]);
        XLSX.utils.book_append_sheet(workBook, ctws, "Caretaker Details");
      }

      const filePath = path.join(__dirname, "../public", "dog_details.xlsx");
      XLSX.writeFile(workBook, filePath);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${dog.dogName} (${dog._id.toString()}).xlsx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.download(filePath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).json({ error: "Error sending file" });
        }
      });

      // res.status(200).json({ message: "Report generated successfully", dog: dog })
    } else {
      res.status(403).json({ message: "Unauthorized Access" });
    }
  } catch (error) {
    console.log("[report error] : " + error.message);
    res
      .status(500)
      .json({ error: "Error generating a report : " + error.message });
  }
});

// Get : dogs for inital observations (dogs with no kennel)
router.get("/observable", authenticateToken, async (req, res) => {
  try {
    const dogs = await Dog.find({ kennel: { $exists: false } })
      .populate({
        path: "catcherDetails",
        select: "catchingLocation",
        populate: {
          path: "spotPhoto",
          model: "Image",
        },
      })
      .populate({
        path: "careTakerDetails",
        populate: {
          path: "caretaker",
          select: "_id name contactNumber",
        },
      })
      .populate("kennel");

    res.status(200).json(dogs);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving dogs : " + error.message });
  }
});

// Get : dogs whose surgery date has past 3 days
router.get("/dispatchable", authenticateToken, async (req, res) => {
  try {
    // Calculate the date 3 days ago from the current date
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Find dogs with surgery date in the past 3 days
    const dogs = await Dog.find({
      $or: [
        { "vetDetails.surgeryDate": { $lte: threeDaysAgo } },
        {
          $and: [
            // Assuming surgeryDate is stored as a string
            { "vetDetails.surgeryDate": { $type: "string" } },
            { "vetDetails.surgeryDate": { $lte: threeDaysAgo.toISOString() } },
          ],
        },
      ],
    })
      .populate({
        path: "catcherDetails",
        select: "catchingLocation",
        populate: {
          path: "spotPhoto",
          model: "Image",
        },
      })
      .populate({
        path: "careTakerDetails",
        populate: {
          path: "caretaker",
          select: "_id name contactNumber",
        },
      })
      .populate("kennel");

    res.status(200).json(dogs);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving dogs : " + error.message });
  }
});

// Get : dogs whose isDispatched status is true
router.get("/releasable", authenticateToken, async (req, res) => {
  try {
    const dogs = await Dog.find({ isDispatched: true }).populate([
      {
        path: "catcherDetails",
        select: "catchingLocation",
        populate: {
          path: "spotPhoto",
          model: "Image",
        },
      },
      {
        path: "careTakerDetails",
        select: "_id name contactNumber",
      },
      {
        path: "kennel",
      },
    ]);

    res.status(200).json(dogs);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving dogs" });
  }
});

// Post : dog id sent in post, should be marked as dispatched
router.post("/:id/dispatch", authenticateToken, async (req, res) => {
  try {
    const dogId = req.params.id;

    const dog = await Dog.findById(dogId);
    if (!dog) {
      res.status(404).json({ error: "Dog not found" });
    }

    dog.isDispatched = true;
    await dog.save();

    res.status(200).json({ message: "Dog was dispatched" });
  } catch (error) {
    res.status(500).json({
      error: "Error dispatching dog : " + error.message,
    });
  }
});

// Post : dog id sent in post, should be marked as released
router.post("/:id/release", authenticateToken, async (req, res) => {
  try {
    const dogId = req.params.id;
    const { releaseLocation } = req.body;

    const dog = await Dog.findById(dogId);
    if (!dog) {
      res.status(404).json({ error: "Dog not found" });
    }

    dog.isReleased = true;
    dog.releaseDate = new Date(); // set current date
    dog.releaseLocation = releaseLocation;
    await dog.save();

    res.status(200).json({ message: "Dog was released" });
  } catch (error) {
    res.status(500).json({
      error: "Error dispatching dog : " + error.message,
    });
  }
});

module.exports = router;

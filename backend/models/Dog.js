const mongoose = require("mongoose");

const catcherSchema = new mongoose.Schema({
    catcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    catchingLocation: String,
    locationDetails: String,

    releasingLocation: String,
    catchingDate: Date,

    spotPhoto: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    additionalPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],

}, { timestamps: true, versionKey: false });

const doctorSchema = new mongoose.Schema({
    vet: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    dogWeight: Number,
    temperature: Number,
    SkinCondition: String,
    
    // Medicines form
    surgeryDate: Date,
    procedure: String,
    earNotched: String,
    observations: String,
    ARV: Boolean,
    xylazine: String,
    dexa: String,
    melonex: String,
    atropine: String,
    enrodac: String,
    prednisolone: String,
    ketamin: String,
    stadren: String,
    dicrysticin: String,

    surgeryPhoto: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    additionalPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],

    surgeryNotesPhoto: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    additionalNotesPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]

}, { timestamps: true, versionKey: false });

const careTakerSchema = new mongoose.Schema({
    
    careTaker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DailyMonitoring' }] // Many-to-many relation to DailyMonitoringSchema

}, { timestamps: true, versionKey: false });

const dailyMonitoringSchema = new mongoose.Schema({
    foodIntake: String,
    waterIntake: String,
    antibiotics: String,
    painkiller: String,

    observations: String,
    photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    date: Date

}, {timestamps: true, versionKey: false});

const dogSchema = new mongoose.Schema({
    caseNumber: { type: String, unique: true },
    sequence: { type: Number, default: 1 },
    kennel: { type: mongoose.Schema.Types.ObjectId, ref: 'Kennel', required: false }, // Foreign key to Kennel

    // initial observation data
    dogName: String,
    breed: String,
    mainColor: String,
    description: String,
    gender: String,
    agression: Boolean,

    kennelPhoto: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    additionalKennelPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],

    // release form data
    isReleased: {type: Boolean, default: false},
    isDispatched: {type: Boolean, default: false},

    releaseDate: Date,
    releaseLocation: String, 

    catcherDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Catcher' }, // Foreign key to Catcher
    vetDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Foreign key to Doctor
    careTakerDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'CareTaker' } // Foreign key to CareTaker

}, { timestamps: true, versionKey: false });

dogSchema.statics.generateCaseNumber = async function () {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = currentDate
        .toLocaleString("default", { month: "short" })
        .toUpperCase();
    const day = String(currentDate.getDate()).padStart(2, "0");

    const lastGeneratedDate = this.createdAt;

    if (
        lastGeneratedDate &&
        lastGeneratedDate.getDate() === currentDate.getDate() &&
        lastGeneratedDate.getMonth() === currentDate.getMonth() &&
        lastGeneratedDate.getFullYear() === currentDate.getFullYear()
    ) {
        this.sequence += 1;
    } else {
        this.sequence = 1;
    }

    this.LastGeneratedDate = currentDate;

    const sequence = this.sequence >= 10 ? this.sequence : `0${this.sequence}`;

    const caseNumber = `${year}-${month}-${day}-${sequence}`;

    const existingDog = await this.findOne({ caseNumber });

    if (existingDog) {
        return this.generateCaseNumber(); // If caseNumber is not unique, generate a new one
    }

    return caseNumber;
};


const Catcher = mongoose.model('Catcher', catcherSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const DailyMonitoring = mongoose.model('DailyMonitoring', dailyMonitoringSchema);
const CareTaker = mongoose.model('CareTaker', careTakerSchema);
const Dog = mongoose.model('Dog', dogSchema);

module.exports = {
    Catcher,
    Doctor,
    DailyMonitoring,
    CareTaker,
    Dog
};
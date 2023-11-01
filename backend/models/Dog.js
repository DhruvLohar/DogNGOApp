const mongoose = require("mongoose");

const catcherSchema = new mongoose.Schema({
    catcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    isReleased: {type: Boolean, default: false},
    releaseDate: Date,

    location: String,
    locationDetails: String

}, { timestamps: true, versionKey: false });


const doctorSchema = new mongoose.Schema({
    vet: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    dogWeight: Number,
    temperature: Number,

    agression: String,
    SkinCondition: String,
    procedure: String,
    earNotched: String,
    observations: String,

    surgeryDate: Date,

    ARV: String,
    xylazine: String,
    dexa: String,
    melonex: String,
    atropine: String,
    enrodac: String,
    prednisolone: String,
    ketamin: String,
    stadren: String,
    dicrysticin: String,
}, { timestamps: true, versionKey: false });

const dailyMonitoringSchema = new mongoose.Schema({
    foodIntake: Number,
    waterIntake: Number,
    observations: String,
    treatment: String,
}, {timestamps: true, versionKey: false});

const careTakerSchema = new mongoose.Schema({
    
    careTaker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DailyMonitoring' }] // Many-to-many relation to DailyMonitoringSchema

}, { timestamps: true, versionKey: false });

const dogSchema = new mongoose.Schema({
    caseNumber: { type: String, unique: true },
    sequence: { type: Number, default: 1 },
    kennel: { type: mongoose.Schema.Types.ObjectId, ref: 'Kennel', required: true }, // Foreign key to Kennel

    dogName: String,
    breed: String,
    mainColor: String,
    description: String,
    gender: String,

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
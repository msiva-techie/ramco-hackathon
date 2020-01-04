"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/hackathon', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected successfull!');
});
let geoSchema = new Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
});
let shopSchema = new Schema({
    shopName: {
        type: String,
        index: true,
        required: true,
        unique: false
    },
    location: geoSchema,
    products: [
        {
            productName: String,
            description: String,
            category: String,
            stock: Number
        }
    ]
});
const deliverySchema = new Schema({
    centroid: [geoSchema],
    cluster: [[geoSchema]]
});
exports.Shop = mongoose.model('Shop', shopSchema);
exports.DeliveryBoy = mongoose.model('DeliveryBoy', deliverySchema);
//# sourceMappingURL=schema.js.map
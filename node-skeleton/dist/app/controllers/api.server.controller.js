"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kmeans = require('node-kmeans');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const axios = require('axios');
exports.helloWorld = function (req, res) {
    return res.status(200).jsonp({
        message: 'Hello World!'
    });
};
exports.getKmeans = function (req, res) {
};
exports.getEloRating = function () {
    let EloRank = require('elo-rank');
    let elo = new EloRank(15);
    let playerA = 1200;
    let playerB = 1400;
    let expectedScoreA = elo.getExpected(playerA, playerB);
    let expectedScoreB = elo.getExpected(playerB, playerA);
    playerA = elo.updateRating(expectedScoreA, 1, playerA);
    playerB = elo.updateRating(expectedScoreB, 0, playerB);
};
exports.getResult = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('req.body....', req.body);
        MongoClient.connect(url, function (err, client) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.jsonp({
                        err: err.toString()
                    });
                }
                try {
                    console.log('Connected successfully to server');
                    const db = client.db('hackathon');
                    console.log('product...', req.body.product);
                    let data = yield db
                        .collection('Shop')
                        .find({
                        products: {
                            $elemMatch: {
                                name: req.body.product,
                                stock: {
                                    $gte: req.body.quantity
                                }
                            }
                        }
                    })
                        .toArray();
                    console.log('Found the following records');
                    let vectors = [];
                    console.log('111111.....', data);
                    for (let i = 0; i < data.length; i++) {
                        vectors[i] = [data[i]['location'][0], data[i]['location'][1]];
                    }
                    console.log('kmeans....', vectors);
                    let k = vectors.length <= 4 ? 1 : 4;
                    kmeans.clusterize(vectors, { k }, (err, response) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            res.jsonp({
                                err
                            });
                        }
                        let distanceObj = [];
                        console.log('response.....', response);
                        for (let obj of response) {
                            distanceObj.push({
                                distance: Math.sqrt(Math.pow(req.body.latitude - obj.centroid[0], 2) +
                                    Math.pow(req.body.longitude - obj.centroid[1], 2)),
                                centroid: obj.centroid,
                                cluster: obj.cluster
                            });
                        }
                        distanceObj.sort((a, b) => (a.distance > b.distance ? 1 : -1));
                        distanceObj[0].cluster.sort((a, b) => (a > b ? 1 : -1));
                        console.log('distanceObj...', distanceObj[0].cluster);
                        let radiusPoints = [];
                        distanceObj[0].cluster.forEach(element => {
                            radiusPoints.push({
                                distance: Math.sqrt(Math.pow(distanceObj[0].centroid[0] - element[0], 2) +
                                    Math.pow(distanceObj[0].centroid[1] - element[1], 2)),
                                element: element
                            });
                        });
                        radiusPoints.sort((a, b) => (a.distance < b.distance ? 1 : -1));
                        console.log('radiusPoints...', radiusPoints);
                        let radius = radiusPoints[0].distance;
                        console.log('radius...', radius);
                        data = yield db
                            .collection('DeliveryBoy')
                            .find({})
                            .toArray();
                        let deliveryBoyInsideCluster = [];
                        data.forEach(elem => {
                            let x = Math.pow(elem.location[0] - distanceObj[0].centroid[0], 2) +
                                Math.pow(elem.location[1] - distanceObj[0].centroid[1], 2) <
                                Math.pow(radius, 2);
                            if (x) {
                                deliveryBoyInsideCluster.push(elem);
                            }
                        });
                        let areaOfTriangle = [];
                        console.log('deliveryBoyInsideCluster....', deliveryBoyInsideCluster);
                        for (let i = 0; i < distanceObj[0].cluster.length; i++) {
                            for (let j = 0; j < deliveryBoyInsideCluster.length; j++) {
                                let area = 0.5 *
                                    (deliveryBoyInsideCluster[j].location[0] *
                                        (distanceObj[0].cluster[i][1] -
                                            req.body.longitude) +
                                        distanceObj[0].cluster[i][0] *
                                            (req.body.longitude -
                                                deliveryBoyInsideCluster[j]
                                                    .location[1]) +
                                        req.body.latitude *
                                            (deliveryBoyInsideCluster[j].location[1] -
                                                distanceObj[0].cluster[i][1]));
                                areaOfTriangle.push({
                                    area: area,
                                    shop: distanceObj[0].cluster[i],
                                    deliveryBoy: deliveryBoyInsideCluster[j]
                                });
                            }
                        }
                        areaOfTriangle.sort((a, b) => (a.area > b.area ? 1 : -1));
                        console.log(areaOfTriangle);
                        console.log('result..', areaOfTriangle[0]);
                        let d1, d2, t1, t2;
                        let output1 = yield axios.post(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=WNZEnHXpkJZNU2PgJ7asjFO9W333rx352PUBT8XcRSQ&waypoint0=geo!${areaOfTriangle[0].deliveryBoy.location[0]},${areaOfTriangle[0].deliveryBoy.location[1]}&waypoint1=geo!${areaOfTriangle[0].shop[0]},${areaOfTriangle[0].shop[1]}&mode=fastest;scooter;traffic:enabled`, {});
                        console.log('location111....', output1.data.response.route[0].summary);
                        d1 = output1.data.response.route[0].summary.distance / 1000;
                        t1 = output1.data.response.route[0].summary.travelTime / 60;
                        console.log('val1....', areaOfTriangle[0].shop[0]);
                        console.log('val2....', areaOfTriangle[0].shop[1]);
                        console.log('val3.....', req.body.latitude);
                        console.log('val4.....', req.body.longitude);
                        console.log(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=WNZEnHXpkJZNU2PgJ7asjFO9W333rx352PUBT8XcRSQ&waypoint0=geo!${areaOfTriangle[0].shop[0]},${areaOfTriangle[0].shop[1]}&waypoint1=geo!${req.body.latitude},${req.body.longitude}&mode=fastest;scooter;traffic:enabled`);
                        let output2 = yield axios.post(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=WNZEnHXpkJZNU2PgJ7asjFO9W333rx352PUBT8XcRSQ&waypoint0=geo!${areaOfTriangle[0].shop[0]},${areaOfTriangle[0].shop[1]}&waypoint1=geo!${req.body.latitude},${req.body.longitude}&mode=fastest;scooter;traffic:enabled`, {});
                        console.log('location', output2.data.response.route[0].summary);
                        d2 = output2.data.response.route[0].summary.distance / 1000;
                        t2 = output2.data.response.route[0].summary.travelTime / 60;
                        console.log('d1', d1);
                        console.log('d2', d2);
                        console.log('t1', t1);
                        console.log('t1', t2);
                        res.jsonp({
                            distance: d1 + d2,
                            ETA: t1 + t2,
                            result: areaOfTriangle[0]
                        });
                    }));
                }
                catch (err) {
                    res.jsonp({
                        err: err.toString()
                    });
                }
            });
        });
    });
};
//# sourceMappingURL=api.server.controller.js.map
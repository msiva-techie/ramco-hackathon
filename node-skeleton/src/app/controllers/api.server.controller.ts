const kmeans = require('node-kmeans');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const axios = require('axios');
// const util = require('util');
// const eloRank = require('elo-rank');

/**
 * SAMPLE FUNCTION - CAN BE REMOVED
 * @param req Request
 * @param res Response
 */
export const helloWorld = function(req, res) {
    return res.status(200).jsonp({
        message: 'Hello World!'
    });
};

// eslint-disable-next-line require-jsdoc
// function sendError(err, res) {
//     console.log('Error.....', err);
//     return res.jsonp({
//         err,
//         user: 0,
//         message: 'Error occured...'
//     });
// }

export const getKmeans = function(req, res) {
    // Shop.find({}, function(err, data) {
    //     if (err) {
    //         return sendError(err, res);
    //     }
    //     // Create the data 2D-array (vectors) describing the data
    //     let vectors = [];
    //     console.log('data.....', data);
    //     for (let i = 0; i < data.length; i++) {
    //         vectors[i] = [data[i]['coordinates'][0], data[i]['coordinates'][1]];
    //     }
    //     kmeans.clusterize(vectors, { k: 6 }, (err, response) => {
    //         if (err) {
    //             console.error(err);
    //         } else {
    //             console.log('%o', response);
    //             res.jsonp({
    //                 response
    //             });
    //         }
    //     });
    // });
};

export const getEloRating = function() {
    // create object with K-Factor(without it defaults to 32)
    let EloRank = require('elo-rank');
    let elo = new EloRank(15);

    let playerA = 1200;
    let playerB = 1400;

    // Gets expected score for first parameter
    let expectedScoreA = elo.getExpected(playerA, playerB);
    let expectedScoreB = elo.getExpected(playerB, playerA);

    // update score, 1 if won 0 if lost
    playerA = elo.updateRating(expectedScoreA, 1, playerA);
    playerB = elo.updateRating(expectedScoreB, 0, playerB);
};

export const getResult = async function(req, res) {
    // latitude, longitude, product, quantity
    // DD = d + (min/60) + (sec/3600)
    // (x - center_x)^2 + (y - center_y)^2 < radius^2
    // Value from Shop (retail outlet) db
    console.log('req.body....', req.body);
    MongoClient.connect(url, async function(err, client) {
        if (err) {
            res.jsonp({
                err: err.toString()
            });
        }
        try {
            console.log('Connected successfully to server');
            const db = client.db('hackathon');
            // Find some documents
            console.log('product...', req.body.product);
            let data = await db
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
            if (data.length === 0) {
                return res.jsonp({
                    message: 'Stock not available',
                    stock: 0
                });
            }
            console.log('Found the following records');
            // console.log(data[0].products[0]);
            // Create the data 2D-array (vectors) describing the data
            let vectors = [];
            console.log('111111.....', data);
            for (let i = 0; i < data.length; i++) {
                vectors[i] = [data[i]['location'][0], data[i]['location'][1]];
            }
            // vectors.push([latitude, longitude]);
            console.log('kmeans....', vectors);
            let k = vectors.length <= 4 ? 1 : 4;
            kmeans.clusterize(vectors, { k }, async (err, response) => {
                if (err) {
                    res.jsonp({
                        err
                    });
                }
                let distanceObj = [];
                console.log('response.....', response);
                // Finding the distance between centroids and user location
                for (let obj of response) {
                    distanceObj.push({
                        distance: Math.sqrt(
                            Math.pow(req.body.latitude - obj.centroid[0], 2) +
                                Math.pow(
                                    req.body.longitude - obj.centroid[1],
                                    2
                                )
                        ),
                        centroid: obj.centroid,
                        cluster: obj.cluster
                    });
                }

                // Finding the minimum distance
                distanceObj.sort((a, b) => (a.distance > b.distance ? 1 : -1));
                // let initial = distanceObj[0]
                // let minInsideCluster = [];
                distanceObj[0].cluster.sort((a, b) => (a > b ? 1 : -1));
                console.log('distanceObj...', distanceObj[0].cluster);
                let radiusPoints = [];
                distanceObj[0].cluster.forEach(element => {
                    radiusPoints.push({
                        distance: Math.sqrt(
                            Math.pow(
                                distanceObj[0].centroid[0] - element[0],
                                2
                            ) +
                                Math.pow(
                                    distanceObj[0].centroid[1] - element[1],
                                    2
                                )
                        ),
                        element: element
                    });
                });
                radiusPoints.sort((a, b) => (a.distance < b.distance ? 1 : -1));
                console.log('radiusPoints...', radiusPoints);
                let radius = radiusPoints[0].distance; // radius of cluster
                console.log('radius...', radius);
                // resolve(distanceObj[0].cluster[0]);
                // check whether deliveryboy location is in cluster
                data = await db
                    .collection('DeliveryBoy')
                    .find({})
                    .toArray();
                // console.log('available delivery boys....', data);
                let deliveryBoyInsideCluster = [];
                data.forEach(elem => {
                    let x =
                        Math.pow(
                            elem.location[0] - distanceObj[0].centroid[0],
                            2
                        ) +
                            Math.pow(
                                elem.location[1] - distanceObj[0].centroid[1],
                                2
                            ) <
                        Math.pow(radius, 2);
                    if (x) {
                        deliveryBoyInsideCluster.push(elem);
                    }
                });
                let areaOfTriangle = [];
                console.log(
                    'deliveryBoyInsideCluster....',
                    deliveryBoyInsideCluster
                );
                for (let i = 0; i < distanceObj[0].cluster.length; i++) {
                    for (let j = 0; j < deliveryBoyInsideCluster.length; j++) {
                        let area =
                            0.5 *
                            (deliveryBoyInsideCluster[j].location[0] *
                                (distanceObj[0].cluster[i][1] -
                                    req.body.longitude) +
                                distanceObj[0].cluster[i][0] *
                                    (req.body.longitude -
                                        deliveryBoyInsideCluster[j]
                                            .location[1]) +
                                req.body.latitude *
                                    (deliveryBoyInsideCluster[j].location[1] -
                                        distanceObj[0].cluster[i][1])); // area of triangle

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
                // console.log('result2......', Math.abs(areaOfTriangle[0]));
                let d1, d2, t1, t2;
                let output1 = await axios
                    .post(
                        `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=WNZEnHXpkJZNU2PgJ7asjFO9W333rx352PUBT8XcRSQ&waypoint0=geo!${areaOfTriangle[0].deliveryBoy.location[0]},${areaOfTriangle[0].deliveryBoy.location[1]}&waypoint1=geo!${areaOfTriangle[0].shop[0]},${areaOfTriangle[0].shop[1]}&mode=fastest;scooter;traffic:enabled`,
                        {}
                    )
                    .catch(function(err) {
                        console.log(err.toString());
                    });
                console.log(
                    'location111....',
                    output1.data.response.route[0].summary
                );
                d1 = output1.data.response.route[0].summary.distance / 1000;
                t1 = output1.data.response.route[0].summary.travelTime / 60;

                console.log('val1....', areaOfTriangle[0].shop[0]);
                console.log('val2....', areaOfTriangle[0].shop[1]);
                console.log('val3.....', req.body.latitude);
                console.log('val4.....', req.body.longitude);
                console.log(
                    `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=WNZEnHXpkJZNU2PgJ7asjFO9W333rx352PUBT8XcRSQ&waypoint0=geo!${areaOfTriangle[0].shop[0]},${areaOfTriangle[0].shop[1]}&waypoint1=geo!${req.body.latitude},${req.body.longitude}&mode=fastest;scooter;traffic:enabled`
                );
                let output2 = await axios
                    .post(
                        `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=WNZEnHXpkJZNU2PgJ7asjFO9W333rx352PUBT8XcRSQ&waypoint0=geo!${areaOfTriangle[0].shop[0]},${areaOfTriangle[0].shop[1]}&waypoint1=geo!${req.body.latitude},${req.body.longitude}&mode=fastest;scooter;traffic:enabled`,
                        {}
                    )
                    .catch(function(err) {
                        console.log(err.toString());
                    });

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
            });
        } catch (err) {
            console.log('error.....', err.toString());
            res.jsonp({
                err: err.toString()
            });
        }
    });
};

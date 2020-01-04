import { Shop, DeliveryBoy } from './../../schema/schema';
const kmeans = require('node-kmeans');
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
function sendError(err, res) {
    console.log('Error.....', err);
    return res.jsonp({
        err,
        user: 0,
        message: 'Error occured...'
    });
}

export const getKmeans = function(req, res) {
    Shop.find({}, function(err, data) {
        if (err) {
            return sendError(err, res);
        }
        // Create the data 2D-array (vectors) describing the data
        let vectors = [];
        console.log('data.....', data);
        for (let i = 0; i < data.length; i++) {
            vectors[i] = [data[i]['coordinates'][0], data[i]['coordinates'][1]];
        }
        kmeans.clusterize(vectors, { k: 6 }, (err, response) => {
            if (err) {
                console.error(err);
            } else {
                console.log('%o', response);
                res.jsonp({
                    response
                });
            }
        });
    });
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

export const getResult = function(req, res) {
    // latitude, longitude, product, quantity
    // DD = d + (min/60) + (sec/3600)
    // (x - center_x)^2 + (y - center_y)^2 < radius^2
    // Value from Shop (retail outlet) db
    Shop.find(
        {
            products: {
                $elemMatch: {
                    productName: {
                        $in: [req.body.product],
                        stock: {
                            $gte: req.body.quantity
                        }
                    }
                }
            }
        },
        function(err, data) {
            if (err) {
                res.jsonp({
                    err
                });
            }
            // Create the data 2D-array (vectors) describing the data
            let vectors = [];
            console.log('data.....', data);
            for (let i = 0; i < data.length; i++) {
                vectors[i] = [
                    data[i]['coordinates'][0],
                    data[i]['coordinates'][1]
                ];
            }
            // vectors.push([latitude, longitude]);
            kmeans.clusterize(vectors, { k: 6 }, (err, response) => {
                if (err) {
                    res.jsonp({
                        err
                    });
                }
                let distanceObj = [];
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
                let radius = radiusPoints[0].distance; // radius of cluster
                // resolve(distanceObj[0].cluster[0]);

                // check whether deliveryboy location is in cluster
                DeliveryBoy.find({}, function(err, data) {
                    if (err) {
                        res.jsonp({
                            err
                        });
                    }
                    let deliveryBoyInsideCluster = [];
                    data.forEach(elem => {
                        let x =
                            Math.pow(
                                elem.location[0] - distanceObj[0].centroid[0],
                                2
                            ) +
                                Math.pow(
                                    elem.location[1] -
                                        distanceObj[0].centroid[1],
                                    2
                                ) <
                            Math.pow(radius, 2);
                        if (x) {
                            deliveryBoyInsideCluster.push(elem);
                        }
                        let areaOfTriangle = [];
                        for (
                            let i = 0;
                            i < distanceObj[0].cluster.length;
                            i++
                        ) {
                            for (
                                let j = 0;
                                j < deliveryBoyInsideCluster.length;
                                j++
                            ) {
                                let area =
                                    0.5 *
                                    (deliveryBoyInsideCluster[j][0] *
                                        (distanceObj[0].cluster[i][1] -
                                            req.body.longitude) +
                                        distanceObj[0].cluster[i][0] *
                                            (req.body.longitude -
                                                deliveryBoyInsideCluster[
                                                    j
                                                ][1]) +
                                        req.body.latitude *
                                            (deliveryBoyInsideCluster[j][1] -
                                                distanceObj[0].cluster[i][1])); // area of triangle
                                areaOfTriangle.push({
                                    area,
                                    shop: distanceObj[0].cluster[i],
                                    devileryBoy: deliveryBoyInsideCluster[j]
                                });
                            }
                        }
                        areaOfTriangle.sort((a, b) =>
                            a.area > b.area ? 1 : -1
                        );
                        res.jsonp({
                            result: areaOfTriangle[0]
                        });
                    });
                });
            });
        }
    );
};

'use strict';

import { getMetrics } from '../controllers/metrics.server.controller';
import {
    authenticate,
    resolveToken,
    resolveSecret
} from '../controllers/auth.server.controller';
import {
    helloWorld,
    getKmeans,
    getResult
} from '../controllers/api.server.controller';

module.exports = function(app) {
    app.route('/hello').post(authenticate, helloWorld);

    app.route('/hello').get(resolveToken, resolveSecret, helloWorld);

    app.route('/metrics').get(getMetrics);

    app.route('/kmeans').get(getKmeans);

    app.route('/result').post(getResult);

    // Set params if needed
    // app.param('Id', apiCtrl.func);
};

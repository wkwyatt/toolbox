import TestRoute from '../Navigation/TestRoute';

export default {
    env: "local",
    version: "0.0.1",

    check_for_update: true,
    package: 'rnToolbox',

    routes: {
        Home: TestRoute
    },

    initialRouteName: 'Home',

    licenseCheck: {
        tokenRequestRoute: '/services/apexrest/MALiveAvail/MALiveApp/AuthToken/v2',
        checkValidAPIToken: false,
    },

    developerAccessCode: "Saber123!",

    maxEventsPerPost: 40,
};

// @flow

import { Util } from "../Helpers"
import Device from "../Modules/Device"


let device = Device.current(),
    dimensions = device.screenDimensons();

const width = Util.min([
    dimensions.width, 
    dimensions.height,
]);

const height = Util.max([
    dimensions.width, 
    dimensions.height,
]);

const Metric = {
    marginHorizontal: 10,
    marginVertical: 10,

    baseMargin: 10,
    doubleBaseMargin: 20,
    smallMargin: 5,

    section: 25,

    tabbarHeight: 0,

    screenWidth: width,
    screenHeight: height,

    percentOfScreenWidth(percent) {
        return percent * width;
    },
    percentOfScreenHeight(percent) {
        return percent * height;
    },

    navbarInput: 55,

    buttonRadius: 4,

    icons: {
        xs: 15,
        sm: 20,
        md: device.isPhone() ? 28 : 35,
        lg: device.isPhone() ? 35 : 60,
        xl: 60,
    },
};

Metric.percentOfScreenHeight = (percent) => {
    return percent * this.screenHeight;
};


Metric.navBarHeight = device.isApple() ? 64 : 54;
if (!device.isPhone() || device.isiPhoneX()) {
    Metric.navBarHeight += 50;
}

Metric.containerHeight = Metric.screenHeight - Metric.navBarHeight;
if (device.isiPhoneX()) {
    Metric.containerHeight -= 50;
}

export default Metric;
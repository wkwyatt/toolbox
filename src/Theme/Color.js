// @flow

import { Util } from "../Helpers"

const Pallete = {

    primary: '#0071ce',
    primaryDark: '#0077bb',
    primaryLight: '#0096ff',

    info: '#3381d1',

    accent: '#14315d',
    accentAlpha: 'rgba(29,54,93,0.65)',

    success: '#4cc87f',
    successDark: '#318050',
    danger: 'rgba(200, 0, 0, 0.8)',

    loader: 'rgba(0, 0, 0, 0.45)',



    clear: 'rgba(0,0,0,0)',
    transparent: 'rgba(0,0,0,0)',

    offWhiteBg: '#f5f6f7',
    separator: '#edeeef',
    redCerise: '#E93A8A',
    redBittersweet: '#FD6B59',
    redValencia: '#D4504C',

    yellowSun: '#FFB50E',

    greenPersian: '#4dc980',
    greenEmerald: '#44CB7E',
    darkGreenForest: '#579E75',

    blueSherpa: '#1d365d',
    greenSherpa: '#003C4C',
    blueGrayWaikawa: '#6e8cc0',
    lightBlueSail: '#A8CBF8',

    purpleHeart: '#9735BF',

    grayScorpion: '#565656',
    grayAthens: '#F2F4F6',
    gray: '#d6dce5',

    silver: '#F7F7F7',
    steel: '#6c6c6c',

    panther: '#353535',
    charcoal: '#595959',
    coal: '#2d2d2d',

    ricePaper: 'rgba(255,255,255, 0.75)',
    frost: '#D8D8D8',
    cloud: 'rgba(200,200,200, 0.35)',
    windowTint: 'rgba(0, 0, 0, 0.35)',

    white: '#ffffff',

    
}

class Color
{
    has(name)
    {
        return Util.get(this, name) !== undefined;
    }

    hexToRGB(hex, alpha = false)
    {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(!result) return hex;
        let values =  {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };

        if(alpha) {
            return `rgba(${values.r},${values.g},${values.b},${alpha})`
        }

        return `rgb(${values.r},${values.g},${values.b})`
    }
}

for (let name in Pallete) {
    Color.prototype[name] = Pallete[name];
}

export default Color
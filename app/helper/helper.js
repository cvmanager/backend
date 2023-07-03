
let mobileFormat = /^98\d{10}\s*?$/;
import i18n from './middlewares/lang.middleware.js'

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getEnume(entity,section){
    return Object.keys(i18n.__(`${entity}.enums.${section}`));
}

export { mobileFormat, getRandomColor,getEnume}
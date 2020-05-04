const moment = require('moment');

function formatMessages(username,msg){
    return {
        username, 
        msg,
        date: moment().format('h:mm a')
    }
}
module.exports = formatMessages;
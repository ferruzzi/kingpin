const logger = require('winston');

function verifyInput(args) {
    const validTimes = ['w', 'd', 'h', 'm', 's'];

    // Validate input
    if (args.length >= 4) {
        if (!isNaN(parseInt(args[1], 10))) {
            if (validTimes.includes(args[2].charAt(0).toLowerCase())) {
                return true;
            }
        }
    }
    // if not valid input then return false
    return false;
}

function setTimer(msg, args) {

//     TODO: catch if arg[0] ends with a letter (ie: 10s) then split it
    let timeUnit = '';
    let timeout = 1;
    const validInput = verifyInput(args);
    const message =  args.slice(3).join(' ');

    if (!validInput) {
        // If input is not valid, reply with the correct syntax
        msg.channel.send(`The correct format for a timer is:  !t {duration} {units} {message} ` +
            `for example:\n\t !t 10 s win the war`);
        // and log it
        logger.error(`${msg.member.nickname} attempted to set a timer using "${msg.content}".`)
        return;
    }

//     TODO:  consider converting this to use parse-duration:  https://www.npmjs.com/package/parse-duration
    // Next, convert the entered unit of time to milliseconds
    switch (args[2].charAt(0).toLowerCase()) {
        case 'w':
            timeUnit = 'weeks';
            timeout = args[1] * 604800000;
            break;
        case 'd':
            timeUnit = 'days';
            timeout = args[1] * 86400000;
            break;
        case 'h':
            timeUnit = 'hours';
            timeout = args[1] * 3600000;
            break;
        case 'm':
            timeUnit = 'minutes';
            timeout = args[1] * 60000;
            break;
        case 's':
            timeUnit = 'seconds';
            timeout = args[1] * 1000;
            break;
        default:
        // msg.channel.send(`I do not understand ${args[2]} as a unit of time.`);
    }

    // Confirm that the input was valid
    msg.channel.send(`I will remind you to ${message} in ${args[1]} ${timeUnit}.`);
    logger.info(`Adding a reminder to ${message} in ${args[1]} ${timeUnit}`);

    // Create a function that will post a message at the given time
    setTimeout(function () {
        msg.channel.send(`It is time to ${message}!`);
        logger.debug(`Reminder sent to ${message}`);
    }, timeout);
}

module.exports.setTimer = setTimer;

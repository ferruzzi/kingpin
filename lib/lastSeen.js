const logger = require('winston');
const common = require('./common.js');

function parseLog(msg, messageLog) {
    const activeMembers = common.updateMembers(msg.guild);

    activeMembers.forEach(member => {
        logger.debug(`${member.user.username}\t\t\t${messageLog[member.user.username]}`);

        const daysOff = Math.ceil(Math.abs(Date.now() - messageLog[member.user.username]) / (1000 * 3600 * 24));

        // If they have been offline for a week
        if (messageLog[member.user.username] && (daysOff > 7)) {
            // snitch
            msg.channel.send(`${member.user.username} hasn't posted on Discord in over a week.`);
        }
    });
}

module.exports.parseLog = parseLog;

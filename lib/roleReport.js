const logger = require('winston');
const common = require('./common.js');

function updateRoles(msg) {
    // Crawls all user names for roles, assigns roles, then reports totals
    const roles = {
        logging: [],
        mining: [],
        harvesting: [],
        skinning: [],
        smithing: [],
        engineering: [],
        outfitting: [],
        cooking: [],
        alchemy: [],
        survival: [],
        repair: [],
        rebels: []
    };

    logger.info(`Roles reset`);

    const activeMembers = common.updateMembers(msg.guild);

//        if (member.roles.map(r => `${r.name}`).join(` | `).includes('Active Member')) {
    activeMembers.forEach(member => {
        logger.info(`Checking ${member.user.username}`);
        if (member.nickname) {
            if (member.nickname.includes('-')) {
                const nick = member.nickname.split('-')[0];
                const jobs = member.nickname.split('-')[1].toLowerCase();

                logger.info(`\t${nick} has their nick set`);
                logger.info(`\tjobs found for ${nick}: ${jobs}`);
                for (const role in roles) {
                    if (jobs.includes(role.substring(0, 3))) {
                        logger.info(`\t\tAdding ${role} for ${member.nickname}`);
                        roles[role].push(nick);
                    }
                }
            }
        } else {
            roles.rebels.push(member.user.username);
            logger.info(`\t${member.user.username} is a rebel and does not have their nick set.`);
        }
    });

    let report = ``;
    for (const role in roles) {
        report = report + `${common.toTitleCase(role)}:\t\t${roles[role].length}\n\t\t${roles[role].join(',  ')}\n\n\t`;
        logger.info(`${role}: \t${roles[role]}`);
    }

    msg.channel.send(`There are ${msg.guild.memberCount} people on the server, ` +
        `${activeMembers.size} of them are tagged as Active Members:\n\n\t${report}`);
}

module.exports.updateRoles = updateRoles;

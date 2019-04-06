const logger = require('winston');

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function updateMembers(guild){
    guild.fetchMembers()
        .then(logger.info(`Updated member list. ${guild.memberCount} members found on the server`));

    return guild.roles.find(role => role.name === 'Active Member').members;
}

function updateMessages(guild){
    logger.info(`Fetching messages for ${guild.channels.size} channels`);
    guild.channels.forEach(chan => {
        if (chan.type === 'text') {
            chan.fetchMessages()
                .then(logger.debug(`\t${chan.name} fetched ${chan.messages.size}`))
                .catch(function (reason) {
                    logger.error(`\t${chan.name} failed to fetch because ${reason}`);
                });
       }
    });
}

module.exports.toTitleCase = toTitleCase;
module.exports.updateMembers = updateMembers;
module.exports.updateMessages = updateMessages;

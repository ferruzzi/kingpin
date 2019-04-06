const logger = require('winston');

// How many minutes between backups
const minutes = 5;

function logMessage(msg, lastBackup, messageLog) {
    messageLog[msg.author.username] =  msg.createdAt;

    // Backup and reset the timer if the timing is right
    if (Math.ceil(Math.abs(Date.now() - lastBackup[0]) / (1000 * 60) > minutes)) {
        backupLogs(messageLog);
        lastBackup[0] = Date.now();
    }
}

function backupLogs(messageLog) {
    // write the logs to a file
    logger.error(`Backing up the logs`);
}

function importLogs(messageLog) {
    // read file to messageLog
    logger.info(`Logs imported`);
}

module.exports.logMessage = logMessage;
module.exports.backupLogs = backupLogs;
module.exports.importLogs = importLogs;

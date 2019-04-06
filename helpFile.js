function list() {
    return (`I currently support the following commands: \n\n` +
            `\t**Set a timer:**\n` +
            `\t\t!timer {number} {unit of time} {message}\n` +
            `\t\t!timer 30 min chests spawn\n` +
            '\n' +
            `\t**Display a list of roles in the company:**\n` +
            `\t\t!roles`);
}

module.exports.list = list;

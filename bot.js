// TODO: figure out how to pass these to child modules so I don't have to require logger in every child

const discord = require('discord.js'),
      logger = require('winston');

const auth = require('./auth.json'),
      pjson = require('./package.json'),
      config = require('./config.json');

const helpFile = require('./helpFile.js'),
      roleReport = require('./lib/roleReport.js'),
      timer = require('./lib/timer.js'),
      lastSeen = require('./lib/lastSeen.js'),
      chatLog = require('./lib/chatLog.js');

let messageLog = {};
let lastBackup = [];
lastBackup[0] = Date.now();

// TODO: automate "import everything in ./lib" and add a command to see what is imported that way
// TODO: each child module needs a var that relays the commands it can reply to, which is used by the MCU and helpFile


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console({
        format: logger.format.combine(
            logger.format.colorize(),
            logger.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            logger.format.printf(info =>
                `${info.timestamp} ${info.level}:\t ${info.message}`)
        )
    }));
logger.level = 'debug';

// Initialize discord Bot
const bot = new discord.Client();
bot.login(auth.token);


// Log the online status
bot.on('ready', () => {
    logger.info('Connected');
    logger.info(`Logged in as: ${bot.user.username} - (${bot.user.id})`);
    bot.channels.get('550715273645129789').send("I told you I'd be back");

    chatLog.importLogs(messageLog);
});

// Screen your messages
bot.on('message', msg => {
    // Ignore messages sent by other bots #nottodayskynet
    if (msg.author.bot) return;

    // any time a message comes in, update the author's "last seen" time
    chatLog.logMessage(msg, lastBackup, messageLog);

    // If the message starts with our assigned prefix
    if (msg.content.substring(0, 1) === config.prefix) {
        const args = msg.content.substring(1).split(' ');
        const cmd = args[0];

        switch (cmd.toLowerCase()) {
            case 'help':
                // fall through
                case 'h':
                    // fall through
                case '?':
                    msg.channel.send(`@${msg.member.nickname}, check your DMs`);
                    msg.author.send(helpFile.list());
                    break;

            case 'ping':
                // fall through
                case 'p':
                    msg.channel.send("No.  I won't say it.");
                    break;

            case 'timer':
                // fall through
                case 't':
                    timer.setTimer(msg, args);
                    break;

            case 'version':
                // fall through
                case 'ver':
                    // fall through
                case 'v':
                    msg.channel.send(`I am currently model ${pjson.version} but relax, Skynet doesn't activate ` +
                        `until at least version ${pjson.version.split('.').slice(0, -1).join('.')}.` +
                        (parseInt(pjson.version.split('.').splice(-1, 1)[0], 10) + 1));
                    break;

            case 'attendance':
                // fall through
                case 'a':
                    lastSeen.parseLog(msg, messageLog);
                    break;

            case 'roles':
                // fall through
                case 'role':
                // fall through
                case 'r':
                    roleReport.updateRoles(msg);
                    break;

            default:
                msg.channel.send('Unknown command');
        }
    }
});

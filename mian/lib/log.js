const Logger = exports = module.exports = {};

Logger.error = (msg) => {
    console.log(`[${ new Date() }] Error: ${ msg }`);
}

Logger.log = (msg) => {
    console.log(`[${ new Date() }] ${ msg }`);
}
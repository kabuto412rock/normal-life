const app = require('./app');
const db = require('./models');
const init = async (options={}) => {
    const {force} = options

    try {
        await db.sequelize.sync({
            force
        })   
        console.log("Synced db.");
    } catch (err) {
        console.log("Failed to sync db: " + err.message);  
    }
}

module.exports = {app, init}


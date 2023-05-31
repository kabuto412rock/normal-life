const app = require('./app');
const db = require('./models');
const init = async () => {
    try {
        await db.sequelize.sync()   
        console.log("Synced db.");
    } catch (err) {
        console.log("Failed to sync db: " + err.message);  
    }
}

module.exports = {app, init}


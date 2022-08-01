// @ts-check
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

class User extends Model {
    static classLevelMethod() {
        return 'foo';
    }
    instanceLevelMethod() {
        return 'bar';
    }
    getFullname() {
        return [this.firstname, this.lastname].join(' ');
    }

};
User.init({
    firstname: Sequelize.TEXT,
    lastname: Sequelize.TEXT
}, { sequelize });

console.log(User.classLevelMethod()); // 'foo'
const user = User.build({ firstname: 'Jane', lastname: 'Doe' });
console.log(user.instanceLevelMethod()); // 'bar'
console.log(user.getFullname()); // 'Jane Doe'





// console.log(User === sequelize.models.User)

// async function testSqlConnect(params) {
//     await sequelize.sync({ force: true });
//     console.log('All models were synchronized succefully')
// }
// testSqlConnect();
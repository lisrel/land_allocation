
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://postgres:password@localhost:5432/auth');

// setup User model and its fields.
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_type:{
        type:Sequelize.STRING,
        allowNull: true,
    },
    user_location:{
        type:Sequelize.STRING,
        allowNull: true,
    }
}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }, 
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
    /*instanceMethods:
    user.prototype.validPassword = function (password){
        return bcrypt.compareSync(password, this.password)
    };*/

});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occurred', error));

// export User model for use in other files.
module.exports = User;
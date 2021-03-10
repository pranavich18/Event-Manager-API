const {
  Sequelize,
  DataTypes,
  Model
} = require('sequelize');
/*
    Here,you will have to add your own configuration:
    Place the details in the corresponding spots like write your database name in place of database_name and similarly.
*/
const sequelize = new Sequelize('octo', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

const User = sequelize.define('User',{

  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  email:{
    type:DataTypes.STRING,
    allowNull:false
  }
}, {
  sequelize,
  modelName: 'User'
});

const Event = sequelize.define('Event',{

  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  },
  title:{
    type:DataTypes.STRING,
    allowNull:false
  },
  description:{
    type:DataTypes.STRING,
    allowNull:false
  },
  date:{
    type:DataTypes.DATE,
    allowNull:false
  },
  location:{
    type:DataTypes.STRING,
    allowNull:false
  },
  allowed_attendees:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  startTime:{
    type:DataTypes.TIME,
    allowNull:false
  },
  endTime:{
    type:DataTypes.TIME,
    allowNull:false
  }
}, {
  sequelize,
  modelName: 'Event'
});

const Image = sequelize.define('Image',{

  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    primaryKey:true
  },
  imagePath:{
    type:DataTypes.STRING,
    allowNull:false
  },
  eventId:{
    type:DataTypes.INTEGER,
    allowNull:false
  }
}, {
  sequelize,
  modelName:'Image'
});

const Waitlist = sequelize.define('Waitlist',{

  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    primaryKey:true
  },
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  eventId:{
    type:DataTypes.INTEGER,
    allowNull:false
  }
}, {
  sequelize,
  modelName:'Waitlist'
});

const Attendee = sequelize.define('Attendee',{

  id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  },
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  eventId:{
    type:DataTypes.INTEGER,
    allowNull:false
  }
}, {
  sequelize,
  modelName:'Attendee'
});

Event.hasMany(Image,{
  foreignKey:'id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  hooks: true
});

Image.belongsTo(User,{
  foreignKey:'eventId'
});

User.hasMany(Waitlist,{
  foreignKey:'id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  hooks: true
});

Waitlist.belongsTo(User,{
  foreignKey:'userId'
});

Event.hasMany(Waitlist,{
  foreignKey:'id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  hooks: true
});

Waitlist.belongsTo(Event,{
  foreignKey:'eventId'
});

User.hasMany(Attendee,{
  foreignKey:'id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  hooks: true
});

Attendee.belongsTo(User,{
  foreignKey:'userId'
});

Event.hasMany(Attendee,{
  foreignKey:'id',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  hooks: true
});

Attendee.belongsTo(Event,{
  foreignKey:'eventId'
});
/*Event.create({
  title:"Magic",
  description:"NA",
  date:"25 Nov 2020",
  location:"Mumbai",
  allowed_attendees:100,
  startTime:"08:25:00",
  endTime:"10:00:00"
}).then((res)=>{
  console.log(res);
}).catch((error)=>{
  console.error(error);
}).finally(()=>{
  console.log("Success");
});*/



module.exports = {
  Event,
  User,
  Waitlist,
  Image,
  Attendee
};

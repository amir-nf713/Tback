const mongoose = require('mongoose');

const mongoURL = {
  host: '127.0.0.1',
  port: '27017',
  dbName: 'tadrisyar',
  user: 'admin',
  pass: 'asaz1323asaz1323',
  get url() {
    return `mongodb://${this.user}:${this.pass}@${this.host}:${this.port}/${this.dbName}?authSource=admin`;
  }
};


function connectToMongo() {
  mongoose.connect(mongoURL.url)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch(err => {
      console.error('❌ Could not connect to MongoDB:', err.message);
    });
}

module.exports = connectToMongo;

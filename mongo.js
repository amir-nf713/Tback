const mongoose = require('mongoose');

const mongoURL = {
  host: '127.0.0.1',  // یا آی‌پی خارجی سرور شما
  port: '27017',
  dbName: 'tadrisyar',
  get url() {
    return `mongodb://${this.host}:${this.port}/${this.dbName}`;
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

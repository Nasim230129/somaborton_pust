require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function runSeed() {
  const fallbackPath = path.join(__dirname, 'data/db_store.json');
  if (fs.existsSync(fallbackPath)) {
    fs.unlinkSync(fallbackPath);
  }
  await db.connectDB();
  if (db.isMongo()) {
    const { models } = db;
    await Promise.all([
      models.User.deleteMany({}),
      models.Department.deleteMany({}),
      models.Event.deleteMany({}),
      models.Job.deleteMany({}),
      models.Story.deleteMany({}),
      models.Notification.deleteMany({}),
      models.Message.deleteMany({}),
      models.GalleryItem.deleteMany({}),
      models.Verification.deleteMany({}),
      models.CommunityPost.deleteMany({}),
      models.Donation.deleteMany({}),
      models.MentorshipRequest.deleteMany({}),
      models.ContactMessage.deleteMany({}),
    ]);
    await db.connectDB();
  }
  console.log('Database seeded successfully with PUST Alumni Network data!');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

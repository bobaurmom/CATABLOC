//# DB connection setup - Now delegated to Sequelize
// This file is deprecated. Sequelize in config/sequelize.ts now manages schema sync.
// Keeping minimal exports for backward compatibility if needed.

export const connectDB = async (): Promise<void> => {
  // Use sequelize.connectDB() from config/sequelize.ts instead
  console.warn('database.ts connectDB is deprecated. Use sequelize.connectDB() from config/sequelize.ts');
};

export const closeDB = async (): Promise<void> => {
  // Use sequelize.closeDB() from config/sequelize.ts instead
  console.warn('database.ts closeDB is deprecated. Use sequelize.closeDB() from config/sequelize.ts');
};

export default {};
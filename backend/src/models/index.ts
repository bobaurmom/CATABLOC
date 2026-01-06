import User from './userModel';
import Level, { LevelProgress } from './Level'; 
import Session from './session';
import Action from './action';
import Codeblock from './codeBlock';

// ============================================
// USER RELATIONSHIPS
// ============================================
// A User can have many Sessions
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// A User can have many LevelProgress records
User.hasMany(LevelProgress, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// ============================================
// LEVEL RELATIONSHIPS
// ============================================
// A Level can have many Sessions
Level.hasMany(Session, { foreignKey: 'level_id', onDelete: 'CASCADE' });

// A Level can have many LevelProgress records
Level.hasMany(LevelProgress, { foreignKey: 'level_id', onDelete: 'CASCADE' });

// ============================================
// SESSION RELATIONSHIPS
// ============================================
// A Session belongs to one User
Session.belongsTo(User, { foreignKey: 'user_id' });

// A Session belongs to one Level
Session.belongsTo(Level, { foreignKey: 'level_id' , targetKey: 'level_id'});

// A Session can have many Actions
Session.hasMany(Action, { foreignKey: 'session_id', onDelete: 'CASCADE' });

// ============================================
// LEVEL PROGRESS RELATIONSHIPS
// ============================================
// LevelProgress belongs to one User
LevelProgress.belongsTo(User, { foreignKey: 'user_id' });

// LevelProgress belongs to one Level
LevelProgress.belongsTo(Level, { foreignKey: 'level_id' , targetKey: 'level_id'});

// ============================================
// ACTION RELATIONSHIPS
// ============================================
// An Action belongs to one Session
Action.belongsTo(Session, { foreignKey: 'session_id' });

// An Action belongs to one Codeblock
Action.belongsTo(Codeblock, { foreignKey: 'codeblock_id' });

// ============================================
// CODEBLOCK RELATIONSHIPS
// ============================================
// A Codeblock can be used in many Actions
Codeblock.hasMany(Action, { foreignKey: 'codeblock_id' });

// ============================================
// MANY-TO-MANY RELATIONSHIPS
// ============================================
// User <-> Level (through LevelProgress)
// Allows: user.getCompletedLevels() and level.getUsers()
User.belongsToMany(Level, { 
  through: LevelProgress, 
  foreignKey: 'user_id',
  otherKey: 'level_id'
});

Level.belongsToMany(User, { 
  through: LevelProgress, 
  foreignKey: 'level_id',
  otherKey: 'user_id'
});

// Session <-> Codeblock (through Action)
// Allows: session.getCodeblocks() and codeblock.getSessions()
Session.belongsToMany(Codeblock, { 
  through: Action, 
  foreignKey: 'session_id', 
  otherKey: 'codeblock_id' 
});

Codeblock.belongsToMany(Session, { 
  through: Action, 
  foreignKey: 'codeblock_id', 
  otherKey: 'session_id' 
});

// ============================================
// EXPORTS
// ============================================
export { User, Level, LevelProgress, Session, Action, Codeblock };

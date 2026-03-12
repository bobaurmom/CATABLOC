import User from './userModel';
import { Game } from './game';
import Level, { LevelProgress } from './Level'; 
import Session from './session';
import Action from './action';
import Codeblock from './codeBlock';
import { BoardData } from './boardData';
import { score } from './score';

// ============================================
// GAME RELATIONSHIPS
// ============================================
// A Game can have many Levels
Game.hasMany(Level, { foreignKey: 'game_id', onDelete: 'CASCADE' });

// A Game can have many Sessions
Game.hasMany(Session, { foreignKey: 'game_id', onDelete: 'CASCADE' });

// A Game can have many Scores
Game.hasMany(score, { foreignKey: 'game_id', onDelete: 'CASCADE' });

// A Game can have many BoardData records
Game.hasMany(BoardData, { foreignKey: 'game_id', onDelete: 'CASCADE' });

// A Game can have many Codeblocks
Game.hasMany(Codeblock, { foreignKey: 'game_id' });

// ============================================
// USER RELATIONSHIPS
// ============================================
// A User can have many Sessions
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// A User can have many LevelProgress records
User.hasMany(LevelProgress, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// A User can have many Scores
User.hasMany(score, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// ============================================
// LEVEL RELATIONSHIPS
// ============================================
// A Level belongs to one Game
Level.belongsTo(Game, { foreignKey: 'game_id' });

// A Level can have many Sessions
Level.hasMany(Session, { foreignKey: 'level_id', onDelete: 'CASCADE' });

// A Level can have many LevelProgress records
Level.hasMany(LevelProgress, { foreignKey: 'level_id', onDelete: 'CASCADE' });

// A Level has one BoardData
Level.hasOne(BoardData, { foreignKey: 'level_id', onDelete: 'CASCADE' });

// A Level can have many Codeblocks (palette/definitions)
Level.hasMany(Codeblock, { foreignKey: 'level_id', onDelete: 'CASCADE' });

// ============================================
// SESSION RELATIONSHIPS
// ============================================
// A Session belongs to one User
Session.belongsTo(User, { foreignKey: 'user_id' });

// A Session belongs to one Level
Session.belongsTo(Level, { foreignKey: 'level_id' , targetKey: 'level_id'});

// A Session belongs to one Game
Session.belongsTo(Game, { foreignKey: 'game_id' });

// A Session can have many Actions
Session.hasMany(Action, { foreignKey: 'session_id', onDelete: 'CASCADE' });

// A Session can have many Codeblocks
Session.hasMany(Codeblock, { foreignKey: 'session_id', onDelete: 'CASCADE' });

// ============================================
// LEVEL PROGRESS RELATIONSHIPS
// ============================================
// LevelProgress belongs to one User
LevelProgress.belongsTo(User, { foreignKey: 'user_id' });

// LevelProgress belongs to one Level
LevelProgress.belongsTo(Level, { foreignKey: 'level_id' , targetKey: 'level_id'});

// ============================================
// BOARD DATA RELATIONSHIPS
// ============================================
// BoardData belongs to one Level
BoardData.belongsTo(Level, { foreignKey: 'level_id' });

// BoardData belongs to one Game
BoardData.belongsTo(Game, { foreignKey: 'game_id' });

// ============================================
// SCORE RELATIONSHIPS
// ============================================
// Score belongs to one User
score.belongsTo(User, { foreignKey: 'user_id' });

// Score belongs to one Level
score.belongsTo(Level, { foreignKey: 'level_id' });

// Score belongs to one Game
score.belongsTo(Game, { foreignKey: 'game_id' });

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
// A Codeblock belongs to one Level (palette definition)
Codeblock.belongsTo(Level, { foreignKey: 'level_id' });

// A Codeblock belongs to one Game
Codeblock.belongsTo(Game, { foreignKey: 'game_id' });

// A Codeblock can be used in many Actions (instances in sessions)
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
export { User, Game, Level, LevelProgress, Session, Action, Codeblock, BoardData, score };

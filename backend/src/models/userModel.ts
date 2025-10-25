import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize';
import { tr } from 'zod/locales';

interface UserAttributes {
  user_id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public email!: string;
  public username!: string;
  public password_hash!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['username'],
      },
    ],
  }
);

export default User;

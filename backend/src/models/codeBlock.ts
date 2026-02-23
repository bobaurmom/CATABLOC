import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

export type CodeblockType =
  | "movement"
  | "loop"
  | "condition"
  | "procedure"
  | "control";

export type CodeblockCommand =
  | "move_forward"
  | "move_backward"
  | "turn_left"
  | "turn_right";

interface CodeblockAttributes {
  codeblock_id: number;
  game_id: number | null;
  level_id: number | null;
  name: string;
  description?: string | null;
  type: CodeblockType;
  block_command: CodeblockCommand;
  block_type: "movement" | "repeat" | "while" | "condition" | "procedure";
  sequence_order?: number | null;
  parent_block_id?: number | null;
  loop_count?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

type CodeblockCreationAttributes = Optional<
  CodeblockAttributes,
  | "codeblock_id"
  | "game_id"
  | "level_id"
  | "description"
  | "sequence_order"
  | "parent_block_id"
  | "loop_count"
  | "created_at"
  | "updated_at"
>;

export class Codeblock
  extends Model<CodeblockAttributes, CodeblockCreationAttributes>
  implements CodeblockAttributes
{
  public codeblock_id!: number;
  public game_id!: number | null;
  public level_id!: number | null;
  public name!: string;
  public description?: string | null;
  public type!: CodeblockType;
  public block_command!: CodeblockCommand;
  public block_type!: "movement" | "repeat" | "while" | "condition" | "procedure";
  public sequence_order?: number | null;
  public parent_block_id?: number | null;
  public loop_count?: number | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Codeblock.init(
  {
    codeblock_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "games",
        key: "game_id",
      },
      onDelete: "SET NULL",
    },
    level_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "levels",
        key: "level_id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("movement", "loop", "condition", "procedure", "control"),
      allowNull: false,
      defaultValue: "movement",
    },
    block_command: {
      type: DataTypes.ENUM("move_forward", "move_backward", "turn_left", "turn_right"),
      allowNull: false,
    },
    block_type: {
      type: DataTypes.ENUM("movement", "repeat", "while", "condition", "procedure"),
      allowNull: false,
    },
    sequence_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parent_block_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    loop_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "codeblocks",
    underscored: true,
    timestamps: true,
  }
);

export default Codeblock;
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

export class Codeblock extends Model {
    public codeblock_id!: number;
    public block_command!: 'move_forward' | 'move_backward' | 'turn_left' | 'turn_right' ;
    public block_type!: 'movement' | 'repeat' | 'while' | 'condition' | 'procedure';
}

Codeblock.init({
    codeblock_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    block_command: {
        type: DataTypes.ENUM('move_forward', 'move_backward', 'turn_left', 'turn_right'),
        allowNull: false,
    },
    block_type: {
        type: DataTypes.ENUM('movement', 'repeat', 'while', 'condition', 'procedure'),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'codeblocks',
    underscored: true,
    timestamps: false,
});

export default Codeblock;
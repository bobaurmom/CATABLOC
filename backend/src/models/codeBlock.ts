import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

export class Codeblock extends Model {
    public codeblock_id!: number;
    public block_command!: 'forward' | 'backward' | 'turn_left' | 'turn_right' | 'light';
    public block_type!: 'movement' | 'loop' | 'while' | 'condition' | 'procedure';
}

Codeblock.init({
    codeblock_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    block_command: {
        type: DataTypes.ENUM('forward', 'backward', 'turn_left', 'turn_right', 'light'),
        allowNull: false,
    },
    block_type: {
        type: DataTypes.ENUM('movement', 'loop', 'while', 'condition', 'procedure'),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'codeblocks',
    underscored: true,
    timestamps: false,
});

export default Codeblock;
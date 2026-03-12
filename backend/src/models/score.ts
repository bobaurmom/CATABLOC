import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

interface scoreAttributes {
    score_id: number;
    user_id: number;
    game_id: number;
    level_id: number;
    exp_gained: number;
    blocks_used: number;
    time_spent: number; // in seconds
    created_at?: Date;
    updated_at?: Date;
}

interface scoreCreationAttributes extends Optional<scoreAttributes, 'score_id' | 'created_at' | 'updated_at'> {}
export class score extends Model<scoreAttributes, scoreCreationAttributes> implements scoreAttributes {
    public score_id!: number;
    public user_id!: number;
    public game_id!: number;
    public level_id!: number;
    public exp_gained!: number;
    public blocks_used!: number;
    public time_spent!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}
score.init({
    score_id: {
        type: DataTypes.INTEGER,    
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    level_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    exp_gained: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    blocks_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time_spent: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'scores',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


export default score;
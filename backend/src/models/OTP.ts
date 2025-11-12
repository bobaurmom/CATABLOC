import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface OTPAttributes{
    otp_id: number;
    user_id?: number;
    email: string;
    code: string;
    expired_at: Date;
    attempts: number;
    otp_type: 'email_verification' | 'password_reset';
    expired: boolean;
    attemptLimit: number;
    created_at?: Date;
    updated_at?: Date;
}
interface OTPCreationAttributes extends Optional<OTPAttributes, 'otp_id' | 'user_id' | 'attempts' | 'expired' | 'created_at' | 'updated_at'> {}

class OTP extends Model<OTPAttributes, OTPCreationAttributes> implements OTPAttributes{
    public otp_id!: number;
    public user_id?: number;
    public email!: string;
    public code!: string;
    public expired_at!: Date;
    public attempts!: number;
    public otp_type!: 'email_verification' | 'password_reset';
    public expired!: boolean;
    public attemptLimit!: number;
    public readonly created_at?: Date;
    public readonly updated_at?: Date;

    public incrementAttempts!: () => Promise<void>;
    public isExpired(): boolean {
        return this.expired_at !== undefined && new Date() > this.expired_at;
    }

    public isValid(): boolean {
        return !this.expired && !this.isExpired() && this.attempts < this.attemptLimit;
    }
    public markAsExpired(): void {
        this.expired = true;
    }
}
OTP.init(
    {
        otp_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isEmail: true },
        },
        code: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate:
            {
                notEmpty: true,
            },
        },
        otp_type: {
            type: DataTypes.ENUM('email_verification', 'password_reset'),
            allowNull: false,
        },
        expired_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        expired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        attempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        attemptLimit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },

    },
    {
        sequelize,
        tableName: "otp",
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['email', 'otp_type'],
            },
            {
                fields: ['expired_at'],
            },
        ],
    }
);

export default OTP; 

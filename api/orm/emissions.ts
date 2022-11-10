import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, INTEGER} from 'sequelize';
import { Country } from './countries';
import { DataProvider } from './dataProviders';

const init = require('./init.ts');
const sequelize = init.connect();

export class Emissions extends Model <InferAttributes<Emissions>, InferCreationAttributes<Emissions>> {
    declare emissions_id: CreationOptional<number>;
    declare actor_type: number;
    declare total_ghg_co2e: number;
    declare year: number;
    declare land_sinks: number;
    declare other_gases: number;
    declare dataset_did: number;
    declare data_provider_id: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Emissions.init({
    emissions_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    actor_type: {
        type: DataTypes.STRING
    },
    total_ghg_co2e: {
        type: DataTypes.INTEGER,
    },
    year: {
        type: DataTypes.INTEGER,
    },
    land_sinks: {
        type: DataTypes.INTEGER,
    },
    other_gases: {
        type: DataTypes.INTEGER,
    },
    dataset_did: {
        type: DataTypes.STRING,
    },
    data_provider_id: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    }
},{
    sequelize,
    modelName: 'Emissions',
    tableName: 'emissions',
    timestamps: false
})

// Actor Associations

Emissions.belongsTo(DataProvider, {
    foreignKey: {
        name: "data_provider_id"
    }
})





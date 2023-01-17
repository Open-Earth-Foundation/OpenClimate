import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { Emissions } from "./emissions";
import { Methodology } from "./methodologies";

const init = require('./init.ts');
const sequelize = init.connect();
const logger = require('../logger').child({module: __filename})

export class DataProvider extends Model <InferAttributes<DataProvider>, InferCreationAttributes<DataProvider>> {
    declare data_provider_id: CreationOptional<number>;
    declare data_provider_name: string;
    declare data_provider_type: string;
    declare verified: boolean;
    declare data_signer: string;
    declare provider_did: string;
    declare file_integration: string;
    declare data_provider_link: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

DataProvider.init({
    data_provider_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    data_provider_name: {
        type: DataTypes.STRING
    },
    data_provider_type: {
        type: DataTypes.STRING
    },
    verified: {
        type: DataTypes.BOOLEAN
    },
    data_signer: {
        type: DataTypes.STRING
    },
    provider_did: {
        type: DataTypes.STRING
    },
    file_integration: {
        type: DataTypes.STRING
    },
    data_provider_link: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    }
},{
    sequelize,
    modelName: 'DataProvider',
    tableName: 'dataproviders',
    timestamps: false
});

// Methodology associations

export const getAllProviders = async () => {
    try{
        const providers = await DataProvider.findAll({
            attributes: ['data_provider_id', 'data_provider_name']
        });
        return providers;
    } catch (error){
        logger.error('Country not found: ', error.message)
    }
}

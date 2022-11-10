import {Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional} from  'sequelize';

const init = require('./init.ts');
const sequelize = init.connect();

export class EmissionPledges extends Model<InferAttributes<EmissionPledges>, InferCreationAttributes<EmissionPledges>> {
    declare pledge_id: CreationOptional<number>;
    declare pledge_type: string;
    declare pledge_target_year: number;
    declare plegde_baseline_year: number;
    declare pledge_base_level: number;
    declare pledge_target: number;
    declare conditionality: number;
    declare region_id: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

EmissionPledges.init({
    pledge_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    pledge_type: {
        type: DataTypes.STRING
    },
    pledge_target_year: {
        type: DataTypes.INTEGER
    },
    plegde_baseline_year: {
        type: DataTypes.INTEGER
    },
    pledge_base_level: {
        type: DataTypes.STRING
    },
    pledge_target: {
        type: DataTypes.INTEGER
    },
    conditionality: {
        type: DataTypes.STRING
    },
    region_id: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.STRING
    },
    updated_at: {
        type: DataTypes.STRING
    },
}, {
    sequelize,
    modelName: 'EmissionPledges',
    tableName: 'emissions_pledges'
})
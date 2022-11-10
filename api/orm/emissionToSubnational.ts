import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';

const init = require('./init.ts')
let sequelize = init.connect()

class EmissionToSubnational  extends Model <InferAttributes<EmissionToSubnational>, InferCreationAttributes<EmissionToSubnational>> {
    declare subnational_id: number;
    declare emission_id: number;
}

EmissionToSubnational.init({
    subnational_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Subnational',
            key: 'subnational_id'
        }
    },
    emission_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Emission',
            key: 'emission_id'
        }
    },
    
}, {
    sequelize,
    modelName: 'EmissionToSubnational',
    tableName: 'emissions_to_subnationals'
})


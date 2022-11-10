import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';
import { DataProvider } from './dataProviders';
import { Emissions } from './emissions';
import { Methodology } from './methodologies';
import { Subnational } from './subnationals';
import { Tag } from './tags';

const init = require('./init.ts');
const sequelize = init.connect();

export class City extends Model <InferAttributes<City>, InferCreationAttributes<City>> {
    declare city_id: CreationOptional<number>;
    declare city_name: string;
    declare country_iso: string;
    declare spacial_polygon: string;
    declare flag_icon: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

City.init({
    city_id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        unique: true
    },
    city_name: {
        type: DataTypes.STRING,
    },
    country_iso: {
        type: DataTypes.STRING,
    },
    spacial_polygon: {
        type: DataTypes.STRING,
    },
    flag_icon: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.STRING,
    },
    updated_at: {
        type: DataTypes.STRING,
    },
},{
    sequelize,
    modelName: 'City',
    tableName: 'cities',
    timestamps: false
})


const Emission_to_City = sequelize.define(
    'emissions_to_cities',
    {
        city_id: DataTypes.INTEGER,
        emission_id: DataTypes.INTEGER
    },
    {
        timestamps: false
    }
)

City.belongsToMany(Emissions, {
    through: Emission_to_City,
    foreignKey: 'city_id',
    otherKey: 'emission_id'
});

Emissions.belongsToMany(City, {
    through: Emission_to_City,
    foreignKey: 'emission_id',
    otherKey: 'city_id'
});

// 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
// Get all city Data
export const getAllCities = async () => {
    try {
        const cities = await City.findAll();
        return cities;
    }
    catch (error) {
        console.error('Country not found: ', error.message)
    }
}

export const getCityDataById = async (city_id, year) => {
    console.log(city_id)
    try {
        const city = await City.findAll({
            where: {
                city_id
            },
            include: [
                {
                    model: Emissions,
                    where: {
                        year
                    },
                    include: [
                        {
                            model: DataProvider,
                            include: [
                                {
                                    model: Methodology,
                                    include: [{
                                        model: Tag
                                    }]
                                    
                                }
                                
                            ]  
                        }
                    ]
                },             
            ]
        })
        console.log("data: ",city);
        return city;

    } catch (error) {
        console.error('Country not found: ', error.message)
    }
}
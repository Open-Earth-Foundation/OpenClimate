import { raw } from 'body-parser';
import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op, Sequelize} from 'sequelize';
import { City } from './cities';
import { DataProvider } from './dataProviders';
import { Emissions } from './emissions';
import { Methodology } from './methodologies';
import {Subnational} from './subnationals';
import { Tag } from './tags';

const init = require('./init.ts');
export const sequelize = init.connect();
const logger = require('../logger').child({module: __filename})

export class Country extends Model <InferAttributes<Country>, InferCreationAttributes<Country>> {
    declare country_id: CreationOptional<number>;
    declare country_name: string;
    declare iso: string;
    declare party_to_pa: string;
    declare flag_icon: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Country.init({
    country_id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
    },
    country_name: {
        type: DataTypes.STRING,
    },
    iso: {
        type: DataTypes.STRING,
        unique: true
    },
    party_to_pa: {
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
    modelName: 'Country',
    tableName: 'countries',
    timestamps: false
})


// Country associations
const Country_to_Subnational = sequelize.define(
    'countries_to_subnationals',
    {
        country_id: DataTypes.INTEGER,
        subnational_id: DataTypes.INTEGER
    },
    {
        timestamps: false
    }
)

Country.belongsToMany(Subnational, {
    through: Country_to_Subnational,
    foreignKey: 'country_id',
    otherKey: 'subnational_id'
})

Subnational.belongsToMany(Country, {
    through: Country_to_Subnational,
    foreignKey: 'subnational_id',
    otherKey: 'country_id'
})

const Emission_to_Country = sequelize.define(
    'emissions_to_countries',
    {
        country_id: DataTypes.INTEGER,
        emissions_id: DataTypes.INTEGER
    },
    {
        timestamps: false
    }
)

Country.belongsToMany(Emissions, {
    through: Emission_to_Country,
    foreignKey: 'country_id',
    otherKey: 'emissions_id'
});

Emissions.belongsToMany(Country, {
    through: Emission_to_Country,
    foreignKey: 'emissions_id',
    otherKey: 'country_id'
});

export const getAllCountries = async () => {
    try {
        const countries = await Country.findAll();
        return countries;
    }
    catch (error) {
        logger.error('Country not found: ', error.message)
    }
}

export const getAllCountriesEmissions = async (year) => {
    try {
        const countries = await Country.findAll({
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
                                    model: Methodology
                                }
                            ]
                        }

                    ]
                },
                {
                    model: Subnational,
                    include: [
                        {
                            model: Emissions,
                            include: [
                                {
                                    model: DataProvider,

                                    include: [
                                        {
                                            model: Methodology,
                                            include: [
                                                {
                                                    model: Tag
                                                }
                                            ]
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            model: City,
                            include: [
                                {
                                    model: Emissions,
                                    include: [
                                        {
                                            model: DataProvider,

                                            include: [
                                                {
                                                    model: Methodology
                                                }
                                            ]
                                        }

                                    ]
                                },
                            ]

                        }
                    ]


                },
            ]
        });
        return countries;
    }
    catch (error) {
        logger.error('Country not found: ', error.message)
    }
}

export const getCountryDataById = async (country_id, year) => {
    logger.debug(country_id)
    try {
        const country = await Country.findAll({
            where: {
                country_id
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
                                    include: [
                                        {
                                            model: Tag
                                        }
                                    ]
                                }
                            ]
                        }

                    ]
                },
                {
                    model: Subnational,
                    include:   [
                        {
                            model: Emissions,
                            include: [
                                {
                                    model: DataProvider,
                                    include: [
                                        {
                                            model: Methodology,
                                            include: [
                                                {
                                                    model: Tag
                                                }
                                            ]
                                        }
                                    ]
                                }

                            ]
                        }
                    ]

                },
            ]
        })
        logger.debug("data: ",country);
        return country;

    } catch (error) {
        logger.error('Country not found: ', error.message)
        return null;
    }
}

// Get data providers

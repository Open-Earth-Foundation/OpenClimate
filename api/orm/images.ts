const { DataTypes, Model } = require('sequelize')

const Util = require('../util')

const init = require('./init.ts')
let sequelize = init.connect()

class Image extends Model {}

Image.init(
  {
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.BLOB,
    },
  },
  {
    sequelize, // Pass the connection instance
    modelName: 'Image',
    tableName: 'images', // Our table names don't follow the sequelize convention and thus must be explicitly declared
    timestamps: false,
  },
)

const readImagesByType = async function (type) {
  try {
    const image = await Image.findAll({
      where: {
        type,
      },
    })
    return image
  } catch (error) {
    console.error('Could not find image in the database: ', error)
  }
}

const readImages = async function () {
  try {
    const images = await Image.findAll()

    return images
  } catch (error) {
    console.error('Could not find images in the database: ', error)
  }
}

const updateImage = async function (name, type, image) {
  try {
    const updatedImage = await Image.update(
      {
        name,
        type,
        image,
      },
      {
        where: {
          type: 'logo',
        },
      },
    )
    console.log('Image updated successfully.')
    return updatedImage
  } catch (error) {
    console.error('Error updating the image: ', error)
  }
}

const deleteImage = async function (image_id) {
  try {
    await Image.destroy({
      where: {
        image_id,
      },
    })

    console.log('Successfully deleted image')
  } catch (error) {
    console.error('Error while deleting image: ', error)
  }
}

export = {
  Image,
  readImagesByType,
  readImages,
  updateImage,
  deleteImage,
}

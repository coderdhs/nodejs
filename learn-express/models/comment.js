module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comment', {
        comment:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        created_at:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()')
        }
    },
        {
            timestamps:false,
            underscored:true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
    })
}
const { Redis, getAsync, getKeyAsync } = require('../Redis')

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false
        },
        fname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        language_code: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'users',
        freezeTableName: true,
        paranoid: true
    })
    
/******* REDIS CACHE ****************************************************************************************/
    User.CACHE_KEY = `${User.tableName}`

    // params: key, value
    // returns: {...}
    async function setCache(key, value){
        try{
            Redis.set(key, JSON.stringify(value))
            return value
        } catch(err) {
            console.log(err)
            return false
        }
    }

    // param: key
    // returns: {...}
    async function getCache(key){
        try {
            const value = await getAsync(key)
            return JSON.parse(value)
        } catch (err) {
            console.log(err)
            return false
        }
    }

    // param: key
    // returns: [{...}, {...}, {...}, ...]
    // desc: It returns all keys which begins with `key*`
    async function getAllLikeCache(key){
        let data = []
        const customKey = `${key}*`

        const keys = await getKeyAsync(customKey)

        for(let i=0; i < keys.length; i++){
            const value = await getAsync(keys[i])
            data.push(JSON.parse(value))
        }
        
        return data
    }

    // param: key
    // returns: true | false
    async function delCache(key){
        Redis.del(key)
    }

/************************************************************************************************************/
/******* C R U D ********************************************************************************************/

    /**
     * JSON formatda User object beriladi.
     * --> { id, fname, username!, phone, language_code }
     */
    User.add = async (user) => {
        try{
            const data = (await User.create(user)).dataValues
            const cache_key = `${User.CACHE_KEY}--${data.id}`
            setCache(cache_key, data)
            return data
        } catch(err){
            console.log(err)
            return false
        }
    }

    /**
     * Barchasini JSON massivda qaytaradi. 
     */
    User.getAll = async () => {
        let users = await getAllLikeCache(User.CACHE_KEY)
        
        if( !(users.length > 0) ){
            const users = await User.findAll()
            for(let i=0; i < users.length; i++){
                if(users[i]){
                    users.push( users[i].dataValues )
                }
            }
        }

        if(users.length == 0){ return null }

        return users.length == 1 ? users[0] : users
    }

    /**
     * Bir yoki bir nechta id'larni parametrga beriladi.
     * Natija bitta JSON yoki massiv JSON'da qaytadi. 
     */
    User.getById = async (...ids) => {
        let res = []
        for(let i=0; i < ids.length; i++){

            // First search from Cache!
            const cache_key = `${User.CACHE_KEY}--${ids[i]}`
            const cachedUser = await getCache(cache_key)
            
            if(cachedUser){
                res.push(cachedUser)
            } else {
                // Otherwise search from DB
                const user = await User.findOne({ where: { id: ids[i] } })
                if(user){
                    res.push(user.dataValues)
                    // After find him save to cache clearly!
                    Redis.set(cache_key, user.dataValues)
                }
            }
        }

        if(res.length == 0){ return null }

        return res.length == 1 ? res[0] : res
    }

    /**
     * Mavjud ma'lumotni qisman yangilab beradi.
     * Natija bitta JSON'da qaytadi.
     */
    User.rebuild = async (id, props) => {
        try{
            const isUpdated = !!(await User.update(props, { where: { id } }))[0]
            if(isUpdated){
                const savedUser = (await User.findOne({ where: { id } })).dataValues
                const cache_key = `${User.CACHE_KEY}--${savedUser.id}`
                setCache(cache_key, savedUser)
                return savedUser
            }
        }catch(err){
            console.log(err)
            return false
        }
    }

    /**
     * Bir yoki bir nechta id'lar orqali ma'lumotlarni `o'chirish`.
     * Natija Boolean tipda qaytadi.
     */
    User.remove = async (...ids) => {
        try{
            for(let i=0; i < ids.length; i++){
                const cache_key = `${User.CACHE_KEY}--${ids[i]}`
                await User.destroy({ where: { id: ids[i] } })
                delCache(cache_key)
            }
            return true
        } catch(err){
            console.log(err)
            return false
        }
    }

    /**
     * Bir yoki bir nechta id'lar orqali ma'lumotlarni `qayta tiklash`.
     * Natija bitta JSON yoki massiv JSON'da qaytadi.
     */
    User.repair = async (...ids) => {
        try{
            for(let i=0; i < ids.length; i++){
                await User.restore({ where: { id: ids[i] } })
                await User.getById(ids[i])
            }
            return true
        } catch(err) {
            console.log(err)
            return false
        }
    }

/************************************************************************************************************/

    return User
}
const {UserInfo} = require('../models/models')
const ApiError = require('../error/ApiError');

class UserInfoController {
    async create(req, res, next) {
        try {
            let {firstName,lastname,middleName,birthday,gender,address, age} = req.body
            const userinfo = await UserInfo.create({firstName,lastname,middleName,birthday,gender,address,age});
            return res.json(userinfo)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async updateOne(req, res) {
        const {id} = req.params;
        const {
            firstName,lastname,middleName,birthday,gender,address,phone
        } = req.body;


        try {
            const userinfo = await UserInfo.findOne({where: {id}});

            if (!userinfo) {
                return res.status(404).json({error: 'User was not found'});
            }

            userinfo.firstName = firstName;
            userinfo.lastname = lastname;
            userinfo.middleName = middleName;
            userinfo.birthday = birthday;
            userinfo.gender = gender;
            userinfo.address = address;
            userinfo.phone = phone;


            await userinfo.save();

            return res.json(userinfo);
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: 'Internal server error'});
        }
    }

    async getOneUserInfo(req, res){
        const id = req.params.id
        const OneUserInfo = await UserInfo.findByPk(id)
        return res.json(OneUserInfo)
    }
}

module.exports = new UserInfoController

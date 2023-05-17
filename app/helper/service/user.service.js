import { detect } from "detect-browser"
import autoBind from "auto-bind";
import address from 'address';
import LoginLog from '../../models/loginLog.model.js'
import systemInfo from "systeminformation";
import User from "../../models/user.model.js";
import ServiceBase from "./base.service.js";
import FCMToken from "./fcmtoken.service.js";
import user from "../../db/user.js";
import bcrypt from 'bcrypt'
const browser = detect();


class UserService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async addRole(user, role) {
        return this.model.updateOne({ _id: user._id }, { $addToSet: { role } })
    }

    async removeRole(userId, roleId) {
        return this.model.updateOne({ _id: userId }, { $pull: { role: roleId } })
    }

    async setLogForLogin(user, access_token, refresh_token, type = 'login') {

        let os;
        let cpu;
        let mem;

        await systemInfo.osInfo()
            .then(data => {
                os = data.platform + ' / ' + data.distro + ' / ' + data.release
            })
            .catch(error => console.error(error));

        await systemInfo.cpu()
            .then(data => {
                cpu = data.brand + ' / ' + data.manufacturer + ' / core:' + data.cores
            })
            .catch(error => console.error(error));

        await systemInfo.mem()
            .then(data => {
                mem = 'total:' + data.total + ' / free:' + data.free
            })
            .catch(error => console.error(error));

        await LoginLog.create({
            user_id: user._id,
            access_token: access_token,
            refresh_token: refresh_token,
            os: os,
            cpu: cpu,
            browser: browser.name + ' / version:' + browser.version + ' / type' + browser.type,
            memory: mem,
            ip4: address.ip(),
            ip6: address.ipv6(),
            type: type
        });
    }

    async setLogForLogout(access_token) {
        let loginLog = await LoginLog.findOne({ 'access_token': access_token });
        if (loginLog) {
            loginLog.logout_at = new Date();
            await loginLog.save();
        }
    }

    async fillUsers() {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash("some-pass", salt);
        return super.createMany(user)
    }

    async getFCMTokensOfUser(userId) {
        let fcmTokens = await FCMToken.getAll({ "created_by": userId });
        return fcmTokens.map(fcmToken => fcmToken.token)
    }
}

export default new UserService(User);
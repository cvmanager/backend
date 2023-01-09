import address from 'address';
import LoginLog from '../../models/loginLog.model.js'
import systemInfo from "systeminformation";
import { detect } from "detect-browser"
const browser = detect();

const setLogForLogin = async (user, access_token, refresh_token) => {

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
        ip6: address.ipv6()
    });
}
export { setLogForLogin }
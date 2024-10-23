const os = require('os');

export class NetworkUtil {
    public static getLocalIPv4(): string | undefined {
        // get information of all network interfaces
        // 获取所有网络接口信息
        const networkInterfaces = os.networkInterfaces();
        let ipAddress;

        Object.keys(networkInterfaces).forEach((interfaceName) => {
            const interfaces = networkInterfaces[interfaceName];
            // traverse IPv4 address for each network interface
            // 遍历每个网络接口下的IPv4地址
            for (let i = 0; i < interfaces.length; i++) {
                const addressInfo = interfaces[i];

                if (!addressInfo.internal && addressInfo.family === 'IPv4') {
                    ipAddress = addressInfo.address;
                    break;
                }
            }
        });

        return ipAddress;
    }
}
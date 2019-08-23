import axios from 'axios';

export class DisplayAPI {
    public static set(colors): Promise<any> {
        const sendData = { colors };

        const options = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        return axios.post('http://151.217.18.204:13334', sendData, options);
    }
}

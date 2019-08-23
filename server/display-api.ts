import axios from 'axios';

export class DisplayAPI {
    private static lastFrameRendered: boolean = true;

    public static set(colors): void {
        if (this.lastFrameRendered) {
            this.lastFrameRendered = false;

            this.sendColors(colors)
            .then(response => {
                this.lastFrameRendered = true;
            })
            .catch(error => {
                console.error(error);
            });
        } else {
            console.warn('Frame dopped! Bad connection.');
        }
    }

    public static sendColors(colors): Promise<any> {
        const sendData = { colors };

        const options = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        return axios.post('http://151.217.18.204:13334', sendData, options);
    }
}

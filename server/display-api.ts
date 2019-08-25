import axios from 'axios';

export class DisplayAPI {
    constructor(public rootEndpoint: string) {}

    private lastFrameRendered: boolean = true;

    public set(colors): void {
        if (this.lastFrameRendered) {
            this.lastFrameRendered = false;

            this.sendColors(colors)
            .then(response => {
                this.lastFrameRendered = true;
            })
            .catch(error => {
                console.error(error);
            });
        }
    }

    public sendColors(colors): Promise<any> {
        const sendData = { colors };

        const options = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        return axios.post(this.rootEndpoint, sendData, options);
    }
}

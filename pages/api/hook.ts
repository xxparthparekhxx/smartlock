import { SmartApp, WebHookResponse } from '@smartthings/smartapp';
import { NextApiRequest, NextApiResponse } from 'next';

const smartapp = new SmartApp()
    .enableEventLogging(2) // logs all lifecycle event requests and responses as pretty-printed JSON. Omit in production
    .page('mainPage', (context, page, configData) => {
        page.section('sensors', section => {
            section
                .deviceSetting('contactSensor')
                .capabilities(['contactSensor'])
        });
        page.section('lights', section => {
            section
                .deviceSetting('lights')
                .capabilities(['switch'])
                .permissions('rx')
                .multiple(true);
        });
    })
    // Called for both INSTALLED and UPDATED lifecycle events if there is no separate installed() handler
    .updated(async (context, updateData) => {
        await context.api.subscriptions.delete() // clear any existing configuration
        await context.api.subscriptions.subscribeToDevices(context.config.contactSensor, 'contactSensor', 'contact', 'myDeviceEventHandler');
    })
    .subscribedEventHandler('myDeviceEventHandler', async (context, event) => {
        const value = event.value === 'open' ? 'on' : 'off';
        await context.api.devices.sendCommands(context.config.lights, 'switch', value);
    });

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle different HTTP methods
    console.log(req.body);
    smartapp.handleHttpCallback(req, (res as unknown) as WebHookResponse );
}
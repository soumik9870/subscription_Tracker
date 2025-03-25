import { createRequire } from 'module';
import dayjs from 'dayjs';
import Subscription from '../models/subscription.model.js';

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMAINDERS =  [7, 5, 2, 1];

export const sendRemainders =  serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())){
        console.log(`Subscription for ${subscriptionId} has passed. STOPPING REMAINDERS.`);
        return;
    }

    for(const daysBefore of REMAINDERS) {
        const remainderDate = renewalDate.subtract(days);

        if(remainderDate.isAfter(dayjs())){
            await sleepUntilRemainder(context, `Remainder ${daysBefore} days before`, remainderDate);
        }

        await triggerRemainder(context, `Remainder ${daysBefore} days before`);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
};

const sleepUntilRemainder = async (context, label, date) => {
    console.log(`Sleeping until ${label} remainder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const  triggerRemainder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} remainder`);
        // TO DO: implement the logic to send the remainder
    })
}
const { EmailClient, KnownEmailSendStatus } = require('@azure/communication-email');

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const emailClient = new EmailClient(connectionString);

module.exports = () => ({
  sendEmail: async function (recipients, subject, message) {
    const POLLER_WAIT_TIME = 10;
    try {
      const messagePayload = {
        senderAddress: 'DoNotReply@41a492bf-3586-43c0-9c83-4ec57da324d8.azurecomm.net',
        content: {
          subject,
          plainText: message,
        },
        recipients: {
          to: recipients,
        },
        // {
        //   to: [
        //     {
        //       address: '<emailalias@emaildomain.com>',
        //       displayName: 'Customer Name',
        //     },
        //   ],
        // },
      };

      const poller = await emailClient.beginSend(messagePayload);

      if (!poller.getOperationState().isStarted) {
        throw 'Poller was not started.';
      }

      let timeElapsed = 0;
      while (!poller.isDone()) {
        poller.poll();
        console.log('Email send polling in progress');

        await new Promise((resolve) => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
        timeElapsed += 10;

        if (timeElapsed > 18 * POLLER_WAIT_TIME) {
          throw 'Polling timed out.';
        }
      }

      if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
        console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
        return `Successfully sent the email (operation id: ${poller.getResult().id})`;
      } else {
        throw poller.getResult().error;
      }
    } catch (e) {
      console.log(e);
    }
  },
});

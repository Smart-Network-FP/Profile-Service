const { EmailClient, KnownEmailSendStatus } = require('@azure/communication-email');

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const emailClient = new EmailClient(connectionString);
const emailTemplateExpert = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>[Expert] Consultation Confirmation</title>
    <style>
        /* Inline CSS here */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Please find your Consultation details</h1>
        </div>
        <div class="content">
            <p>Dear Habeeb,</p>
            <p>We are pleased to confirm your consultation with our client. Here are the details of your upcoming call:</p>
            <p><strong>Date and Time:</strong> 16 Dec 2023 5 pm PST</p>
            <p>To join the call, please click the link below:</p>
            <a href="https://meet.google.com/szv-pufz-ibt?hs=187&authuser=0&ijlm=1702629302923&adhoc=1" class="button">Join Call</a>
            <p>Alternatively, you can join using the following methods:</p>
            <ul>
                <li>Phone: +1 1800 43002 18883</li>
                <li>Skype: https://call.skype.com/szv-pufz-ibt?hs=187&authuser=0&ijlm=1702629302923&adhoc=1</li>
                <li>Zoom: https://zoom.com/szv-pufz-ibt?hs=187&authuser=0&ijlm=1702629302923&adhoc=1</li>
            </ul>
            <p>We look forward to the call!</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please feel free to reply to this email or contact us at help@abc.com.</p>
            <p>Best regards,</p>
            <p>HM15</p>
        </div>
    </div>
</body>
</html>`;
const emailTemplateUser = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Consultation Confirmation</title>
    <style>
        /* Inline CSS here */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Consultation is Confirmed with our Expert Jackie</h1>
        </div>
        <div class="content">
            <p>Dear Jennifer,</p>
            <p>We are pleased to confirm your consultation request with Jackie. Here are the details of your upcoming call:</p>
            <p><strong>Date and Time:</strong> 16 Dec 2023 5 pm PST</p>
            <p>To join the call, please click the link below:</p>
            <a href="https://meet.google.com/szv-pufz-ibt?hs=187&authuser=0&ijlm=1702629302923&adhoc=1" class="button">Join Call</a>
            <p>Alternatively, you can join using the following methods:</p>
            <ul>
                <li>Phone: +1 1800 43002 18883</li>
                <li>Skype: https://call.skype.com/szv-pufz-ibt?hs=187&authuser=0&ijlm=1702629302923&adhoc=1</li>
                <li>Zoom: https://zoom.com/szv-pufz-ibt?hs=187&authuser=0&ijlm=1702629302923&adhoc=1</li>
            </ul>
            <p>We look forward to speaking with you!</p>
        </div>
        <div class="footer">
            <p>If you have any questions, please feel free to reply to this email or contact us at [Your Contact Information].</p>
            <p>Best regards,</p>
            <p>[Your Name or Company's Name]</p>
        </div>
    </div>
</body>
</html>`;
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
  sendEmailHtml: async function (recipients, subject, htmlContent) {
    console.log('htmlContent', `${htmlContent}`, '\n\n', JSON.stringify(htmlContent));
    const POLLER_WAIT_TIME = 10;
    try {
      const messagePayload = {
        senderAddress: 'DoNotReply@41a492bf-3586-43c0-9c83-4ec57da324d8.azurecomm.net',
        content: {
          subject,
          plainText: '',
          html: emailTemplateExpert,
        },
        recipients: {
          to: [
            {
              address: 'jackie.chan@mailinator.com',
              displayName: 'Jackie Chan',
            },
          ],
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
      const messagePayloadTwo = {
        senderAddress: 'DoNotReply@41a492bf-3586-43c0-9c83-4ec57da324d8.azurecomm.net',
        content: {
          subject,
          plainText: '',
          html: emailTemplateUser,
        },
        recipients: {
          to: [
            {
              address: 'jennifer.laurence@mailinator.com',
              displayName: 'Jennifer Laurence',
            },
          ],
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
      } else {
        throw poller.getResult().error;
      }
      const pollerTwo = await emailClient.beginSend(messagePayloadTwo);

      if (!pollerTwo.getOperationState().isStarted) {
        throw 'PollerTwo was not started.';
      }

      timeElapsed = 0;
      while (!pollerTwo.isDone()) {
        pollerTwo.poll();
        console.log('Email send polling in progress');

        await new Promise((resolve) => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
        timeElapsed += 10;

        if (timeElapsed > 18 * POLLER_WAIT_TIME) {
          throw 'Polling timed out.';
        }
      }

      if (pollerTwo.getResult().status === KnownEmailSendStatus.Succeeded) {
        console.log(`Successfully sent the email (operation id: ${pollerTwo.getResult().id})`);
        return `Successfully sent the email (operation id: ${pollerTwo.getResult().id})`;
      } else {
        throw pollerTwo.getResult().error;
      }
    } catch (e) {
      console.log(e);
    }
  },
});

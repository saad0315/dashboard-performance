// /routes/gmail.js
const { google } = require('googleapis');

const getGmailClient = (tokens) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oauth2Client.setCredentials(tokens);
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

exports.getInbox = async (req, res) => {
  try {
    const tokens = req.user.googleTokens; // From DB
    const gmail = getGmailClient(tokens);

    const { data } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 20,
      labelIds: ['INBOX'],
    });

    const emails = await Promise.all(
      data.messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
        const headers = detail.data.payload.headers;

        const getHeader = (name) => headers.find((h) => h.name === name)?.value;

        return {
          id: msg.id,
          email: getHeader('From'),
          title: getHeader('Subject'),
          description: Buffer.from(detail.data.payload.parts?.[0]?.body?.data || '', 'base64').toString('utf8'),
          date: getHeader('Date'),
          type: 'inbox',
        };
      })
    );

    return res.json({ emails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch inbox' });
  }
};

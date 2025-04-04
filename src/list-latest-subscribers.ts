import axios from 'axios';

const KIT_API_KEY = process.env.KIT_API_KEY;
if (!KIT_API_KEY) {
  throw new Error("Missing KIT_API_KEY in environment variables.");
}

async function listRecentSubscribers() {
  // The endpoint returns subscribers; here we limit the result to 10 and sort by creation date descending.
  const endpoint = 'https://api.kit.com/v4/subscribers?sort=-created_at';
  try {
    const response = await axios.get(endpoint, {
      headers: {
        "Authorization": `Bearer ${KIT_API_KEY}`,
        "X-Kit-Api-Key": KIT_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    console.log('Recent Subscribers:', response.data.subscribers);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent subscribers:', error);
    throw error;
  }
}

listRecentSubscribers()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));

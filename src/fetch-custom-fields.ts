import axios from 'axios';

const KIT_API_KEY = process.env.KIT_API_KEY;
if (!KIT_API_KEY) {
  throw new Error("Missing KIT_API_KEY in environment variables.");
}

async function fetchCustomFields() {
  const endpoint = `https://api.kit.com/v4/custom_fields`;
  try {
    const response = await axios.get(endpoint, {
        headers: {
        'X-Kit-Api-Key': KIT_API_KEY,
        "Authorization": `Bearer ${KIT_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    throw error;
  }
}

// Example usage:
fetchCustomFields()
  .then(customFields => {
    console.log('Custom Fields:', customFields);
  })
  .catch(error => {
    console.error('Fetch failed:', error);
  });

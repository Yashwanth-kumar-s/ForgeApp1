import api, { route } from '@forge/api';

export async function getUsers() {
  const organizationId = 1; // Replace with the correct organization ID if needed
  const url = route`/rest/servicedeskapi/organization/${organizationId}/user`;

  try {
    console.log(`Calling API: ${url}`);

    // Use asUser() for user-level permissions
    const response = await api.asApp().requestJira(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error: ${response.status} - ${response.statusText}`);
      console.error("Error Details:", JSON.stringify(errorData, null, 2));
      return [];
    }

    const data = await response.json();
    console.log("Parsed JSON Data:", JSON.stringify(data, null, 2));

    return data.values || [];
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
}

// Export handler for manifest usage
export const handler = async () => {
  return await getUsers();
};
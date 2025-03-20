import api, { route } from '@forge/api';

export async function getUsers() {
  const projectKey = 'PBEETHOVER'; // Set your Jira project key

  try {
    console.log(`Fetching organization for project: ${projectKey}`);

    // Step 1: Get the Organization ID from the service desk project
    const orgResponse = await api.asApp().requestJira(
      route`/rest/servicedeskapi/servicedesk/${projectKey}/organization`,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!orgResponse.ok) {
      const errorData = await orgResponse.json();
      console.error(`Error: ${orgResponse.status} - ${orgResponse.statusText}`);
      console.error("Error Details:", JSON.stringify(errorData, null, 2));
      return [];
    }

    const orgData = await orgResponse.json();
    if (!orgData.values || orgData.values.length === 0) {
      console.warn("No organizations found for the project.");
      return [];
    }

    const organizationId = orgData.values[0].id; // Take the first org ID
    console.log(`Found Organization ID: ${organizationId}`);

    // Step 2: Fetch Users from the Organization
    const userResponse = await api.asApp().requestJira(
      route`/rest/servicedeskapi/organization/${organizationId}/user`,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error(`Error: ${userResponse.status} - ${userResponse.statusText}`);
      console.error("Error Details:", JSON.stringify(errorData, null, 2));
      return [];
    }

    const userData = await userResponse.json();
    console.log("Fetched Users:", JSON.stringify(userData, null, 2));

    return userData.values || [];
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
}

// Export handler for manifest usage
export const handler = async () => {
  return await getUsers();
};

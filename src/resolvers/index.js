import api, { route } from "@forge/api";

export const getUsers = async (context) => {
  // Log the entire context object for debugging
  console.log("Context:", JSON.stringify(context, null, 2));

  // Extract projectKey directly from the context
  const projectKey = context.context.extension.project.key;

  // Log the extracted projectKey
  console.log(`Extracted Project Key: ${projectKey}`);

  // Fetch organization ID for the project
  console.log(`Fetching organization details for projectKey: ${projectKey}`);
  const orgResponse = await api.asApp().requestJira(
    route`/rest/servicedeskapi/servicedesk/${projectKey}/organization`
  );
  if (!orgResponse.ok) {
    console.error(`Failed to fetch organization details: ${orgResponse.status} ${orgResponse.statusText}`);
    throw new Error("Unable to fetch organization details.");
  }
  const orgData = await orgResponse.json();

  // Log the full organization data for debugging
  console.log(`Organization Data: ${JSON.stringify(orgData, null, 2)}`);

  // Extract organizationId
  const organizationId = orgData.values[0]?.id; // Assuming the first organization is used
  console.log(`Extracted Organization ID: ${organizationId}`);

  if (!organizationId) {
    console.error("No organization ID found for the project.");
    throw new Error("No organization ID found for the project.");
  }

  // Fetch users from the organization
  console.log(`Fetching users for organizationId: ${organizationId}`);
  const usersResponse = await api.asApp().requestJira(
    route`/rest/servicedeskapi/organization/${organizationId}/user`
  );
  if (!usersResponse.ok) {
    console.error(`Failed to fetch users: ${usersResponse.status} ${usersResponse.statusText}`);
    throw new Error("Unable to fetch users.");
  }
  const usersData = await usersResponse.json();

  // Log the fetched users
  console.log(`Fetched Users: ${JSON.stringify(usersData.values, null, 2)}`);

  // Return the list of users
  return usersData.values.map((user) => ({
    id: user.accountId,
    displayName: user.displayName,
  }));
};

// Export handler for manifest usage
export const handler = async (context) => {
  return await getUsers(context);
};
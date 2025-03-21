import React, { useState, useEffect, useCallback } from 'react';
import ForgeReconciler, { Select } from '@forge/react';
import { CustomFieldEdit } from '@forge/react/jira';
import { invoke, view } from '@forge/bridge';

const Edit = () => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectContext = async () => {
      try {
        // Get project context from Jira UI
        const context = await view.getContext();
        const projectId = context.extension.project.id;

        console.log(`Project ID from context: ${projectId}`);

        // Fetch users from the resolver
        const users = await invoke('getUsers', { projectId });
        console.log('[Edit Component] Received users:', users);

        if (Array.isArray(users) && users.length > 0) {
          const formattedOptions = users.map(user => ({
            label: user.displayName, // Display the user's account ID in the dropdown
            value: user.displayName  // Store the user's account ID as the value
          }));
          setOptions(formattedOptions);

          // Restore previous selection if exists
          if (context.extension.fieldValue) {
            setValue(context.extension.fieldValue);
          }
        }
      } catch (error) {
        console.error('[Edit Component] Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectContext();
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      console.log('[Edit Component] Submitting value:', value);

      // Save the selected value (account ID) to the custom field
      await view.submit(value);
    } catch (e) {
      console.error('[Edit Component] Submit Error:', e);
    }
  }, [value]);

  return (
    <CustomFieldEdit onSubmit={onSubmit} hideActionButtons>
      <Select
        appearance="default"
        options={options}
        onChange={(e) => setValue(e.value)} // Set the selected account ID
        value={options.find(option => option.value === value) || null} // Persist the selected value
        isLoading={isLoading}
      />
    </CustomFieldEdit>
  );
};

ForgeReconciler.render(<Edit />);

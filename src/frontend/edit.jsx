import React, { useState, useEffect, useCallback } from 'react';
import ForgeReconciler, { Select } from '@forge/react';
import { CustomFieldEdit } from '@forge/react/jira';
import { invoke, view } from '@forge/bridge';

const Edit = () => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
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
            label: user.displayName, // Display the user's name in the dropdown
            value: user.displayName   // Store the user's display name as the value
          }));
          setOptions(formattedOptions);
          setFilteredOptions(formattedOptions); // Initialize filtered options with all users

          // Restore previous selection if exists
          if (context.extension.fieldValue) {
            setValue(String(context.extension.fieldValue)); // Ensure the value is a string
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

  const onInputChange = (inputValue) => {
    // Filter options based on the input value
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const onSubmit = useCallback(async () => {
    try {
      console.log('[Edit Component] Submitting value:', value);

      // Submit the selected value as a plain string
      await view.submit(value); // Submit the value directly as a string
      console.log('[Edit Component] Submitted field value:', value);
    } catch (e) {
      console.error('[Edit Component] Submit Error:', e);
    }
  }, [value]);

  const handleChange = async (selectedOption) => {
    const selectedValue = String(selectedOption.value); // Ensure the value is a string
    setValue(selectedValue);

    try {
      // Save the selected value immediately as a plain string
      await view.submit(selectedValue); // Submit the value directly as a string
      console.log('[Edit Component] Saved field value:', selectedValue);
    } catch (error) {
      console.error('[Edit Component] Error saving field value:', error);
    }
  };

  return (
    <CustomFieldEdit onSubmit={onSubmit} hideActionButtons>
      <Select
        appearance="default"
        options={filteredOptions} // Use filtered options for the dropdown
        onChange={handleChange} // Save the selected value immediately
        onInputChange={onInputChange} // Filter options based on user input
        value={options.find(option => option.value === value) || null} // Persist the selected value
        isLoading={isLoading}
        placeholder="Type to search users..."
      />
    </CustomFieldEdit>
  );
};

ForgeReconciler.render(<Edit />);
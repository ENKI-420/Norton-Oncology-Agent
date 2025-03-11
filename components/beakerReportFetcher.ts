import axios, { AxiosError } from 'axios';

const EPIC_API_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';

// Function to check for missing environment variables and handle them more gracefully
const isValidEnv = (envVar: string | undefined, name: string): string => {
  if (!envVar) {
    const errorMessage = `Missing required environment variable: ${name}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  return envVar;
};

// Enhanced Epic login function with additional error logging and validation
export const epicLogin = async (username: string, password: string): Promise<string> => {
  try {
    // Retrieve and validate environment variables
    const clientId = isValidEnv(process.env.EPIC_CLIENT_ID, 'EPIC_CLIENT_ID');
    const clientSecret = isValidEnv(process.env.EPIC_CLIENT_SECRET, 'EPIC_CLIENT_SECRET');

    console.log('Starting Epic login...');
    // Make a POST request to obtain the access token
    const response = await axios.post('https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token', {
      grant_type: 'password',
      username,
      password,
      client_id: clientId,
      client_secret: clientSecret,
    });

    console.log('Epic login successful');
    return response.data.access_token;
  } catch (error: unknown) {
    // Improved error handling for Axios-specific errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Epic Authentication Error:', axiosError.response?.data || axiosError.message);
      if (axiosError.response?.status === 401) {
        throw new Error('Invalid credentials provided');
      }
    } else {
      // Handling other unexpected errors
      console.error('Epic Authentication Error:', error);
    }
    throw new Error('Failed to authenticate with Epic');
  }
};

// Enhanced Beaker report fetching function with better error handling and response validation
export const fetchBeakerReport = async (authToken: string, patientId: string): Promise<any | null> => {
  try {
    // Ensure the required parameters are provided
    if (!authToken) {
      console.error('Error: Missing authentication token');
      throw new Error('Missing authentication token');
    }
    if (!patientId) {
      console.error('Error: Missing patient ID');
      throw new Error('Missing patient ID');
    }

    console.log('Fetching Beaker report for patient:', patientId);
    // Fetch the diagnostic report using the provided authentication token and patient ID
    const response = await axios.get(`${EPIC_API_BASE_URL}/DiagnosticReport?patient=${patientId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/fhir+json',
      },
    });

    // Validate and handle empty reports or no entries
    if (response.data.entry && response.data.entry.length > 0) {
      console.log('Beaker report fetched successfully');
      return response.data;
    } else {
      console.warn('No diagnostic reports found for the patient');
      return null; // Return null if no report is found
    }
  } catch (error: unknown) {
    // Improved error handling for Axios-specific errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Beaker Report Fetch Error:', axiosError.response?.data || axiosError.message);
      if (axiosError.response?.status === 404) {
        throw new Error('Beaker report not found for the given patient ID');
      }
    } else {
      // Handling other unexpected errors
      console.error('Beaker Report Fetch Error:', error);
    }
    throw new Error('Failed to fetch Beaker report');
  }
};

# Finding the Correct Spansh API Endpoint

The Spansh API is undocumented, so we need to find the correct endpoint by inspecting the website's network requests.

## Steps to Find the API Endpoint:

1. **Open Spansh Fleet Carrier Router**
   - Go to https://www.spansh.co.uk/fleet-carrier

2. **Open Browser Developer Tools**
   - Press `F12` or right-click and select "Inspect"
   - Click on the **Network** tab

3. **Filter Network Requests**
   - In the filter box, type: `api`
   - Or click on "XHR" to show only API requests

4. **Submit a Test Route**
   - Fill in the form on Spansh:
     - Start System: `Sol`
     - Destination: `Colonia`
     - Capacity: `0`
     - Fuel: `1000`
   - Click **Search**

5. **Find the API Request**
   - Look for a POST request in the Network tab
   - It will likely be something like:
     - `route` or
     - `fleet-carrier/route` or
     - `fleetcarrier/route`
   - Click on it

6. **Check the Request Details**
   - Look at the **Headers** tab:
     - Note the **Request URL** (full endpoint)
     - Note the **Request Method** (should be POST)
   - Look at the **Payload** or **Request** tab:
     - See what parameters are being sent
     - Note the parameter names and format

7. **Check the Response**
   - Look at the **Response** tab
   - You should see a JSON response with a `job` ID

8. **Update the Code**
   - Once you have the correct endpoint and parameters, we can update `src/spansh.ts`

## What to Look For:

The request will look something like:
```
POST https://spansh.co.uk/api/[ENDPOINT]

Payload:
{
  "source": "Sol",
  "destination": "Colonia",
  "capacity_used": 0,
  "fuel": 1000,
  [possibly other parameters]
}

Response:
{
  "job": "some-job-id-here",
  "status": "queued"
}
```

## Common Issues:

- Parameter names might be different (e.g., `source_system` instead of `source`)
- There might be required parameters we're missing
- The endpoint path might have a different structure

Once you find the correct information, let me know:
1. The full API endpoint URL
2. The exact parameter names used in the payload
3. Any additional parameters that are required

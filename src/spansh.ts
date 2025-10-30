import axios from 'axios';
import { RouteRequest, SpanshRouteResponse, SpanshRouteResult } from './types';

const SPANSH_API_URL = 'https://spansh.co.uk/api';

export async function submitRouteRequest(data: RouteRequest): Promise<string> {
  try {
    // The Spansh API requires form-urlencoded data, not JSON
    const params = new URLSearchParams({
      source: data.source,
      destination: data.destination,
      capacity_used: data.capacity_used.toString(),
      fuel: data.fuel.toString(),
    });

    console.log(`Submitting route request: ${data.source} → ${data.destination}`);
    
    const response = await axios.post<SpanshRouteResponse>(
      `${SPANSH_API_URL}/fleetcarrier/route`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log(`Route job submitted successfully: ${response.data.job}`);
    return response.data.job;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.response?.statusText || error.message;
      console.error('Spansh API error:', errorMsg);
      throw new Error(`Spansh API error: ${errorMsg}`);
    }
    throw error;
  }
}

export async function getRouteResult(jobId: string): Promise<SpanshRouteResult> {
  try {
    const response = await axios.get<SpanshRouteResult>(
      `${SPANSH_API_URL}/results/${jobId}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Spansh API error: ${error.response?.data?.error || error.message}`);
    }
    throw error;
  }
}

export async function waitForRoute(jobId: string, maxAttempts = 30, delayMs = 2000): Promise<SpanshRouteResult> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await getRouteResult(jobId);

    if (result.status === 'ok' && result.result) {
      return result;
    }

    if (result.status === 'error') {
      throw new Error(result.error || 'Route calculation failed');
    }

    // Wait before next attempt
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  throw new Error('Route calculation timed out');
}

export interface RouteRequest {
  source: string;
  destination: string;
  capacity_used: number;
  fuel: number;
}

export interface SpanshRouteResponse {
  job: string;
  status: string;
}

export interface SpanshRouteResult {
  status: string;
  result?: {
    source: string;
    destinations: string[];
    jumps: Jump[];
    capacity: number;
    capacity_used: number;
    fuel_loaded: number;
    tritium_stored: number;
  };
  error?: string;
}

export interface Jump {
  name: string;
  distance: number;
  distance_to_destination: number;
  fuel_used: number;
  fuel_in_tank: number;
  restock_amount: number;
  must_restock: number;
  is_desired_destination: number;
  has_icy_ring: boolean;
  is_system_pristine: boolean;
  x: number;
  y: number;
  z: number;
}

# Spansh API Notes

## Fleet Carrier Route API

### Endpoint
```
POST https://spansh.co.uk/api/fleetcarrier/route
```

### Content-Type
**IMPORTANT:** The API requires `application/x-www-form-urlencoded` data, **NOT** JSON!

### Parameters
- `source` (string, required): Starting system name
- `destination` (string, required): Destination system name
- `capacity_used` (number): Current cargo capacity used in tons (0-25000)
- `fuel` (number): Current tritium fuel on board in tons

### Request Example (Form-URLEncoded)
```
source=Sol&destination=Colonia&capacity_used=0&fuel=1000
```

### Response
```json
{
  "job": "UUID-HERE",
  "status": "queued"
}
```

### Getting Results
```
GET https://spansh.co.uk/api/results/{job_id}
```

Returns:
- `status`: "queued", "processing", "ok", or "error"
- `result`: Object containing route data (when status is "ok")
  - `source`: Starting system
  - `destinations`: Array of destination systems
  - `jumps`: Array of jump objects
    - `name`: System name
    - `distance`: Distance of this jump
    - `distance_to_destination`: Remaining distance to destination
    - `fuel_used`: Tritium used for this jump
    - `fuel_in_tank`: Tritium remaining after jump
    - `must_restock`: 1 if refueling needed, 0 otherwise
    - `restock_amount`: Amount to refuel
    - `has_icy_ring`: Boolean for icy ring presence (mining)
    - `is_system_pristine`: Boolean for pristine system
  - `capacity`: Total cargo capacity
  - `capacity_used`: Current cargo used
  - `fuel_loaded`: Starting fuel
  - `tritium_stored`: Tritium in storage

**Note:** The first jump in the array is the starting system (distance = 0). Total jumps = jumps.length - 1.

### Polling
The route calculation is asynchronous. Poll the results endpoint every 2-3 seconds until status is "ok" or "error".

## Common Errors

### "source and destination are required"
- This error occurs when sending JSON instead of form-urlencoded data
- Make sure Content-Type header is `application/x-www-form-urlencoded`

### 404 Not Found
- Wrong endpoint - use `/fleetcarrier/route` not `/fleet-carrier/route`

## Credits
API documentation reverse-engineered through testing since Spansh doesn't provide official API docs.

// api.js
export async function fetchDrivers(api) {
    // Get all users marked as drivers
    const drivers = await api.call("Get", { 
      typeName: "User", 
      search: { isDriver: true, active: true } 
    });
    return drivers;
  }
class AuraClient {
    constructor(apiBaseUrl) {
      this.apiBaseUrl = apiBaseUrl;
    }
  
    async makeRequest(endpoint, method = 'GET', body = null) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/${endpoint}`, {
          cache: "no-store",
          method
        });
  
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
  
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    }
  
    async getCurrentlyPlayingTrack() {
      try {
        const response = await this.makeRequest('current');
        return response;
      } catch (error) {
        console.log(error);
      }
    }
  }
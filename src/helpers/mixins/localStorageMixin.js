export default {
  data() {
    return {};
  },
  methods: {
    setLocalStorage(storageName, storageData) {
      localStorage.setItem(storageName, JSON.stringify(storageData));
    },

    getLocalStorage(storageName) {
      const storageData = localStorage.getItem(storageName);
      if (!storageData)
        return null;

      return JSON.parse(storageData);
    },
    
    parseJwt (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    },
  }
};

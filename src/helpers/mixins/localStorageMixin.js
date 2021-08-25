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
    }
  }
};

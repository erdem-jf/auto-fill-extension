function StorageHelper() {
  this.set = ({ key, value }) => {
    try {
      chrome.storage.sync.set({ [key]: value }, () => {
        console.log(`key-value`, { key, value });
      });
    } catch (err) {
      console.log('err', err);
      return err;
    }
  };
}

export default new StorageHelper();

function StorageHelper() {
  this.get = ({ key, callback }) => {
    try {
      chrome.storage.sync.get([key], (result) => {
        callback(result[key]);
      });
    } catch (err) {
      console.log('err', err);
      return err;
    }
  };

  this.set = ({ key, value }) => {
    try {
      chrome.storage.sync.set({ [key]: value });
    } catch (err) {
      console.log('err', err);
      return err;
    }
  };

  this.remove = (key) => {
    try {
      chrome.storage.sync.remove(key);
    } catch (err) {
      console.log('err', err);
      return err;
    }
  };
}

export default new StorageHelper();

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

  this.handleData = (obj, currentValueInStore) => {
    const baseData = currentValueInStore || [];
    const generatedData = [...baseData, ...obj.data];

    this.set({ key: obj.type, value: generatedData });
  };

  this.save = ({ type = 'collected', data = [] }) => {
    console.log('type', type);
    console.log('data', data);
    try {
      this.get({
        key: type,
        callback: this.handleData.bind(this, { type, data }),
      });
    } catch (err) {
      console.error('SaveData error', err);
    }
  };

  this.getTab = (callback) => {
    try {
      chrome.tabs.getSelected(null, callback);
    } catch (err) {
      console.error('Err', err);
    }
  };
}

export default new StorageHelper();

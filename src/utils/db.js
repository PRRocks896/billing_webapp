let request;
let db;
let version = 1;

export const Stores = {
  Bills: "bills",
};

export const initDB = () => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open("myDB");

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Bills)) {
        console.log("Creating Bills store");
        db.createObjectStore(Stores.Bills, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log("request.onsuccess - initDB", version);
      resolve(true);
    };

    request.onerror = () => {
      console.log(" db initi error");
      resolve(false);
    };
  });
};

export const addData = function (storeName, data) {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB", version);

    request.onsuccess = function () {
      console.log("request.onsuccess - addData", data);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      // Make sure data has a valid 'id' property
      if (data.id === undefined) {
        // You might need to generate a unique id here, depending on your requirements
        data.id = Math.random(); // Example: You need to implement this function
      }
      store.add(data);
      resolve({ statusCode: 200, message: "Record Added Successfully.", data });
    };

    request.onerror = function () {
      const error = request.error ? request.error.message : "Unknown error";
      resolve({ statusCode: 400, error });
    };
  });
};

export const getStoreData = function (storeName, searchValue) {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB");
    if (searchValue === "") {
      request.onsuccess = function () {
        console.log("request.onsuccess - getAllData", searchValue);
        db = request.result;
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const res = store.getAll();
        res.onsuccess = function () {
          resolve({ statusCode: 200, data: res.result });
        };
      };
    } else {
      console.log("request.onsuccess - searchData", searchValue);
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      // const searchRequest = store.getAll(searchValue);
      const searchRequest = store.getAll(searchValue);

      searchRequest.onsuccess = function () {
        const results = searchRequest.result;
        if (results.length > 0) {
          resolve({ statusCode: 200, data: results });
        } else {
          resolve({ statusCode: 404, data: [], error: "No records found" });
        }
      };

      searchRequest.onerror = function () {
        const error = request.error ? request.error.message : "Unknown error";
        resolve({ statusCode: 400, error });
      };
    }
  });
};

export const getSingleData = function (storeName, key) {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB");

    request.onsuccess = function () {
      console.log("request.onsuccess - getSingleData");
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const res = store.get(key);

      res.onsuccess = function () {
        resolve({ statusCode: 200, data: res.result });
      };
      res.onerror = function () {
        const error = request.error ? request.error.message : "Unknown error";
        resolve({ statusCode: 404, error });
      };
    };
  });
};

export const searchData = function (storeName, key, searchValue) {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB");

    request.onsuccess = function () {
      console.log("request.onsuccess - searchData");
      const db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);

      const index = store.index(key);
      const searchRequest = index.getAll(searchValue);

      searchRequest.onsuccess = function () {
        const results = searchRequest.result;
        if (results.length > 0) {
          resolve({ statusCode: 200, data: results });
        } else {
          resolve({ statusCode: 404, error: "No records found" });
        }
      };

      searchRequest.onerror = function () {
        const error = request.error ? request.error.message : "Unknown error";
        resolve({ statusCode: 500, error });
      };
    };
  });
};

export const updateData = function (storeName, key, data) {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB", version);

    request.onsuccess = function () {
      console.log("request.onsuccess - updateData", key, data);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.get(key);

      res.onsuccess = function () {
        const oldData = res.result;
        const newData = { ...oldData, ...data };
        store.put(newData);
        // resolve(newData);
        resolve({
          statusCode: 200,
          message: "Record Updated Successfully",
          data: newData,
        });
      };

      res.onerror = function () {
        const error = request.error ? request.error.message : "Unknown error";
        resolve({ statusCode: 404, error });
      };
    };
  });
};

export const deleteData = function (storeName, key) {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB", version);

    request.onsuccess = function () {
      console.log("request.onsuccess - deleteData", key);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.delete(key);

      res.onsuccess = function () {
        resolve({ statusCode: 200, message: "Record Removed Successfully." });
        // resolve(true);
      };

      res.onerror = function () {
        const error = request.error ? request.error.message : "Unknown error";
        resolve({ statusCode: 400, error });
        // resolve(false);
      };
    };
  });
};

export const deleteAllData = function (storeName) {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB", version);

    request.onsuccess = function () {
      console.log("request.onsuccess - deleteAllData");
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);

      const clearRequest = store.clear();

      clearRequest.onsuccess = function () {
        resolve({
          statusCode: 200,
          message: "All Records Removed Successfully.",
        });
      };

      clearRequest.onerror = function () {
        const error = request.error ? request.error.message : "Unknown error";
        resolve({ statusCode: 400, error });
      };
    };
  });
};

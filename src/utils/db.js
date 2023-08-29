var request;
var db;
let version = 1;

export const Stores = {
  Bills: "bills",
  Staff: "staff",
  Customer: "customer",
  Service: "service",
};

export const initDB = () => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open("myDB");

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Bills)) {
        db.createObjectStore(Stores.Bills, {
          keyPath: "id",
        });
      }
      if (!db.objectStoreNames.contains(Stores.Staff)) {
        db.createObjectStore(Stores.Staff, {
          keyPath: "id",
        });
      }
      if (!db.objectStoreNames.contains(Stores.Customer)) {
        db.createObjectStore(Stores.Customer, {
          keyPath: "id",
        });
      }
      if (!db.objectStoreNames.contains(Stores.Service)) {
        db.createObjectStore(Stores.Service, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export const addData = function (storeName, data, flag = "single") {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB", version);
    request.onsuccess = function () {
      db = request.result;

      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      // Make sure data has a valid 'id' property
      if (data.id === undefined) {
        // You might need to generate a unique id here, depending on your requirements
        data.id = Math.random(); // Example: You need to implement this function
      }
      if (flag === "single") {
        store.add(data);
      } else {
        data?.forEach((item) => {
          store.put(item);
        });
      }
      resolve({ statusCode: 200, message: "Record Added Successfully.", data });
    };

    request.onerror = function () {
      const error = request.error ? request.error.message : "Unknown error";
      resolve({ statusCode: 400, error });
    };
  });
};

export const getStoreDataPagination = (
  storeName,
  pageNumber = 1,
  pageSize = 10,
  searchValue = ""
) => {
  let totalCount = 0;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDB");
    request.onsuccess = () => {
      var db = request.result;
      const trans = db.transaction(storeName, "readonly");
      const store = trans.objectStore(storeName);
      store.count().onsuccess = (event) => {
        totalCount = event.target.result;
      };
      const res =
        searchValue.length > 0 ? store.getAll(searchValue) : store.getAll(null);
      res.onsuccess = (event) => {
        const allItems = event.target.result;
        const startIndex = pageNumber * pageSize;
        const endIndex = startIndex + pageSize;
        const items = allItems.slice(startIndex, endIndex);
        resolve({ statusCode: 200, data: items, count: totalCount });
      };
    };
  });
};

export const getStoreData = function (storeName, searchValue = "") {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB");

    // if (searchValue === "") {
    request.onsuccess = function () {
      var db = request.result;

      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      let res;
      if (searchValue === "") {
        res = store.getAll();
      } else {
        res = store.getAll(searchValue);
      }
      res.onsuccess = function () {
        // resolve({ statusCode: 200, data: res.result });
        if (res.result.length > 0) {
          resolve({ statusCode: 200, data: res.result });
        } else {
          resolve({ statusCode: 404, data: [], error: "No records found" });
        }
      };
    };
    // }
    // else {
    //   // console.log("request.onsuccess - searchData", searchValue);
    //   // console.log("sdgdsggg", db);

    //   // console.log("db", db);
    //   // const tx = db.transaction(storeName, "readonly");
    //   // const store = tx.objectStore(storeName);
    //   // const searchRequest = store.getAll(searchValue);
    //   // const searchRequest = store.getAll(searchValue);

    //   request.onsuccess = function () {
    //     var db = request?.result;
    //     console.log("db", db);
    //     const transaction = db.transaction(["bills"], "readonly");
    //     const store = transaction.objectStore("bills");
    //     console.log("store", store);
    //     // const index = store?.index("billNo");
    //     // const searchRequest = index.getAll(
    //     //   IDBKeyRange.bound(searchValue, searchValue + "\uffff")
    //     // );
    //     const searchRequest = store.getAll();
    //     console.log("searchRequest", searchRequest);
    //     // const { result } = searchRequest;
    //     // console.log("search result", result);
    //     // const results = searchRequest.result;
    //     // if (results.length > 0) {
    //     //   resolve({ statusCode: 200, data: results });
    //     // } else {
    //     //   resolve({ statusCode: 404, data: [], error: "No records found" });
    //     // }
    //   };

    //   request.onerror = function () {
    //     const error = request.error ? request.error.message : "Unknown error";
    //     console.log(error);
    //     resolve({ statusCode: 400, error });
    //   };
    // }
  });
};

export const getSingleData = function (storeName, key) {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB");

    request.onsuccess = function () {
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

export const searchData = function (storeName, key, searchValue = "") {
  return new Promise(function (resolve) {
    const request = indexedDB.open("myDB");

    request.onsuccess = function () {
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
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.delete(key);

      res.onsuccess = function () {
        resolve({ statusCode: 200, message: "Record Deleted Successfully." });
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

// ----------------------------------------------------------

// export const addStaffData = function (storeName, data) {
//   return new Promise(function (resolve) {
//     const request = indexedDB.open("myDB", version);

//     request.onsuccess = function () {
//       db = request.result;

//       const tx = db.transaction(storeName, "readwrite");
//       const store = tx.objectStore(storeName);
//       // Make sure data has a valid 'id' property
//       if (data.id === undefined) {
//         // You might need to generate a unique id here, depending on your requirements
//         data.id = Math.random(); // Example: You need to implement this function
//       }
//       store.add(data);
//       resolve({ statusCode: 200, message: "Record Added Successfully.", data });
//     };

//     request.onerror = function () {
//       const error = request.error ? request.error.message : "Unknown error";
//       resolve({ statusCode: 400, error });
//     };
//   });
// };

// export const getStaffData = function (storeName, searchValue = "") {
//   return new Promise(function (resolve) {
//     const request = indexedDB.open("myDB");

//     // if (searchValue === "") {
//     request.onsuccess = function () {
//       var db = request.result;

//       const tx = db.transaction(storeName, "readonly");
//       const store = tx.objectStore(storeName);
//       let res;
//       if (searchValue === "") {
//         res = store.getAll();
//       } else {
//         res = store.getAll(searchValue);
//       }
//       res.onsuccess = function () {
//         // resolve({ statusCode: 200, data: res.result });
//         if (res.result.length > 0) {
//           resolve({ statusCode: 200, data: res.result });
//         } else {
//           resolve({ statusCode: 404, data: [], error: "No records found" });
//         }
//       };
//     };
//   });
// };

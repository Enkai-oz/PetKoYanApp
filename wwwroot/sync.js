
(function () {
  const originalSetItem = Storage.prototype.setItem;

  let isHydrating = true;
  let syncQueue = Promise.resolve();

  const uploadedImages = new Map();

  async function uploadImage(dataUrl) {
    if (
      typeof dataUrl !== "string" ||
      !dataUrl.startsWith("data:image/")
    ) {
      return dataUrl;
    }

    if (uploadedImages.has(dataUrl)) {
      return uploadedImages.get(dataUrl);
    }

    const uploadPromise = (async () => {
      const response = await fetch("/api/upload-base64", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          base64Data: dataUrl
        })
      });

      if (!response.ok) {
        throw new Error(
          "Image upload failed: " + response.status
        );
      }

      const result = await response.json();

      if (!result.url) {
        throw new Error("No image URL returned by server.");
      }

      return result.url;
    })();

    uploadedImages.set(dataUrl, uploadPromise);

    try {
      return await uploadPromise;
    } catch (error) {
      uploadedImages.delete(dataUrl);
      throw error;
    }
  }

  async function processImages(value) {
    if (typeof value === "string") {
      return await uploadImage(value);
    }

    if (Array.isArray(value)) {
      return await Promise.all(
        value.map(item => processImages(item))
      );
    }

    if (value && typeof value === "object") {
      const result = {};

      for (const key of Object.keys(value)) {
        result[key] = await processImages(value[key]);
      }

      return result;
    }

    return value;
  }

  async function syncKeyAndPush(key, rawValue) {
    if (isHydrating) return;

    let parsedValue;
    let wasJson = true;

    try {
      parsedValue = JSON.parse(rawValue);
    } catch {
      parsedValue = rawValue;
      wasJson = false;
    }

    try {
      const processed = await processImages(parsedValue);

      const finalValue = wasJson
        ? JSON.stringify(processed)
        : processed;

      // Do not overwrite a newer local change.
      if (localStorage.getItem(key) !== rawValue) {
        return;
      }

      originalSetItem.call(
        localStorage,
        key,
        finalValue
      );

      const dump = {};

      for (let i = 0; i < localStorage.length; i++) {
        const currentKey = localStorage.key(i);

        if (currentKey !== null) {
          dump[currentKey] = localStorage.getItem(currentKey);
        }
      }

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          RawStorage: dump
        })
      });

      if (!response.ok) {
        throw new Error("Server synchronization failed.");
      }

      console.log("Saved successfully:", key);

    } catch (error) {
      console.error("Save or image upload failed:", error);
    }
  }

  Storage.prototype.setItem = function (key, value) {
    originalSetItem.call(this, key, value);

    if (this === localStorage && !isHydrating) {
      const rawValue = String(value);

      syncQueue = syncQueue
        .then(() => syncKeyAndPush(key, rawValue))
        .catch(error => {
          console.error("Synchronization queue error:", error);
        });
    }
  };

  // Restore saved application data before the app loads.
  try {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      "/api/data?_=" + Date.now(),
      false
    );

    xhr.send(null);

    if (xhr.status === 200 && xhr.responseText) {
      const serverData = JSON.parse(xhr.responseText);

      const rawMap =
        serverData.RawStorage ||
        serverData.rawStorage ||
        {};

      Object.keys(rawMap).forEach(key => {
        originalSetItem.call(
          localStorage,
          key,
          rawMap[key]
        );
      });
    }
  } catch (error) {
    console.warn("Could not restore server data:", error);
  } finally {
    isHydrating = false;
  }
})();

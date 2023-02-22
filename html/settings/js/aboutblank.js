const urlInput = document.getElementById("url-target");
      const urlObject = new URL(window.location.href);

      document.getElementById("create").onclick = function () {
        let url = urlInput.value;

        if (
          url.substring(0, 8) !== "https://" &&
          url.substring(0, 7) !== "http://"
        ) {
          url = "https://" + url.split("https://").pop();
        } else if (url.substring(0, 7) === "http://") {
          url = "https://" + url.split("http://").pop();
        }

        const newWindow = window.open();
        newWindow.document.body.style.margin = "0";
        newWindow.document.body.style.height = "100vh";

        const iframe = newWindow.document.createElement("iframe");
        iframe.style.border = "none";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.margin = "0";
        iframe.referrerpolicy = "no-referrer";
        iframe.allow = "fullscreen";
        iframe.src = url;

        newWindow.document.body.appendChild(iframe);
      };
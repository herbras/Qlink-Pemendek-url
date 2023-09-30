<script>
  import { onMount, onDestroy } from "svelte";
  import { historyStore, toastStore } from "./Store.js";
  import { fade, fly, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import QRCode from "qrcode";
  import { tick } from "svelte";
  let qrSize = 500;

  let unsubscribe;
  let storageSubscription;
  let showModal;
  let dialog;
  $: if (dialog && showModal) dialog.showModal();
  let currentQR = "";
  let currentUrl = "";

  onMount(() => {
    unsubscribe = historyStore.subscribe((value) => {});
    storageSubscription = window.addEventListener("storage", (event) => {
      if (event.key === "histories") {
        historyStore.set(JSON.parse(event.newValue));
      }
    });
  });

  onDestroy(() => {
    unsubscribe();
    window.removeEventListener("storage", storageSubscription);
  });

  function deleteHistory(index) {
    historyStore.update((histories) => histories.filter((_, i) => i !== index));
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showToast(` ${text}`);
  }

  async function createQR(url) {
    try {
      currentUrl = url;
      let opts = {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.3,
        margin: 1,
        color: {
          dark: "#010599FF",
          light: "#FFBF60FF",
        },
        width: 250,
      };
      currentQR = await QRCode.toDataURL(url, opts);
      await tick();
      dialog.showModal();
    } catch (err) {
      console.error(err);
    }
  }

  function closeModal() {
    dialog.close();
  }

  function downloadQR() {
    let link = document.createElement("a");
    link.download = "Qlink.png";
    link.href = currentQR;
    link.click();
  }

  // Toast UI
  function showToast(message) {
    let id = Math.floor(Math.random() * 10000);
    toastStore.update((toasts) => [...toasts, { id, message }]);
    setTimeout(() => {
      toastStore.update((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 3000);
  }
</script>

<div class="w-full mt-12 space-y-4 font-sans">
  {#each $historyStore as history, index (history.uniqcode)}
    <div
      class="rounded-lg shadow-lg mt-5 md:mt-12 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-500 ease-quint-out"
      in:fly={{ y: -200, duration: 500, easing: quintOut }}
      out:fade={{ duration: 300 }}
    >
      <div class="p-6 flex justify-between items-center">
        <div class="pr-6 w-45 md:w-full truncate">
          <h2
            class="text-2xl leading-7 truncate font-semibold text-gray-800 dark:text-white flex items-center"
          >
            <a
              target="_blank"
              href={`https://www.qlm.one/${history.uniqcode}`}
              class="text-black dark:text-white truncate"
              aria-label={`Link to QLM.ONE/${history.uniqcode}`}
            >
              {`QLM.ONE/${history.uniqcode}`}
            </a>
            <button
              on:click={() => copyToClipboard(`qlm.one/${history.uniqcode}`)}
              class="btn i-tabler-copy p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition ease-in-out duration-150 ml-2"
              aria-label="Copy link"
            />
            <button
              on:click={() => (showModal = true)}
              on:click={() =>
                createQR(`https://www.qlm.one/${history.uniqcode}`)}
              class="btn i-tabler-qrcode p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition ease-in-out duration-150 ml-2"
              aria-label="Generate QR code"
            />
          </h2>

          <a
            href={history.link}
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            aria-label="Link to original URL"
          >
            {history.link}
          </a>
        </div>
        <button
          on:click={() => deleteHistory(index)}
          class="btn i-tabler-square-rounded-x-filled text-red-500 p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-700 transition ease-in-out duration-150"
          aria-label="Delete history"
        />
      </div>
    </div>
  {/each}
</div>

<dialog
  class="bg-blue-300 p-8 rounded-lg shadow-xl text-center"
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click={closeModal}
>
  <div
    class="fixed inset-0 flex items-center justify-center z-50"
    transition:fade
  >
    <div
      class="bg-white p-2 rounded shadow-lg flex flex-col md:w-1/2 lg:w-1/3 xl:w-1/4 items-center justify-center"
      on:click|stopPropagation
    >
      <h2 class="mb-4 text-xl font-semibold">Your QR Code</h2>
      <img src={currentQR} alt="QR Code" />
      <button
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        on:click={downloadQR}
      >
        Download QR Code
      </button>
    </div>
  </div>
</dialog>

<div
  class="fixed font-sans bottom-0 right-0 p-4 space-y-2 md:w-1/2 lg:w-1/3 xl:w-1/4"
>
  {#each $toastStore as toast (toast.id)}
    <div
      in:fly={{ y: -200, duration: 500, easing: quintOut }}
      out:scale={{ duration: 500 }}
      class="bg-blue-500 text-white dark:bg-blue-200 dark:text-black p-2 rounded text-lg font-semibold shadow-md"
    >
      Link kamu {toast.message} telah berhasil disalin, Terima Kasih.
    </div>
  {/each}
</div>

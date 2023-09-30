<script lang="ts">
  import { historyStore } from "./Store.js";
  let uniqcode = "";
  let link = "";
  let isSubmitting = false;
  let errorMessage = "";

  function generateUniqCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    uniqcode = result;
  }

  async function submit() {
    isSubmitting = true;
    errorMessage = "";

    const response = await fetch("https://www.sarbeh.com/api/Post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uniqcode: uniqcode,
        link: link,
      }),
    });

    const data = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (data.error && data.error === "Kode Unik sudah dipakai") {
        errorMessage = data.error;
      } else {
        const message = `Selamat URL anda sudah di pendekkan dan ini adalah Link mu Qlm.one/${uniqcode}`;
        historyStore.update(histories => [{ uniqcode, link, message }, ...histories]);
      }
    }
    isSubmitting = false;
  }

</script>
<div class="w-full mt-12">
  <form
    class="p-1 flex flex-col md:flex-row rounded-md md:rounded-full md:bg-gray-200 text-center md:dark:bg-gray-800 md:shadow-md md:p-2"
    on:submit|preventDefault={submit}
  >
    <div class="relative flex items-center mb-4 md:mb-0 md:mr-2 md:w-1/2">
      <input
        id="unique-code"
        type="text"
        bind:value={uniqcode}
        class="w-full p-2 md:p-4 rounded-full text-sm md:text-xl outline-none bg-transparent dark:text-white dark:placeholder-gray-300"
        placeholder="Generate Your Code"
        required
      />
      <div
        on:click={generateUniqCode}
        class="absolute right-3 i-tabler-arrows-shuffle text-2xl"
      />
    </div>
    <div class="relative flex items-center mb-4 md:mb-0 md:mr-2 w-full">
      <input
        id="link"
        type="url"
        bind:value={link}
        class="w-full p-2 md:p-4 rounded-full text-sm md:text-xl outline-none bg-transparent dark:text-white dark:placeholder-gray-300"
        placeholder="Insert your link"
        required
      />
      <div class="absolute right-3 i-tabler-link text-2xl" />
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      class="mt-4 md:mt-0 w-full md:w-auto py-2 md:py-3 px-4 md:px-6 rounded-full text-center transition bg-gradient-to-b from-yellow-200 to-yellow-300 hover:to-red-300 active:from-yellow-400 focus:from-red-400 md:px-12"
    >
      {#if isSubmitting}
        <div class="i-tabler-loader font-bold md:block text-2xl text-black" />
      {:else}
        <span class="text-yellow-900 font-semibold md:block">Submit</span>
      {/if}
    </button>
  </form>
</div>

{#if errorMessage}
  <div
    class="bg-red-100 mt-12 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <strong class="font-bold">Uh-oh! </strong>
    <span class="block sm:inline">
      Kode unik Anda sudah dipakai orang lain. Coba lagi dengan kode yang berbeda.
    </span>
    <div class="i-tabler-square-rounded-x-filled absolute top-0 bottom-0 right-0 px-4 py-3"         on:click={() => (errorMessage = "")}
      />

  </div>
{/if}



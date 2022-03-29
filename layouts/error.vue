<template>
  <div>
    <Header />
    <main class="text-center" role="main">
      <div class="msg-area">
        <div>
          <h1 class="text-center text-danger mb-3">
            {{ error.statusCode }} エラー!
          </h1>
          <NuxtLink class="page-link d-inline-block" to="/" role="button"
            >TOPへ</NuxtLink
          >
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  head() {
    return {
      title: `${this.error.statusCode}エラー`,
    }
  },
}
</script>

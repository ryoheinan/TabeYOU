<template>
  <div>
    <Header />
    <client-only>
      <main class="container d-flex justify-content-center">
        <FindCard class="find-card" />
      </main>
    </client-only>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'IndexPage',
})
</script>

<style scoped>
.find-card {
  margin: 3rem;
  width: 100%;
  max-width: 50rem;
}
</style>

<template>
  <div>
    <Header />
    <client-only>
      <FindCard class="m-5" />
    </client-only>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'IndexPage',
})
</script>

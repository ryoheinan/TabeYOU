<template>
  <div>
    <h1>Explore</h1>
    {{ restaurants.data }}
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  useAsync,
  useContext,
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ExplorePage',
  setup() {
    const { $axios, query } = useContext()

    const restaurants = reactive({
      data: {},
      isLoading: true,
      errorMsg: '',
    })

    const paramsItem = [
      'lat',
      'lng',
      'range',
      'keyword',
      'free_drink',
      'free_food',
      'private_room',
      'non_smoking',
      'barrier_free',
      'english',
      'pet',
      'child',
    ]

    const getParams = () => {
      const result = {}
      for (const item of paramsItem) {
        result[item] = query.value[item]
      }
      return result
    }

    useAsync(async () => {
      try {
        const response = await $axios.$get('/api/hotpepper/gourmet/v1', {
          params: getParams(),
        })
        if (response.results.error) {
          restaurants.errorMsg = response.results.error[0].message
        } else {
          restaurants.data = response.results
        }
      } catch (error) {
        restaurants.errorMsg = 'Failed to get gourmet data.'
      } finally {
        restaurants.isLoading = false
      }
    })

    return { restaurants }
  },
})
</script>

<style scoped></style>

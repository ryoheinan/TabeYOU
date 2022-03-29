<template>
  <div>
    <Header />
    <main class="container d-flex justify-content-center">
      <div v-if="restaurants.errorMsg" class="msg-area">
        <div>
          <div class="h5 text-center text-danger">エラー!</div>
          {{ restaurants.errorMsg }}
        </div>
      </div>
      <div v-else-if="restaurants.isLoading" class="msg-area">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else>
        <h1 class="h2">検索一覧</h1>
        <p class="small text-muted">
          {{ restaurants.resultsAvailable }}件見つかりました。
        </p>
        <nuxt-link
          v-for="shop in restaurants.shops"
          :key="shop.id"
          :to="{ name: 'shops-id', params: { id: shop.id } }"
          class="card-link-area"
        >
          <div class="card mb-4">
            <div class="row g-0">
              <div
                class="col-md-2 d-flex justify-content-center align-items-center py-2 py-md-0"
              >
                <img
                  :src="shop.logo_image"
                  :alt="
                    shop.logo_image.includes('noimage')
                      ? 'ロゴ画像提供なし'
                      : `${shop.name}のアイコン画像`
                  "
                />
              </div>
              <div class="col-md-10">
                <div class="info">
                  <p class="h4 card-title">{{ shop.name }}</p>
                  <p>{{ shop.catch }}</p>
                  <dl>
                    <dt>アクセス</dt>
                    <dd>{{ shop.access }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </main>
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
      shops: {},
      resultsAvailable: 0,
      resultsPerPage: 0,
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
          restaurants.shops = response.results.shop
          restaurants.resultsAvailable = response.results.results_available
          restaurants.resultsPerPage = response.results.results_returned
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

<style scoped>
.card {
  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 14%);
  transition: ease-in-out 0.25s;
}

.card:hover {
  transform: scale(1.025, 1.025);
}

.card-link-area {
  text-decoration: none;
  color: #000000;
}

.card-link-area:hover {
  text-decoration: none;
  color: #000000;
}

.info {
  margin: 1.25rem 0.5rem 1.25rem 0;
}

@media (max-width: 768px) {
  .info {
    margin: 1.25rem 1rem;
  }
}

@media (min-width: 768px) {
  .card {
    width: 50rem;
  }
}
</style>

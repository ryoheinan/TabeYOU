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
      <div
        v-else-if="parseInt(restaurants.resultsAvailable) === 0"
        class="msg-area"
      >
        <div>
          <div class="h5 text-center text-danger">Not found!</div>
          条件に合致するお店が見つかりませんでした。
        </div>
      </div>
      <div v-else>
        <h1 class="h2">検索一覧</h1>
        <p class="small text-muted">
          {{ restaurants.resultsAvailable }}件見つかりました（{{
            parseInt(params.page) + 1
          }}/{{ Math.floor(restaurants.resultsAvailable / 10) + 1 }}ページ）
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
        <nav aria-label="ページナビゲーション">
          <ul class="d-flex justify-content-center pagination mb-3">
            <li
              class="page-item me-1"
              :class="{
                disabled: parseInt(params.page) <= 0,
              }"
            >
              <button
                class="page-link"
                aria-label="戻る"
                @click="pagination('back')"
              >
                <span aria-hidden="true">前ページ</span>
              </button>
            </li>
            <li
              class="page-item ms-1"
              :class="{
                disabled:
                  parseInt(params.page) * 10 + 11 >
                  restaurants.resultsAvailable,
              }"
            >
              <button
                class="page-link"
                aria-label="次へ"
                @click="pagination('next')"
              >
                <span aria-hidden="true">次ページ</span>
              </button>
            </li>
          </ul>
          <div class="d-flex justify-content-center mb-5">
            <NuxtLink to="/" class="page-link">TOPへ</NuxtLink>
          </div>
        </nav>
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
  useRouter,
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ExplorePage',
  setup() {
    const { $axios, params, query } = useContext()
    const router = useRouter()

    const restaurants = reactive({
      shops: {},
      resultsAvailable: 0,
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
      result.start = parseInt(params.value.page) * 10 + 1
      return result
    }

    const pagination = (mode) => {
      if (
        mode === 'next' &&
        parseInt(params.value.page) * 10 + 11 <= restaurants.resultsAvailable
      ) {
        router.push({
          name: 'explore-page',
          params: { page: parseInt(params.value.page) + 1 },
          query: query.value,
        })
      } else if (mode === 'back' && parseInt(params.value.page) > 0) {
        router.push({
          name: 'explore-page',
          params: { page: parseInt(params.value.page) - 1 },
          query: query.value,
        })
      }
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
        }
      } catch (error) {
        restaurants.errorMsg = 'Failed to get gourmet data.'
      } finally {
        restaurants.isLoading = false
      }
    })

    return { pagination, restaurants, params }
  },
})
</script>

<style scoped>
.page-link {
  cursor: pointer;
}

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

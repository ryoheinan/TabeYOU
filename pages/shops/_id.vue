<template>
  <div>
    <Header />
    <main class="container d-flex justify-content-center">
      <p v-if="restaurants.errorMsg">{{ restaurants.errorMsg }}</p>
      <div v-else class="">
        <h1 class="h2">店舗詳細</h1>
        <div v-for="shop in restaurants.shops" :key="shop.id" class="card mb-3">
          <div class="img-area">
            <img
              :src="shop.photo.pc.l"
              :alt="
                shop.logo_image.includes('noimage')
                  ? '画像提供なし'
                  : `${shop.name}の画像`
              "
              class="card-img-top"
            />
          </div>
          <div class="content">
            <p class="h3 card-title">{{ shop.name }}</p>
            <p>{{ shop.catch }}</p>
            <dl>
              <dt>種類</dt>
              <dd>{{ shop.genre.name }}</dd>
              <dt>営業時間</dt>
              <dd>{{ shop.open }}</dd>
              <dt>定休日</dt>
              <dd>{{ shop.close }}</dd>
              <dt>アクセス</dt>
              <dd>{{ shop.access }}</dd>
              <dt>住所</dt>
              <dd>{{ shop.address }}</dd>
              <dt>飲み放題</dt>
              <dd>{{ shop.free_drink }}</dd>
              <dt>食べ放題</dt>
              <dd>{{ shop.free_food }}</dd>
              <dt>個室あり</dt>
              <dd>{{ shop.private_room }}</dd>
              <dt>禁煙席</dt>
              <dd>{{ shop.non_smoking }}</dd>
              <dt>バリアフリー</dt>
              <dd>{{ shop.barrier_free }}</dd>
              <dt>英語対応</dt>
              <dd>{{ shop.english }}</dd>
              <dt>ペット可否</dt>
              <dd>{{ shop.pet }}</dd>
              <dt>お子様連れOK</dt>
              <dd>{{ shop.child }}</dd>
            </dl>
          </div>
        </div>
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
  name: 'DetailPage',
  setup() {
    const { $axios, params } = useContext()

    const restaurants = reactive({
      shops: {},
      resultsAvailable: 0,
      resultsPerPage: 0,
      isLoading: true,
      errorMsg: '',
    })

    useAsync(async () => {
      try {
        const response = await $axios.$get('/api/hotpepper/gourmet/v1', {
          params: {
            id: params.value.id,
          },
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
  max-width: 50rem;
}

.content {
  margin: 1.25rem;
}

.img-area {
  width: 100%;
}

@media (max-width: 768px) {
  .content {
    margin: 1.25rem 1rem;
  }
}

@media (min-width: 768px) {
  .img-area {
    display: flex;
    justify-content: center;
  }
  
  .card-img-top {
    max-width: 25rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>

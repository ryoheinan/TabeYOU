<template>
  <div class="card p-3">
    <div class="mb-3">
      <label for="keyword" class="form-label">キーワード</label>
      <input id="keyword" v-model="keyword" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label for="range" class="form-label">検索半径</label>
      <select id="range" v-model="range" class="form-select">
        <option value="1">300m</option>
        <option value="2">500m</option>
        <option value="3">1000m</option>
        <option value="4">2000m</option>
        <option value="5">3000m</option>
      </select>
    </div>
    <button
      v-if="!moreInfo"
      class="btn btn-link mt-2 mb-3"
      @click="moreInfo = !moreInfo"
    >
      さらに詳しい条件設定
    </button>
    <Transition name="slide">
      <div v-show="moreInfo" class="wrapper mb-3 mx-2">
        <div
          v-for="(item, index) in preference"
          :key="item.id"
          class="form-check"
        >
          <input
            :id="item.id"
            type="checkbox"
            class="form-check-input"
            @change="preferenceChange(index)"
          />
          <label :for="item.id" class="form-check-label">{{ item.name }}</label>
        </div>
      </div>
    </Transition>
    <button
      class="button button-primary"
      :disabled="isLoading"
      @click="search"
    >
      探す
      <span
        v-if="isLoading"
        class="spinner-border spinner-border-sm ms-2"
        role="status"
        aria-hidden="true"
      ></span>
    </button>
  </div>
</template>

<script>
import { defineComponent, ref, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const router = useRouter()
    const keyword = ref()
    const range = ref(3)
    const moreInfo = ref()
    const isLoading = ref(false)

    const preference = ref([
      { id: 'free_drink', name: '飲み放題', value: 0 },
      { id: 'free_food', name: '食べ放題', value: 0 },
      { id: 'private_room', name: '個室あり', value: 0 },
      { id: 'non_smoking', name: '禁煙席', value: 0 },
      { id: 'barrier_free', name: 'バリアフリー', value: 0 },
      { id: 'english', name: '英語対応', value: 0 },
      { id: 'pet', name: 'ペット可', value: 0 },
      { id: 'child', name: 'お子様連れOK', value: 0 },
    ])

    const preferenceChange = (index) => {
      if (preference.value[index].value === 0) {
        preference.value[index].value = 1
      } else if (preference.value[index].value === 1) {
        preference.value[index].value = 0
      }
    }

    const getCurrentPosition = (options) => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })
    }

    const search = async () => {
      if ('geolocation' in navigator) {
        try {
          isLoading.value = true
          const response = await getCurrentPosition()
          const queryData = {}
          queryData.lat = response.coords.latitude
          queryData.lng = response.coords.longitude
          if (keyword.value) {
            queryData.keyword = keyword.value
          }
          queryData.range = range.value
          for (const item of preference.value) {
            queryData[item.id] = item.value
          }
          isLoading.value = false
          router.push({ name: 'search', query: queryData })
        } catch (e) {
          isLoading.value = false
          alert('位置情報が取得できませんでした。')
        }
      } else {
        alert('位置情報が取得できませんでした。')
      }
    }

    return {
      keyword,
      range,
      moreInfo,
      preference,
      isLoading,
      preferenceChange,
      search,
    }
  },
})
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

@media (max-width: 768px) {
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 420px) {
  .wrapper {
    display: grid;
    grid-template-columns: 1fr;
  }
}

.slide-enter-active {
  animation: slide-in 0.2s;
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

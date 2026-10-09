<template>
  <div class="fullscreen hero-gradient text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="text-404">404</div>

      <div class="text-h3 opacity-40">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="primary"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<style scoped>
.text-404 {
  font-size: 30vh;
  font-weight: 700;
  line-height: 1;
}

.opacity-40 {
  opacity: 0.4;
}
</style>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Send Transaction</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Send Transaction</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <div id="container">
        <ion-button @click="onClickSendTransaction">Send Transaction</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, loadingController, toastController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { sendTransaction } from '@/libs/SymbolService';
  
export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
  },

  data() {
    return {
      loading: {} as HTMLIonLoadingElement,
    }
  },

  methods: {
    async showloading() {
      console.log();
      this.loading = await loadingController.create({
        message: '送信中...'
      });
      await this.loading.present();
    },

    async dissmissLoading() {
      this.loading.dismiss();
    },

    async showToast(msg: string) {
      const toast = await toastController.create({
        message: msg,
        duration: 2000,
      });
      
      toast.present();
    },

    async onClickSendTransaction() {
      try {
        await this.showloading();
        const transaction = await sendTransaction();
        console.log(transaction);
        await this.showToast('送信が完了しました');
      } catch (err) {
        console.error(err);
        await this.showToast(err as string);
      } finally {
        await this.dissmissLoading();
      }
    }
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
<template>
  <div class="tx__content">
    <TransactionIcon :transaction-type="type" />
    <div class="tx__content__left">
      <h3>{{ caption }}</h3>
      <span>from&nbsp;</span>
      <router-link
        :to="{
          name: `validator`,
          params: {
            validator: transaction.details.from[0],
            networkId: network,
          },
        }"
      >
        <img
          v-if="validator && validator.picture"
          :src="validator.picture"
          class="validator-image"
          :alt="`validator logo for ` + validator.name"
        />
        {{ transaction.details.from[0] | resolveValidatorName(validators) }}
      </router-link>
    </div>
    <div class="tx__content__right">
      <p class="amount">
        {{ transaction.details.amount.amount | prettyLong }}&nbsp;
        {{ transaction.details.amount.denom }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { prettyLong } from "scripts/num.js"
import { resolveValidatorName } from "src/filters"
import TransactionIcon from "../TransactionIcon"

export default {
  name: `unstake-tx-details`,
  filters: {
    prettyLong,
    resolveValidatorName,
  },
  components: {
    TransactionIcon,
  },
  props: {
    transaction: {
      type: Object,
      required: true,
    },
    validators: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      type: `Unstaked`,
      caption: `Unstaked`,
    }
  },
  computed: {
    ...mapGetters([`network`]),
    validator() {
      return this.validators[this.transaction.details.from[0]] || false
    },
  },
}
</script>

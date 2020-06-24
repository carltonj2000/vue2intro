Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>`,
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
      <div class="product">
        <div class="product-image">
          <img :src="variantSelected.image" :alt="description" />
        </div>
        <div class="product-info">
          <h1>{{ title }}</h1>
          <p>Shipping: {{shipping}}</p>
          <p v-if="variantSelected.quantity > 3">
            In Stock ({{ variantSelected.quantity }})
          </p>
          <p v-else-if="variantSelected.quantity > 0">
            Almost Sold Out ({{ variantSelected.quantity }})
          </p>
          <p v-else>Out of Stock</p>
          <p v-show="onSale">On Sale</p>
          <product-details :details="details"></product-details>
          <ul>
            <li :key="size" v-for="size in sizes">{{ size }}</li>
          </ul>
          <div
            v-for="variant in variants"
            :key="variant.id"
            class="color-box"
            :style="{background: variant.color}"
            @mouseover="variantSelect(variant.id)"
          ></div>
        </div>
        <button
          @click="addToCart"
          :disabled="!inStock"
          :class="{disabledButton: !inStock}"
        >
          Add to Cart
        </button>
        <button
          @click="removeFromCart"
          :disabled="!canRemove"
          :class="{disabledButton: !canRemove}"
        >
          Remove from Cart
        </button>
        <div class="cart"><p>Cart ({{cartCount}})</p></div>
      </div>
  `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      description: "Wear on Feet",
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      onSale: false,
      variants: [
        {
          id: 2234,
          color: "green",
          image: "assets/vmSocks-green-onWhite.jpg",
          quantity: 2,
        },
        {
          id: 2235,
          color: "blue",
          image: "assets/vmSocks-blue-onWhite.jpg",
          quantity: 4,
        },
      ],
      variantSelectedId: 2235,
      sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
      cart: [],
    };
  },
  methods: {
    addToCart() {
      const { variantSelected, variantSelectedId, variants, cart } = this;
      if (variantSelected.quantity <= 0) return;
      const inCart = cart.find((variant) => variant.id === variantSelectedId);
      if (inCart) {
        inCart.quantity++;
      } else {
        this.cart.push({ id: this.variantSelectedId, quantity: 1 });
      }
      const vrnt = variants.find((variant) => variant.id === variantSelectedId);
      vrnt.quantity--;
    },
    removeFromCart() {
      const { cart, variantSelectedId, variants } = this;
      if (cart.length <= 0) return;
      const inCart = cart.find((variant) => variant.id === variantSelectedId);
      if (!inCart) return;
      inCart.quantity--;
      const vrnt = variants.find((variant) => variant.id === variantSelectedId);
      vrnt.quantity++;
    },
    variantSelect(id) {
      this.variantSelectedId = id;
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    shipping() {
      return this.premium ? "Free" : 2.99;
    },
    inStock() {
      return this.variantSelected.quantity > 0;
    },
    cartCount() {
      const { cart } = this;
      if (cart.length <= 0) return 0;
      return cart.reduce((acc, items) => acc + items.quantity, 0);
    },
    canRemove() {
      const { cart, variantSelectedId } = this;
      if (cart.length <= 0) return false;
      const inCart = cart.find((variant) => variant.id === variantSelectedId);
      if (!inCart) return false;
      if (!inCart.quantity) return false;
      if (inCart.quanty <= 0) return false;
      return true;
    },
    variantSelected() {
      return this.variants.find(
        (variant) => this.variantSelectedId === variant.id
      );
    },
  },
});

const app = new Vue({
  el: "#app",
  data: {
    premium: false,
  },
});
